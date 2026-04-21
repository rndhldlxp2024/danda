'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/health', async function (request, reply) {
    try {
      // Use $queryRaw for a lightweight DB check
      await fastify.prisma.$queryRaw`SELECT 1`
      return { 
        status: 'ok',
        message: 'DANDA Backend is running',
        database: 'DB Connected'
      }
    } catch (err) {
      return reply.status(500).send({
        status: 'error',
        message: 'DANDA Backend is running',
        database: 'DB Error',
        error: err.message
      })
    }
  })
}
