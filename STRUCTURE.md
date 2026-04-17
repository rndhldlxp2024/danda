# 🏗️ DANDA Project Structure

이 프로젝트는 하나의 저장소에서 프론트엔드와 백엔드를 모두 관리하는 모노레포 스타일 구조입니다.

## 📂 Directory Tree

```text
danda/ (Root)
├── .gitignore               # 통합 Git 관리 설정 (node_modules, .env 등 제외)
├── STRUCTURE.md             # 프로젝트 구조 설명 (현재 파일)
├── backend/                 # Fastify 고성능 백엔드
│   ├── docker-compose.yml   # PostgreSQL 개발 환경 설정
│   ├── package.json         # 백엔드 의존성 및 스크립트
│   ├── prisma.config.ts     # Prisma v5.21+ 설정
│   ├── server.js            # Fastify 서버 엔트리 포인트
│   ├── .env                 # 환경 변수 (DB 접속 정보 등)
│   └── prisma/
│       └── schema.prisma    # 데이터베이스 모델 정의 (User, Post)
└── frontend/                # Next.js 프론트엔드
    ├── app/                 # Next.js App Router 기반 페이지 및 컴포넌트
    ├── public/              # 이미지, 폰트 등 정적 자산
    ├── next.config.ts       # Next.js 환경 설정
    ├── package.json         # 프론트엔드 의존성 및 스크립트
    └── tsconfig.json        # TypeScript 설정
```

## 🛠️ Tech Stack & Roles

### 🟢 Backend (Fastify + Prisma)
- **Framework**: Fastify (경량 및 고성능)
- **ORM**: Prisma (Type-safe DB 조작)
- **Database**: PostgreSQL (Docker 기반)
- **Main Script**: `npm run dev` (nodemon으로 자동 재시작)

### 🔵 Frontend (Next.js)
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Main Script**: `npm run dev`

---
*Last updated: 2026-04-17*
