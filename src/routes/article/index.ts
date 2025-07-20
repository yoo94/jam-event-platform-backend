import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createArticleSchema,deleteArticleSchema,readArticleOneSchema,readArticlesSchema,updateArticleSchema } from '../../schema'
import { TCommonHeaders, TCommonBody, TCommonParam, TCommonQuery } from '../../schema/types'
import { handleError } from '../../lib/errorHelper'
import { verifySignIn } from '../../lib/authHelper'

import { CATEGORY_TYPE, ERROR_MESSAGE } from '../../lib/constants'
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

  fastify.route({
    method: 'GET',
    url: '/:articleId',
    schema: {
      ...readArticleOneSchema,
      tags: ['articles'],
      summary: '게시글 조회',
      description: '지정된 게시글을 한개 조회합니다'
    },
    handler: async (req: FastifyRequest<{Params: TCommonParam}>, rep: FastifyReply) => {
      const articleId = Number(req.params.articleId)
      try {
        const result = await articleService.readArticleOne(articleId)
        if (!result) {
          return rep.status(ERROR_MESSAGE.notFound.status).send(ERROR_MESSAGE.notFound)
        }
        rep.status(200).send(result)
      } catch (error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/',
    schema: { ...readArticlesSchema,
      tags: ['articles'],
      summary: '게시글 목록 조회',
      description: '게시글 목록을 조회합니다. 페이지네이션을 지원합니다'
     },
    handler: async (req: FastifyRequest<{Headers: TCommonHeaders,Querystring: TCommonQuery}>, rep: FastifyReply) => {
      const {pageNumber=0, mode=CATEGORY_TYPE.ALL} = req.query
      const userId = req.user ? req.user.id : undefined
      try {
        const result = await articleService.readArticleList(pageNumber, mode, userId)
        if (!result) {
          return rep.status(ERROR_MESSAGE.notFound.status).send(ERROR_MESSAGE.notFound)
        }
        rep.status(200).send(result)
      } catch (error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)
      }
    }
  })

}

export default articleRoute