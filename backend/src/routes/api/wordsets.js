/**
 * @type {import('fastify').FastifyPluginAsync}
 */
export default async function (fastify, opts) {
  const { prisma } = fastify;

  // POST /api/wordsets - 단어장 및 단어 대량 등록
  fastify.post('/', async (request, reply) => {
    try {
      const { title, description, words } = request.body;

      if (!title || !words || !Array.isArray(words)) {
        return reply.status(400).send({ 
          error: 'Required fields: title and words (array)' 
        });
      }

      // 1. 임시로 사용할 교사(User) 조회
      // 실제 로그인 기능이 도입되면 request.user.id 등을 사용해야 함
      let teacher = await prisma.user.findFirst();
      
      // 유저가 하나도 없다면 임시로 생성 (테스트용)
      if (!teacher) {
        teacher = await prisma.user.create({
          data: {
            email: 'admin@danda.voca',
            name: 'Default Teacher',
            role: 'TEACHER'
          }
        });
      }

      // 2. WordSet 및 Word 중첩 생성
      const newWordSet = await prisma.wordSet.create({
        data: {
          title,
          description,
          teacherId: teacher.id,
          words: {
            create: words.map(w => ({
              english: w.english,
              korean: w.korean,
              partOfSpeech: w.partOfSpeech || 'NOUN',
              example: w.example || null,
              difficulty: 1 // 기본값
            }))
          }
        },
        include: {
          words: true // 생성된 단어 목록까지 포함해서 응답
        }
      });

      fastify.log.info(`New WordSet created: ${newWordSet.id} with ${newWordSet.words.length} words`);
      
      return reply.status(201).send(newWordSet);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ 
        error: 'Failed to create WordSet',
        details: error.message 
      });
    }
  });

  // GET /api/wordsets - 단어장 목록 조회 (UI 확인용 보너스)
  fastify.get('/', async (request, reply) => {
    try {
      const wordSets = await prisma.wordSet.findMany({
        include: {
          _count: {
            select: { words: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return wordSets;
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch wordsets' });
    }
  });
}
