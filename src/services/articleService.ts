import db from '../lib/db'
import { TArticle, TCommonPagenation } from '../schema/types'
import { getCurrentDate } from '../lib/timeHelper'
import { ERROR_MESSAGE } from '../lib/constants'
import {verifyArticleUser} from '../lib/articleHelper'

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

  return {
    createArticle,
    updateArticle
  }
}

export default articleService()