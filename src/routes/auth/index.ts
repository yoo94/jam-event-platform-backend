import { loginSchema, registerSchema,logoutSchema,refreshTokenSchema } from "../../schema";
import {TAuthBody} from "../../schema/types";
import { FastifyInstance ,FastifyRequest, FastifyReply} from "fastify";
import authService from "../../services/authService";
import { ERROR_MESSAGE,SUCCESS_MESSAGE } from "../../lib/constants";
import { handleError } from "../../lib/errorHelper";

const authRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    "/register",
    {
      schema: {
        ...registerSchema,
        tags: ['auth'],
        summary: '사용자 회원가입',
        description: '새로운 사용자를 등록합니다'
      },
    },
    async (request: FastifyRequest<{Body: TAuthBody}>, reply: FastifyReply) => {
      const {email, pwd} = request.body;
      try {
        const service = authService();
        await service.register(email,pwd);
        reply.status(SUCCESS_MESSAGE.registerOk.status).send(SUCCESS_MESSAGE.registerOk);
      } catch (error) {
        handleError(reply, ERROR_MESSAGE.badRequest, error);
      }
    }
  );
  
  fastify.post('/login', {
    schema: {
      ...loginSchema,
      tags: ['auth'],
      summary: '사용자 로그인',
      description: '이메일과 비밀번호로 로그인합니다'
    }
  }, async (req:FastifyRequest<{Body: TAuthBody}>, rep: FastifyReply) => {
    const { email, pwd } = req.body

    try {
      const service = authService();
      const values = await service.loginWithPassword(email, pwd)

      rep.setCookie('refresh_token', values.refreshToken, {
        domain: 'localhost',
        sameSite:'none',
        secure: true,
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      })  

      const result = {
        id: values.id,
        email: values.email,
        Authorization: values.accessToken,        
      }

      rep.status(201).send(result)
    }
    catch(error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error)
    }
  })

  fastify.delete('/logout', {
    schema: {
      ...logoutSchema,
      tags: ['auth'],
      summary: '사용자 로그아웃',
      description: '현재 로그인된 사용자를 로그아웃합니다'
    }
  }, async (req: FastifyRequest, rep: FastifyReply) => {
    const refresh_token = req.cookies.refresh_token;
    if(!refresh_token) {
      return rep.status(ERROR_MESSAGE.unauthorized.status).send(ERROR_MESSAGE.unauthorized);
    }
    try{
      await authService().logout(refresh_token);
      rep.clearCookie('refresh_token', {path:'/'});
      rep.status(SUCCESS_MESSAGE.logoutOk.status).send(SUCCESS_MESSAGE.logoutOk);
    }catch(error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error)
    }
  })

  fastify.post('refresh', {
    schema: {
      ...refreshTokenSchema,
      tags: ['auth'],
      summary: '토큰 갱신',
      description: 'Refresh Token으로 새로운 Access Token을 발급받습니다'
    }
  }, async (req: FastifyRequest, rep: FastifyReply) => {
    const refresh_token = req.cookies.refresh_token;
    if(!refresh_token) {
      return rep.status(ERROR_MESSAGE.unauthorized.status).send(ERROR_MESSAGE.unauthorized);
    }
    try {
      const result = await authService().refresh(refresh_token);
      rep.status(201).send(result);
    } catch (error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error);
    }
  })
}


export default authRoute;