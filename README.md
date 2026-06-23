# Ecatu Ronald – Professional Portfolio

A premium full-stack portfolio website for **Ecatu Ronald**, Senior Automotive Technician at Tata Uganda Ltd.

## Tech Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Axios |
| Backend  | Node.js, Express 4, TypeScript, Mongoose                         |
| Database | MongoDB 7                                                        |
| DevOps   | Docker, Docker Compose, Nginx                                    |
| Quality  | ESLint, Prettier, Husky, lint-staged                             |
| API Docs | Swagger / OpenAPI 3.0                                            |

## Project Structure

```
my-website/
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/            # Axios client & API endpoints
│   │   ├── components/     # UI components (Header, Hero, …)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # Theme, auth, and toast state
│   │   ├── pages/          # Page components (Home, Admin, NotFound)
│   │   └── types/          # TypeScript type definitions
│   ├── Dockerfile
│   ├── public/             # PWA manifest + service worker
│   └── nginx.conf
│
├── backend/                # Express + TypeScript API
│   ├── src/
│   │   ├── config/         # DB connection, Swagger config
│   │   ├── controllers/    # Route handler logic
│   │   ├── middleware/     # Auth, rate limiting, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express route definitions
│   │   └── utils/          # Logger + sanitizers
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

### 4.1 Admin Credentials

Set the admin email and bcrypt password hash in `.env` before using `/admin/login`:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=...
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

| Method | Endpoint                    | Description                    | Auth  |
| ------ | --------------------------- | ------------------------------ | ----- |
| GET    | /api/health                 | Health check                   | ✗     |
| POST   | /api/contact                | Submit contact form            | ✗     |
| GET    | /api/contact                | List contact submissions       | Admin |
| PATCH  | /api/contact/:id/status     | Update contact status          | Admin |
| PATCH  | /api/contact/bulk-status    | Bulk-update contact status     | Admin |
| GET    | /api/projects               | List projects                  | ✗     |
| POST   | /api/projects               | Create project                 | Admin |
| PATCH  | /api/projects/:id           | Update project                 | Admin |
| DELETE | /api/projects/:id           | Delete project                 | Admin |
| GET    | /api/projects/:id           | Get project by ID              | ✗     |
| GET    | /api/blog                   | List published posts           | ✗     |
| POST   | /api/blog                   | Create blog post               | Admin |
| PATCH  | /api/blog/:id               | Update blog post               | Admin |
| DELETE | /api/blog/:id               | Delete blog post               | Admin |
| GET    | /api/blog/:slug             | Get post by slug               | ✗     |
| GET    | /api/testimonials           | List testimonials              | ✗     |
| GET    | /api/testimonials/admin     | List all testimonials          | Admin |
| POST   | /api/testimonials           | Create testimonial             | Admin |
| PATCH  | /api/testimonials/:id       | Update testimonial             | Admin |
| DELETE | /api/testimonials/:id       | Delete testimonial             | Admin |
| POST   | /api/newsletter/subscribe   | Subscribe to newsletter        | ✗     |
| POST   | /api/newsletter/unsubscribe | Unsubscribe from newsletter    | ✗     |
| GET    | /api/newsletter             | List subscribers               | Admin |
| GET    | /api/newsletter/export      | Export subscribers CSV         | Admin |
| PATCH  | /api/newsletter/:id/status  | Activate/deactivate subscriber | Admin |
| POST   | /api/auth/login             | Admin sign-in                  | ✗     |
| GET    | /api/auth/me                | Current admin session          | Admin |
| GET    | /api/admin/overview         | Dashboard overview metrics     | Admin |

Full interactive documentation is available at `/api/docs` (Swagger UI).

## Available Scripts

From the **repository root**:

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev:frontend` | Start frontend dev server         |
| `npm run dev:backend`  | Start backend dev server          |
| `npm run build`        | Build both frontend & backend     |
| `npm run lint`         | Lint both frontend & backend      |
| `npm run format`       | Format all files with Prettier    |
| `npm run docker:dev`   | Start full stack in Docker (dev)  |
| `npm run docker:prod`  | Start full stack in Docker (prod) |
| `npm run docker:down`  | Stop Docker containers            |

## Security Features

- **Helmet** – security HTTP headers
- **CORS** – origin whitelist configurable via `.env`
- **Rate Limiting** – general (100 req/15 min), contact (5/hr), newsletter (3/hr)
- **JWT** – token-based authentication for admin endpoints
- **Input Validation** – express-validator on all POST routes
- **Input Sanitization** – trims and strips angle brackets before persistence
- **Request Size Limit** – 10 KB max body

## Phase 2 Highlights

- JWT-protected `/admin` dashboard with overview cards, contact inbox workflows, and newsletter export
- Dark/light theme toggle with localStorage persistence and system preference fallback
- Toast notifications, loading states, and an application-level error boundary
- Route-based lazy loading for admin and public pages
- Progressive Web App assets via `manifest.webmanifest` and `public/sw.js`

## Database Schemas

| Collection                | Purpose                                |
| ------------------------- | -------------------------------------- |
| `contactsubmissions`      | Contact form submissions with status   |
| `blogposts`               | Blog articles with slug, tags, views   |
| `projects`                | Portfolio projects with tags and links |
| `testimonials`            | Client testimonials (moderation flow)  |
| `newslettersubscriptions` | Email subscriptions with unsub support |

## Environment Variables

See [`.env.example`](.env.example) for all available configuration options.

## Author

**Ecatu Ronald** – Senior Automotive Technician  
📧 ronaldecatu@gmail.com  
📞 +256 780 697 149  
🏢 Tata Uganda Ltd
