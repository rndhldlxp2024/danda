'use strict'

const fp = require('fastify-plugin')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

module.exports = fp(async function (fastify, opts) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    await prisma.$connect()
    fastify.log.info('Database connected successfully')
  } catch (err) {
    fastify.log.error('Database connection failed')
    fastify.log.error(err)
    throw err
  }

  // Decorate the fastify instance with our prisma client
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (fastify) => {
    await fastify.prisma.$disconnect()
    await pool.end()
  })
})
