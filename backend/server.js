import Fastify from 'fastify';
import cors from '@fastify/cors';

/**
 * Fastify Server Instance
 */
const fastify = Fastify({
  logger: {
    level: 'info',
  },
});

/**
 * Middleware & Plugins
 */
await fastify.register(cors, {
  origin: true, // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

/**
 * Simple Health Check & Root Route
 */
fastify.get('/', async () => {
  return {
    name: 'DANDA API',
    status: 'running',
    version: '1.0.0',
    uptime: process.uptime(),
  };
});

fastify.get('/health', async () => {
  return {
    status: 'UP',
    timestamp: new Date().toISOString(),
  };
});

/**
 * Server Launcher
 */
const start = async () => {
  try {
    const PORT = process.env.PORT || 4000;
    const HOST = '0.0.0.0';

    await fastify.listen({ port: Number(PORT), host: HOST });

    console.log(`
    \x1b[38;5;154m✨ DANDA Backend is now live!\x1b[0m
    \x1b[38;5;39m➜\x1b[0m Local:    \x1b[1mhttp://localhost:${PORT}/\x1b[0m
    \x1b[38;5;39m➜\x1b[0m Network:  \x1b[1mhttp://127.0.0.1:${PORT}/\x1b[0m
    \x1b[38;5;244mMonitoring active. Press Ctrl+C to stop.\x1b[0m
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful Shutdown
const listeners = ['SIGINT', 'SIGTERM'];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();
    process.exit(0);
  });
});

start();
