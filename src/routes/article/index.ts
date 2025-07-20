import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createArticleSchema,deleteArticleSchema,updateArticleSchema } from '../../schema'
import { TCommonHeaders, TCommonBody, TCommonParam } from '../../schema/types'
import { handleError } from '../../lib/errorHelper'
import { verifySignIn } from '../../lib/authHelper'

import { ERROR_MESSAGE } from '../../lib/constants'
import articleService from '../../services/articleService'

const articleRoute = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    schema: {
      ...createArticleSchema,
      tags: ['articles'],
      summary: '게시글 작성',
      description: '새로운 게시글을 작성합니다'
    },
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
    schema: {
      ...updateArticleSchema,
      tags: ['articles'],
      summary: '게시글 수정',
      description: '기존 게시글을 수정합니다'
    },
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

  fastify.route({
    method: 'DELETE',
    url: '/:articleId',
    preHandler: [verifySignIn],
    schema: {
      ...deleteArticleSchema,
      tags: ['articles'],
      summary: '게시글 삭제',
      description: '지정된 게시글을 삭제합니다'
    },
    handler: async (req: FastifyRequest<{Headers: TCommonHeaders, Params: TCommonParam}>, rep: FastifyReply) => {
      try {
        const articleId = Number(req.params.articleId)
        const userId = req.user!.id
        const result = await articleService.deleteArticle(articleId, userId)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)
      }
    }
  })
}

export default articleRoute