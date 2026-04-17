import fp from 'fastify-plugin';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';

export default fp(async (fastify) => {
  fastify.decorate('db', db);
  fastify.decorate('schema', schema);
  
  fastify.log.info('✨ Drizzle ORM connected successfully');
});
