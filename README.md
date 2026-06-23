# Ecatu Ronald – Professional Portfolio

A premium full-stack portfolio website for **Ecatu Ronald**, Senior Automotive Technician at Tata Uganda Ltd.

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Axios |
| Backend    | Node.js, Express 4, TypeScript, Mongoose          |
| Database   | MongoDB 7                                         |
| DevOps     | Docker, Docker Compose, Nginx                     |
| Quality    | ESLint, Prettier, Husky, lint-staged              |
| API Docs   | Swagger / OpenAPI 3.0                             |

## Project Structure

```
my-website/
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/            # Axios client & API endpoints
│   │   ├── components/     # UI components (Header, Hero, …)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components (Home, NotFound)
│   │   └── types/          # TypeScript type definitions
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                # Express + TypeScript API
│   ├── src/
│   │   ├── config/         # DB connection, Swagger config
│   │   ├── controllers/    # Route handler logic
│   │   ├── middleware/     # Auth, rate limiting, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express route definitions
│   │   └── utils/          # Logger (Winston)
│   └── Dockerfile
│
├── docker-compose.yml      # Production Docker Compose
├── docker-compose.dev.yml  # Development Docker Compose
├── .env.example            # Environment variable template
└── package.json            # Root scripts & Husky config
```

## Quick Start

### 1. Prerequisites

- Node.js 22+
- MongoDB 7 (or Docker)
- npm 10+

### 2. Environment Setup

```bash
cp .env.example backend/.env
# Edit backend/.env with your values
```

### 3. Frontend (Dev)

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:3000
```

### 4. Backend (Dev)

```bash
cd backend
npm install
npm run dev
# API runs at http://localhost:5000
# Swagger docs at http://localhost:5000/api/docs
```

### 5. Docker (Full Stack)

**Development:**
```bash
npm run docker:dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# MongoDB:  mongodb://localhost:27017
```

**Production:**
```bash
# Copy and fill env vars
cp .env.example .env
# Edit JWT_SECRET, MONGO_ROOT_PASSWORD etc.

npm run docker:prod
# Site: http://localhost
# API docs: http://localhost/api/docs
```

## API Endpoints

| Method | Endpoint                     | Description                  | Auth  |
|--------|------------------------------|------------------------------|-------|
| GET    | /api/health                  | Health check                 | ✗     |
| POST   | /api/contact                 | Submit contact form          | ✗     |
| GET    | /api/contact                 | List contact submissions     | Admin |
| GET    | /api/projects                | List projects                | ✗     |
| GET    | /api/projects/:id            | Get project by ID            | ✗     |
| GET    | /api/blog                    | List published posts         | ✗     |
| GET    | /api/blog/:slug              | Get post by slug             | ✗     |
| GET    | /api/testimonials            | List testimonials            | ✗     |
| POST   | /api/newsletter/subscribe    | Subscribe to newsletter      | ✗     |
| POST   | /api/newsletter/unsubscribe  | Unsubscribe from newsletter  | ✗     |

Full interactive documentation is available at `/api/docs` (Swagger UI).

## Available Scripts

From the **repository root**:

| Script              | Description                              |
|---------------------|------------------------------------------|
| `npm run dev:frontend`  | Start frontend dev server            |
| `npm run dev:backend`   | Start backend dev server             |
| `npm run build`         | Build both frontend & backend        |
| `npm run lint`          | Lint both frontend & backend         |
| `npm run format`        | Format all files with Prettier       |
| `npm run docker:dev`    | Start full stack in Docker (dev)     |
| `npm run docker:prod`   | Start full stack in Docker (prod)    |
| `npm run docker:down`   | Stop Docker containers               |

## Security Features

- **Helmet** – security HTTP headers
- **CORS** – origin whitelist configurable via `.env`
- **Rate Limiting** – general (100 req/15 min), contact (5/hr), newsletter (3/hr)
- **JWT** – token-based ****** structure for admin endpoints
- **Input Validation** – express-validator on all POST routes
- **Request Size Limit** – 10 KB max body

## Database Schemas

| Collection              | Purpose                                    |
|-------------------------|--------------------------------------------|
| `contactsubmissions`    | Contact form submissions with status       |
| `blogposts`             | Blog articles with slug, tags, views       |
| `projects`              | Portfolio projects with tags and links     |
| `testimonials`          | Client testimonials (moderation flow)      |
| `newslettersubscriptions` | Email subscriptions with unsub support  |

## Environment Variables

See [`.env.example`](.env.example) for all available configuration options.

## Author

**Ecatu Ronald** – Senior Automotive Technician  
📧 ronaldecatu@gmail.com  
📞 +256 780 697 149  
🏢 Tata Uganda Ltd
