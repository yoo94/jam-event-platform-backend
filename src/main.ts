import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import routes from "./routes";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import { SECRET_KEY } from "./lib/constants.js";
import { currentlyAuthPlugin } from "./plugin/authPlugin.js";
import { checkStartupUser, checkStartupArticle } from "./startup/inedx";
import { swaggerOptions, swaggerUIOptions } from "./config/swagger.js";
import fs from 'fs';

const fastify = Fastify({
  logger: true,
  // 주석 풀면 openssl을 사용하여 HTTPS 설정 가능
  // https: {
  //   key: fs.readFileSync('./server.key'),
  //   cert: fs.readFileSync('./server.crt'),
  // }
}).withTypeProvider<TypeBoxTypeProvider>();

// Swagger 등록
await fastify.register(import('@fastify/swagger'), swaggerOptions);
await fastify.register(import('@fastify/swagger-ui'), swaggerUIOptions);

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
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();