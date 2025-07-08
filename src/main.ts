import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import routes from "./routes/index.js";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import {SECRET_KEY} from "./lib/constants.js";

const fastify = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(fastifyCookie, {
  secret: SECRET_KEY, 
  } as FastifyCookieOptions);

fastify.register(routes);

const start = async () => {
  try {
    await fastify.listen({ port: 8083 });
    console.log("Server is running on http://localhost:8083");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();