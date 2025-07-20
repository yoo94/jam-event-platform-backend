import db from '../lib/db'
import { TArticle, TCommonPagenation } from '../schema/types'
import { getCurrentDate } from '../lib/timeHelper'
import { ERROR_MESSAGE } from '../lib/constants'

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


  return {
    createArticle,
  }
}

export default articleService()