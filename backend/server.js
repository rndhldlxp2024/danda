'use strict'

// Read the .env file.
require('dotenv').config()

// Require the framework and instantiate it
const Fastify = require('fastify')
const app = require('./src/app.js')

const server = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  }
})

// Register CORS
server.register(require('@fastify/cors'), {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

// Register the application
server.register(app)

// Start listening.
const start = async () => {
  try {
    const port = process.env.PORT || 4000
    await server.listen({ port: Number(port), host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
