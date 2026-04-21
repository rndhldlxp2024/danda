'use strict'

module.exports = async function (fastify, opts) {
  // GET /api/users
  fastify.get('/', async function (request, reply) {
    return await fastify.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
  })

  // POST /api/users (keep this for testing purposes)
  fastify.post('/', async function (request, reply) {
    const { email, name, role } = request.body
    return await fastify.prisma.user.create({
      data: {
        email,
        name,
        role: role || 'TEACHER'
      }
    })
  })
}
