# Workspace

## Overview

Full-stack Teacher Auth Management System built with TypeScript, Express, React + Vite, and PostgreSQL.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)
- **Frontend**: React + Vite, Tailwind CSS, React Hook Form, Lucide React, Framer Motion
- **Auth**: JWT (jsonwebtoken) + bcryptjs

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── web-app/            # React + Vite frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Tables

### `auth_user`
- `id` (serial PK)
- `email` (text, unique, not null)
- `first_name` (text, not null)
- `last_name` (text, not null)
- `password` (text, hashed with bcrypt)
- `phone` (text, nullable)
- `is_active` (boolean, default true)
- `created_at`, `updated_at` (timestamps)

### `teachers`
- `id` (serial PK)
- `user_id` (integer FK → auth_user.id, unique, cascade delete)
- `university_name` (text, not null)
- `gender` (text, not null)
- `year_joined` (integer, not null)
- `subject` (text, not null)
- `bio` (text, nullable)
- `created_at`, `updated_at` (timestamps)

## API Endpoints

### Auth (no auth required)
- `POST /api/auth/register` — Register new user → returns JWT token
- `POST /api/auth/login` — Login → returns JWT token

### Auth (Bearer token required)
- `GET /api/auth/me` — Get current user profile
- `GET /api/users` — List all users

### Teachers
- `POST /api/teachers` — Create teacher + user account in one request (no auth)
- `GET /api/teachers` — List all teachers with user data (auth required)

## Frontend Pages
- `/login` — Login page
- `/register` — Register page  
- `/` — Dashboard (protected)
- `/users` — Users data table (protected)
- `/teachers` — Teachers data table (protected)
- `/teachers/create` — Create teacher form (not protected)

## JWT Authentication
- Token stored in `localStorage` under key `auth_token`
- Sent as `Authorization: Bearer <token>` header
- 7-day expiration
- Secret: `JWT_SECRET` env var (defaults to dev fallback)
