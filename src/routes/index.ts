import { FastifyInstance } from "fastify";
import authRoute from "./auth/index.js";

const routes = async (fastify: FastifyInstance) => {
  await fastify.register(authRoute, { prefix: "/auth" });
};

export default routes;
