import * as XLSX from 'xlsx';
import { eq } from 'drizzle-orm';

export default async function (fastify, opts) {
  /**
   * 학생 명단 엑셀 업로드 API
   * POST /api/students/upload/:classId
   */
  fastify.post('/upload/:classId', {
    schema: {
      tags: ['Students'],
      summary: 'Upload student list via Excel',
    }
  }, async (request, reply) => {
    const { classId } = request.params;
    const data = await request.file();
    
    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }

    const buffer = await data.toBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Drizzle Batch Upsert Logic
    const results = await Promise.all(
      rows.map(async (row) => {
        const studentData = {
          id: crypto.randomUUID(),
          studentId: String(row['학번']),
          name: row['이름'],
          gender: row['성별'],
          grade: Number(row['학년'] || 1),
          classNum: Number(row['반'] || 1),
          number: row['번호'] ? Number(row['번호']) : null,
          classId: classId,
          updatedAt: new Date(),
        };

        return fastify.db.insert(fastify.schema.students)
          .values(studentData)
          .onConflictDoUpdate({
            target: fastify.schema.students.studentId,
            set: {
              name: studentData.name,
              gender: studentData.gender,
              number: studentData.number,
              updatedAt: new Date(),
            }
          })
          .returning();
      })
    );

    return { 
      message: 'Students uploaded successfully with Drizzle', 
      count: results.length 
    };
  });

  /**
   * 특정 학급의 학생 목록 조회
   */
  fastify.get('/:classId', {
    schema: {
      tags: ['Students'],
      summary: 'Get students in a class',
    }
  }, async (request, reply) => {
    const { classId } = request.params;
    
    const students = await fastify.db.select()
      .from(fastify.schema.students)
      .where(eq(fastify.schema.students.classId, classId))
      .orderBy(fastify.schema.students.number);
      
    return students;
  });
}

// 헬퍼: 라우트 프리픽스 설정
export const autoPrefix = '/api/students';
