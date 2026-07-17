# Shyaam Admin API

Production-ready REST API backend for the Shyaam International visa consultancy admin panel.

## Stack

- Node.js 20+, Express 5, TypeScript
- PostgreSQL + Prisma ORM
- Redis (caching + rate limiting)
- JWT auth with refresh tokens + RBAC

## Quick start

### 1. Start infrastructure

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work with docker-compose).

### 4. Run migrations & seed

```bash
npx prisma migrate dev --name init
npm run seed
```

### 5. Start dev server

```bash
npm run dev
```

API base URL: `http://localhost:4000/api`

Health check: `GET http://localhost:4000/api/health`

## Connect frontend

In `admin-panel-visa-website/.env`:

```env
VITE_API_URL=http://localhost:4000/api
VITE_USE_MOCK_API=false
```

Default admin credentials (from seed):

- Email: `admin@shyaam.in`
- Password: `admin123`

## Phase 1 endpoints (implemented)

| Module | Routes |
|--------|--------|
| Auth | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `POST /auth/refresh` |
| Dashboard | `GET /admin/dashboard` |
| Leads | `GET /admin/leads`, `GET /admin/leads/:id`, `PATCH /admin/leads/:id/status`, `GET /admin/leads/export` |
| Public | `POST /public/leads` |
| Countries | Full CRUD on `/admin/countries` (slug-based) |
| Services | Full CRUD on `/admin/services` (slug-based) |
| Blogs | Full CRUD on `/admin/blogs` (slug-based) |

## Phase 2 endpoints (scaffolded)

Universities, Events, Testimonials, FAQs, Careers, Media, Users, Settings — basic CRUD structure in place.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm run migrate` | Prisma migrate dev |
| `npm run seed` | Seed database |
| `npm run lint` | Type check |

## Response format

```json
{ "data": {}, "message": "optional" }
```

Paginated lists:

```json
{ "data": [], "meta": { "page": 1, "perPage": 20, "total": 100, "totalPages": 5 } }
```

Errors:

```json
{ "message": "Human readable error", "errors": { "field": ["message"] } }
```

## Architecture

```
routes → controllers → services → repositories → Prisma → PostgreSQL
```

Redis cache-aside on dashboard stats and content reads. Rate limits on auth, public leads, and admin routes.
