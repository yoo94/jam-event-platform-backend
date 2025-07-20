import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createArticleSchema,updateArticleSchema } from '../../schema'
import { TCommonHeaders, TCommonBody } from '../../schema/types'
import { handleError } from '../../lib/errorHelper'
import { verifySignIn } from '../../lib/authHelper'

import { ERROR_MESSAGE } from '../../lib/constants'
import articleService from '../../services/articleService'

const articleRoute = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    schema: createArticleSchema,
    url: '/',
    preHandler: [verifySignIn],
    handler: async (req:FastifyRequest<{Headers: TCommonHeaders, Body: TCommonBody}>, rep: FastifyReply) => {
      const { content } = req.body
      const userId = req.user!.id
      const email = req.user!.email

      try {
        const result = await articleService.createArticle(Number(userId), email, content)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)         
      }
    }
  })

  fastify.route({
    method: 'PUT',
    schema: updateArticleSchema,
    url: '/',
    preHandler: [verifySignIn],
    handler: async (req:FastifyRequest<{Headers: TCommonHeaders, Body: TCommonBody, Params: { articleId: number }}>, rep: FastifyReply) => {
      const { articleId, content } = req.body
      const userId = req.user!.id
      const email = req.user!.email

      try {
        const result = await articleService.updateArticle(articleId, userId, content, email)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)
      }
    }
  })
}

export default articleRoute