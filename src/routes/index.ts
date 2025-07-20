import { FastifyInstance } from "fastify";
import authRoute from "./auth/index.js";
import articleRoute from "./article/index.js";

const routes = async (fastify: FastifyInstance) => {
  await fastify.register(authRoute, { prefix: "/auth" });
  await fastify.register(articleRoute, { prefix: "/articles" });
};

export default routes;
