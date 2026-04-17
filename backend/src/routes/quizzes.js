import { eq, desc, sql } from 'drizzle-orm';

export default async function (fastify, opts) {
  /**
   * 새로운 퀴즈 및 질문 생성
   * POST /api/quizzes
   */
  fastify.post('/', {
    schema: {
      tags: ['Quizzes'],
      summary: 'Create a new quiz with questions',
    }
  }, async (request, reply) => {
    const { title, subject, teacherId, questions } = request.body;

    if (!title || !questions || !Array.isArray(questions)) {
      return reply.code(400).send({ error: 'Invalid quiz data' });
    }

    // Drizzle Transaction to ensure both quiz and questions are created
    const result = await fastify.db.transaction(async (tx) => {
      const [newQuiz] = await tx.insert(fastify.schema.quizzes).values({
        id: crypto.randomUUID(),
        title,
        subject,
        teacherId,
        updatedAt: new Date(),
      }).returning();

      const newQuestions = await tx.insert(fastify.schema.questions).values(
        questions.map((q) => ({
          id: crypto.randomUUID(),
          quizId: newQuiz.id,
          content: q.content,
          options: q.options,
          answer: q.answer,
          timeLimit: q.timeLimit || 30,
          points: q.points || 1000,
          updatedAt: new Date(),
        }))
      ).returning();

      return { ...newQuiz, questions: newQuestions };
    });

    return result;
  });

  /**
   * 교사 전용 테스트 API (Drizzle 연동 확인용)
   */
  fastify.get('/teacher/test', async (request, reply) => {
    return { message: "Drizzle is working!", timestamp: new Date() };
  });

  /**
   * 교사의 퀴즈 목록 조회
   */
  fastify.get('/teacher/:teacherId', {
    schema: {
      tags: ['Quizzes'],
      summary: 'Get all quizzes created by a teacher',
    }
  }, async (request, reply) => {
    const { teacherId } = request.params;
    
    // Drizzle에서 Join 혹은 Subquery를 이용한 카운트 조회
    const teacherQuizzes = await fastify.db.select({
      id: fastify.schema.quizzes.id,
      title: fastify.schema.quizzes.title,
      subject: fastify.schema.quizzes.subject,
      createdAt: fastify.schema.quizzes.createdAt,
      questionCount: sql`count(${fastify.schema.questions.id})`.mapWith(Number),
    })
    .from(fastify.schema.quizzes)
    .leftJoin(fastify.schema.questions, eq(fastify.schema.quizzes.id, fastify.schema.questions.quizId))
    .where(eq(fastify.schema.quizzes.teacherId, teacherId))
    .groupBy(fastify.schema.quizzes.id)
    .orderBy(desc(fastify.schema.quizzes.createdAt));

    return teacherQuizzes;
  });

  /**
   * 특정 퀴즈 상세 조회
   */
  fastify.get('/:quizId', async (request, reply) => {
    const { quizId } = request.params;
    
    const quiz = await fastify.db.query.quizzes.findFirst({
      where: eq(fastify.schema.quizzes.id, quizId),
      with: {
        questions: true
      }
    });

    if (!quiz) {
      return reply.code(404).send({ error: 'Quiz not found' });
    }
    return quiz;
  });
}

export const autoPrefix = '/api/quizzes';
