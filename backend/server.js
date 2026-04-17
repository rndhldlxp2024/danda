import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Fastify Server Launcher
 */
const start = async () => {
  const fastify = Fastify({
    logger: {
      level: 'info',
    },
  });

  try {
    // 1. Plugins 자동 로드 (Swagger, Socket.io, C)
    await fastify.register(autoload, {
      dir: join(__dirname, 'src/plugins'),
    });

    // 2. Routes 자동 로드
    await fastify.register(autoload, {
      dir: join(__dirname, 'src/routes'),
    });

    const PORT = process.env.PORT || 4000;
    const HOST = '0.0.0.0';

    await fastify.listen({ port: Number(PORT), host: HOST });

    console.log(`
    \x1b[38;5;154m✨ DANDA Backend is now live in Modular Architecture!\x1b[0m
    \x1b[38;5;39m➜\x1b[0m Local:    \x1b[1mhttp://localhost:${PORT}/\x1b[0m
    \x1b[38;5;39m➜\x1b[0m Swagger:  \x1b[1mhttp://localhost:${PORT}/docs\x1b[0m
    \x1b[38;5;244mReady for Real-time Quiz Sessions.\x1b[0m
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Graceful Shutdown
  const listeners = ['SIGINT', 'SIGTERM'];
  listeners.forEach((signal) => {
    process.on(signal, async () => {
      await fastify.close();
      process.exit(0);
    });
  });
};

start();
