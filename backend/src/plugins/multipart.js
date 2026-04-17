import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

export default fp(async (fastify) => {
  await fastify.register(multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100,     // Max field value size in bytes
      fields: 10,         // Max number of non-file fields
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 1,           // Max number of file fields
    },
  });
});
