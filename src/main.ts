import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import routes from "./routes/index.js";

const fastify = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

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