import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import routes from "./routes";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import {SECRET_KEY} from "./lib/constants.js";
import { currentlyAuthPlugin } from "./plugin/authPlugin.js";
import { checkStartupUser, checkStartupArticle } from "./startup/inedx";

const fastify = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(fastifyCookie, {
  secret: SECRET_KEY, 
  } as FastifyCookieOptions);

fastify.register(currentlyAuthPlugin);
fastify.register(routes);

const start = async () => {
  try {
    await checkStartupUser();
    await checkStartupArticle();
    await fastify.listen({ port: 8083 });
    console.log("Server is running on http://localhost:8083");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();