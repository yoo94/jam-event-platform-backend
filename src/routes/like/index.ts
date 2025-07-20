import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { verifySignIn } from '../../lib/authHelper'
import { addLikeSchema, cancelLikeSchema, readLikesSchema } from '../../schema'
import { TCommonHeaders, TCommonQuery, TCommonParam } from '../../schema/types'
import { handleError } from '../../lib/errorHelper'
import { ERROR_MESSAGE } from '../../lib/constants'
import likeService from '../../services/likeService'

const likeRoute = async (fastify: FastifyInstance ) => {
  fastify.route({
    method: 'POST',
    schema: {
      ...addLikeSchema,
      tags: ['like'],
      summary: '좋아요 추가',
      description: '게시물에 좋아요를 추가합니다'
    },
    url: '/add/:articleId',
    preHandler: [verifySignIn],
    handler: async (req:FastifyRequest<{ Headers: TCommonHeaders, Params: TCommonParam}>, rep: FastifyReply) => {
      const { articleId } = req.params
      const userId = req.user!.id

      try {
        const result = await likeService.addLike(articleId, userId)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest,error)
      }
    }
  })

  fastify.route({
    method: 'GET',
    schema: {
      ...readLikesSchema,
      tags: ['like'],
      summary: '좋아요 목록 조회',
      description: '사용자가 좋아요한 게시물 목록을 조회합니다'
     },
    url: '/',
    preHandler: [ verifySignIn],
    handler: async (req: FastifyRequest<{Headers: TCommonHeaders, Querystring: TCommonQuery}>, rep: FastifyReply) => {
      const { pageNumber = 0 } = req.query
      const userId = req.user!.id

      try {
        const result = await likeService.readLikes(pageNumber, userId)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)
      }
    }
  })

  fastify.route({
    method: 'POST',
    schema: {
      ...cancelLikeSchema,
      tags: ['like'],
      summary: '좋아요 취소',
      description: '게시물에 대한 좋아요를 취소합니다'
    },
    url: '/cancel/:articleId',
    preHandler: [verifySignIn],
    handler: async (req:FastifyRequest<{Headers: TCommonHeaders, Params: TCommonParam}>, rep: FastifyReply) => {
      const { articleId } = req.params
      const userId = req.user!.id

      try {
        const result = likeService.cancelLike(articleId, userId)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)
      }
    }
  })
}

export default likeRoute