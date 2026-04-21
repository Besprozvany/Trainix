# Trainix

Service booking platform for fitness trainers. Book sessions, manage schedules, and track appointments.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Framer Motion |
| Backend  | NestJS, TypeScript, Prisma ORM          |
| Database | PostgreSQL 16                           |
| Auth     | JWT (access + refresh tokens)           |

## Architecture

```
trainix/
├── apps/
│   ├── backend/     # NestJS REST API
│   └── frontend/    # React SPA
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Setup backend

```bash
cd apps/backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### 3. Setup frontend

```bash
cd apps/frontend
npm install
npm run dev
```

API runs on `http://localhost:3000`
Frontend runs on `http://localhost:5173`
