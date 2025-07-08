import { registerSchema } from "../../schema";
import {TAuthBody} from "../../schema/types";
import { FastifyInstance ,FastifyRequest, FastifyReply} from "fastify";
import authService from "../../services/authService";
import { ERROR_MESSAGE,SUCCESS_MESSAGE } from "../../lib/constants";
import { handleError } from "../../lib/errorHelper";

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
};

export { authRoute };