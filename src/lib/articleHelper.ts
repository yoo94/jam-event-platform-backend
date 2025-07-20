import { TArticle } from "../schema/types";
import db from "./db";

// articleId로 검색된 유저와 로그인 정보로 받은 유저 아이디를 비교해 같으면 true
const verifyArticleUser = async (articleId: number, userId: number) => {
    try {
        const article = await db.article.findUnique({ where: { id: articleId }, select: { userId: true } })
        if (!article) return false
        return article.userId === userId
    } catch (error) {
        throw new Error("Error verifying article user: " + error.message)
    }
}
const likeCompareArticles = async (articles:TArticle[], userId: number) => {

  type TArticlesIds = {
    articleId: number
  }
  const articlesIds = articles.map(article => article.id)
  let likes: TArticlesIds[] = await db.like.findMany({
    where: {
      userId: userId,
      articleId: {
        in: articlesIds
      }
    },
    select: {
      articleId: true
    }
  })
  const verifyLikeMe = (article: TArticle, likes: TArticlesIds[] ) => {
    article.likeMe = false
    const likeArticle = likes.some(like => like.articleId === article.id)
    if(likeArticle) article.likeMe = true
    return article
  }
  const articlesWithLike:TArticle[] = articles.map(article => verifyLikeMe(article, likes))
  return articlesWithLike
}

export { verifyArticleUser, likeCompareArticles };