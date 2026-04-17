export default async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    return {
      name: 'DANDA API',
      status: 'online',
      version: '1.0.0',
    };
  });

  fastify.get('/health', async (request, reply) => {
    return { status: 'UP' };
  });
}
