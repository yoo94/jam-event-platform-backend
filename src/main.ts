import Fastify from "fastify";

const fastify = Fastify();

fastify.get("/ping", async (request, reply) => {
  return 'pong\n';
});

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