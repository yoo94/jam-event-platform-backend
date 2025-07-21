import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import routes from "./routes";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import { SECRET_KEY } from "./lib/constants.js";
import { currentlyAuthPlugin } from "./plugin/authPlugin.js";
import { checkStartupUser, checkStartupArticle } from "./startup/inedx";
import { swaggerOptions, swaggerUIOptions } from "./config/swagger.js";
import fs from 'fs';
import cors from "@fastify/cors";

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
fastify.register(cors,{
  origin: true, // 모든 출처 허용
  credentials: true, // 쿠키를 포함한 요청 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메소드
  allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
});

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