import db from '../lib/db'
import { TArticle, TCommonPagenation } from '../schema/types'
import { getCurrentDate } from '../lib/timeHelper'
import { CATEGORY_TYPE, ERROR_MESSAGE } from '../lib/constants'
import {verifyArticleUser, likeCompareArticles} from '../lib/articleHelper'

function articleService() {
  const createArticle = async (id:number, email:string, content:string) => {
    try {
      const values = {
        content: content,
        userId: id,
        createdAt: getCurrentDate()
      }
      const result = await db.article.create({
        data: values
      })
      const returnValue:TArticle = {
        ...result, 
        userEmail: email,
        likeMe: false,
        createdAt: result.createdAt.toString()
      }
      return returnValue
    }
    catch(error) {
      throw error
    }
  }

  const updateArticle = async (articleId: number, userId: number, content: string, email: string) => {
    try {
      const checkVerifyUser = await verifyArticleUser(articleId, userId)
      if (checkVerifyUser) {
        const result = await db.article.update({
          where: { id: articleId },
          data: {
            content: content,
          }
        })
        
        const returnValue:TArticle = {
          ...result, 
          userEmail: email,
          likeMe: false,
          createdAt: result.createdAt.toString()
        }
        return returnValue
      }else{
        throw ERROR_MESSAGE.badRequest
      }
    } catch (error) {
      throw error
    }
  }

  const deleteArticle = async (articleId: number, userId: number) => {
    try {
      const checkVerifyUser = await verifyArticleUser(articleId, userId)
      if (checkVerifyUser) {
        const result = await db.article.delete({
          where: { id: articleId }
        })
        return result
      } else {
        throw ERROR_MESSAGE.badRequest
      }
    } catch (error) {
      throw error
    }
  }

  const readArticleOne = async (articleId: number) => {
    try {
      const articleOne = await db.article.findUnique({
        where: { id: articleId },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      })
      let returnvalue:TArticle | {};
      if (articleOne) {
        returnvalue = {
          ...articleOne,
          userEmail: articleOne.user.email,
          likeMe: false,
          createdAt: articleOne.createdAt.toString()
        }
      }else{
        returnvalue = {}
      }
      return returnvalue
    } catch (error) {
      throw error
    }
  }

  const readArticleList = async (pageNumber: number, mode:string, userId?: number) => {
    // prisma에서 제공하는 skip과 take를 사용하여 페이지네이션 구현, 
    // skip은 페이지 번호에 따라 건너뛸 레코드 수를 계산
    // take는 한 페이지에 표시할 레코드 수를 지정
    // 만약 1페이지면 skip은 0, 2페이지면 10, 3페이지면 20이 된다.
    // take가 10으로 설정되어 있으므로, 한 페이지에 10개의 레코드가 표시된다.
      const pageSize = 10
      let skip = 0;
      if (pageNumber > 1) {
        skip = (pageNumber - 1) * pageSize
      }
      let _where = {}
      if (mode === CATEGORY_TYPE.MY) {
        _where = {
          userId: userId
        }
      }
      try{
        const articles = await db.article.findMany({
          where: _where,
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            }
          },
          orderBy: {
            id: 'desc'
          },
          skip: skip,
          take: pageSize
        })
        let totalArticles = await db.article.count({
          where: _where
        })
        const totalPageCount = Math.ceil(totalArticles / pageSize)

        // articles를 flatterArticles로 변환하여 필요한 필드만 포함
        // userEmail, likeMe, createdAt 필드를 추가하여 반환
        // createdAt은 Date 객체를 문자열로 변환하여 반환
        // likeMe는 기본값으로 false로 설정
        // userEmail은 게시글 작성자의 이메일을 포함
        // likeMe는 현재 사용자가 해당 게시글을 좋아요 했는지 여부를 나타내는 필드로, 
        // 현재는 기본값으로 false로 설정되어 있다
        // 이 부분은 추후에 좋아요 기능이 구현되면 수정될 수 있다
        // flatterArticles는 TArticle[] 타입으로 변환되어 반환된다.
        // TArticle 타입은 src/schema/types.ts 파일에서 정의되어 있다.
        let flatterArticles:TArticle[] = articles.map((article) => {
          return {
            ...article,
            userEmail: article.user.email,
            likeMe: false,
            createdAt: article.createdAt.toString()
          }
        })
        let returnArticles:TArticle[]
        if (userId) {
          returnArticles = await likeCompareArticles([...flatterArticles], userId)
        } else {
          returnArticles = [...flatterArticles]
        }

        const returnValue: TCommonPagenation = {
          totalPageCount: totalPageCount,
          articleList: returnArticles,
        }
        return returnValue

      }catch(error) {
        throw error
      }
  }

  return {
    createArticle,
    updateArticle,
    deleteArticle,
    readArticleOne,
    readArticleList
  }
}

export default articleService()