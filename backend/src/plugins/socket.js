import fp from 'fastify-plugin';
import fastifySocketIO from 'fastify-socket.io';

export default fp(async (fastify) => {
  await fastify.register(fastifySocketIO, {
    cors: {
      origin: '*', // 개발 단계에서는 모든 오리진 허용
      methods: ['GET', 'POST'],
    },
  });

  // Socket.io 서버가 준비된 후 실행될 로직
  fastify.ready((err) => {
    if (err) throw err;

    fastify.io.on('connection', (socket) => {
      fastify.log.info(`Socket connected: ${socket.id}`);

      // 퀴즈 입장 (Room 참여)
      socket.on('join-quiz', (entryCode) => {
        socket.join(entryCode);
        fastify.log.info(`User ${socket.id} joined quiz room: ${entryCode}`);
      });

      // 학생이 이름을 입력하고 입장했을 때
      socket.on('user-joined', (nickname) => {
        // 소켓이 참여 중인 방들을 가져옵니다.
        const rooms = Array.from(socket.rooms);
        // 자신을 제외한 참여하고 있는 방(입장코드 방)에 브로드캐스트
        rooms.forEach(room => {
          if (room !== socket.id) {
            socket.to(room).emit('user-joined', nickname);
            fastify.log.info(`Nickname "${nickname}" broadcasted to room ${room}`);
          }
        });
      });

      socket.on('disconnect', () => {
        fastify.log.info(`Socket disconnected: ${socket.id}`);
      });
    });
  });
});
