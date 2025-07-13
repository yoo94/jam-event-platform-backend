import { loginSchema, registerSchema,logoutSchema,refreshTokenSchema } from "../../schema";
import {TAuthBody} from "../../schema/types";
import { FastifyInstance ,FastifyRequest, FastifyReply} from "fastify";
import authService from "../../services/authService";
import { ERROR_MESSAGE,SUCCESS_MESSAGE } from "../../lib/constants";
import { handleError } from "../../lib/errorHelper";
import { error } from "console";

const authRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    "/register",
    {
      schema: registerSchema,
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
  
  fastify.post('/login', {schema: loginSchema}, async (req:FastifyRequest<{Body: TAuthBody}>, rep: FastifyReply) => {
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
  
  fastify.delete('/logout', {schema: logoutSchema}, async (req: FastifyRequest, rep: FastifyReply) => {
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

  fastify.post('refresh', {schema: refreshTokenSchema}, async (req: FastifyRequest, rep: FastifyReply) => {
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