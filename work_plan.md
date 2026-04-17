# Role: Full-stack Senior Web Developer
# Context: Kahoot-style Quiz Application (Project: DANDA)

Next.js 15(Frontend)와 Fastify(Backend), Prisma(ORM), PostgreSQL을 사용하여 카후트(Kahoot) 스타일의 실시간 퀴즈 서비스를 구축하려고 합니다. 아래 요구사항을 바탕으로 [데이터베이스 스키마(Prisma)]와 [핵심 API 로직]을 설계해 주세요.

## 1. 인증 및 권한 (Better-Auth 연동)
- Better-Auth를 사용하여 인증 시스템을 구축합니다.
- User Role:
  - ADMIN: 전체 시스템 관리자
  - TEACHER: 클래스 생성, 퀴즈 출제, 결과 리포트 조회 권한
  - STUDENT: 퀴즈 참여 및 개인 성적 확인 (회원가입 여부는 선택적이지만, 여기서는 학번 기반 식별 선호)

## 2. 데이터 모델링 (Prisma Schema)
다음 엔티티를 포함하는 `schema.prisma` 코드를 작성해 주세요:
- **User**: ID, 이메일, 역할(Role), 성명
- **Class (학급)**: 학년, 반, 담당 교사 ID
- **Student (학생 정보)**: 학번(Unique), 성명, 성별, 학년, 반, 번호 (Class와 1:N 관계)
- **Quiz (퀴즈 셋)**: 제목, 과목명, 생성자(Teacher) ID
- **Question (문제)**: 퀴즈 ID 참조, 문제 내용, 보기(JSON/String), 정답, 제한시간, 점수 배점
- **QuizSession (실시간 세션)**: 현재 진행 중인 퀴즈 방 정보 (입장 코드, 상태: 대기/진행/종료)
- **QuizResult (기록)**: 세션 ID, 학생 ID, 총점, 순위, 정답 개수, 완료 시간

## 3. 핵심 비즈니스 로직 및 워크플로우
- **교사 Flow**: 로그인 -> 학급 생성 -> 학생 명단 등록 -> 퀴즈 생성 -> 특정 학급 선택 후 '퀴즈 시작' -> 실시간 세션 생성.
- **학생 Flow**: 입장 코드 입력 -> 본인 이름/학번 선택 또는 입력 -> 퀴즈 참여 -> 실시간 문제 풀이.
- **자동 저장**: 세션이 종료(Finish)되는 즉시 참가자들의 개별 점수, 선택한 답안, 최종 순위를 `QuizResult` 테이블에 자동으로 저장하는 로직.

## 4. 기술적 요구사항
- Fastify에서 실시간 처리를 위해 사용할 라이브러리 추천 (예: socket.io 등).
- Better-Auth의 세션 정보를 Fastify API에서 검증하는 미들웨어 구조 제안.
- 확장성을 고려하여 퀴즈 데이터(Question)는 JSON 형태가 아닌 개별 Row로 관리.

위 내용에 맞는 Prisma 스키마 파일과 초기 백엔드 폴더 구조를 제안해 줘.