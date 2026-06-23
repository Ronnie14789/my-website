# Ecatu Ronald - Portfolio Website v2.0

A full-stack, enterprise-grade portfolio website for Ecatu Ronald — Senior Technician at Tata Uganda Ltd. Built with React, Express, TypeScript, MongoDB, and Redis.

## 🚀 Features

### Frontend
- **React 18** + TypeScript + Vite
- **Framer Motion** animations — typing effect, parallax, stagger reveals, page transitions
- **Tailwind CSS** dark-theme design system
- **Admin Dashboard** — CRUD for all content with real-time analytics charts
- **GA4 Analytics** — page views, custom events, session tracking
- **Code splitting** — lazy-loaded routes for performance

### Backend
- **Express** + TypeScript REST API
- **MongoDB** — 6 Mongoose models with full TypeScript support
- **Email Service** — Nodemailer with HTML templates (Handlebars)
- **File Uploads** — Multer + Cloudinary with type/size validation
- **Redis Caching** — blog posts (1hr), projects (30min), testimonials (6hr)
- **JWT Authentication** — admin-protected routes
- **Rate Limiting** — tiered (general / contact / newsletter / auth)
- **Security** — Helmet headers, CORS, NoSQL injection prevention

## 📁 Project Structure

```
my-website/
├── backend/                    # Express/TypeScript API
│   ├── src/
│   │   ├── config/             # Database, Redis
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth, rate limiting, error handling
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   ├── services/           # Email & storage services
│   │   ├── templates/          # Handlebars email templates
│   │   ├── utils/              # Logger, API responses
│   │   ├── app.ts              # Express app factory
│   │   └── server.ts           # Entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # React/TypeScript/Vite SPA
│   ├── src/
│   │   ├── components/         # Hero, About, Projects, Contact, Header...
│   │   ├── hooks/              # useScrollReveal, useFileUpload, useStaggerAnimation
│   │   ├── lib/                # Axios API client
│   │   ├── pages/              # Home, NotFound, Admin pages
│   │   └── App.tsx
│   ├── nginx.conf              # Production Nginx config
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # Production stack
├── docker-compose.dev.yml      # Local dev (MongoDB + Redis only)
└── .env.example
```

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Redis (optional — falls back to in-memory cache)

### 1. Clone & Install

```bash
# Install root dev tools
npm install

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

### 3. Start Development

```bash
# Terminal 1 - Start backend (port 3001)
cd backend && npm run dev

# Terminal 2 - Start frontend (port 5173)
cd frontend && npm run dev
```

Or from root:
```bash
npm run dev
```

## 🐳 Docker (Production)

```bash
# Copy and configure environment
cp backend/.env.example backend/.env

# Start full stack (MongoDB + Redis + backend + frontend)
docker-compose up --build

# Development (databases only)
npm run docker:dev
```

Access:
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:3001/api
- **Health check**: http://localhost:3001/api/health

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/login` | — | Admin login |
| GET | `/api/contact` | ✅ | List submissions |
| POST | `/api/contact` | — | Submit contact form |
| GET | `/api/blog` | — | List published posts |
| GET | `/api/blog/:slug` | — | Get post by slug |
| POST | `/api/blog` | ✅ | Create post |
| PUT | `/api/blog/:id` | ✅ | Update post |
| DELETE | `/api/blog/:id` | ✅ | Delete post |
| GET | `/api/projects` | — | List projects |
| POST | `/api/projects` | ✅ | Create project |
| GET | `/api/testimonials` | — | List approved testimonials |
| POST | `/api/testimonials` | — | Submit testimonial |
| PATCH | `/api/testimonials/:id/approve` | ✅ | Approve testimonial |
| POST | `/api/newsletter/subscribe` | — | Subscribe to newsletter |
| GET | `/api/newsletter/unsubscribe` | — | Unsubscribe via token |
| POST | `/api/upload/project-image` | ✅ | Upload project image |
| POST | `/api/upload/blog-image` | ✅ | Upload blog image |
| POST | `/api/upload/avatar` | ✅ | Upload avatar |
| GET | `/api/analytics/dashboard` | ✅ | Dashboard stats |

## 📧 Email Setup

Supports Gmail, SendGrid, Mailgun via SMTP:

**Gmail:**
1. Enable 2FA on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Set `SMTP_USER=your@gmail.com` and `SMTP_PASS=your-app-password`

**SendGrid:**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## 🖼️ File Uploads (Cloudinary)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Set the `CLOUDINARY_*` variables in `backend/.env`

## 🔐 Admin Setup

Create the first admin user via MongoDB shell or directly:

```javascript
// In MongoDB shell
use mywebsite
db.adminusers.insertOne({
  username: "admin",
  email: "ronaldecatu@gmail.com",
  password: "$2a$12$...", // bcrypt hash of your password
  role: "superadmin",
  isActive: true,
  createdAt: new Date()
})
```

Or use bcrypt to generate a hash:
```bash
node -e "const b=require('bcryptjs');b.hash('yourPassword',12).then(h=>console.log(h))"
```

## 🏗️ Build for Production

```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build

# Or both from root
npm run build
```

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for automated testing, security scanning, and deployment.

### Workflows

- **CI** (`.github/workflows/ci.yml`)
  - Runs on: every push and pull request
  - Checks: lint, TypeScript, build, tests
  - Status: Required to pass before merge

- **Security** (`.github/workflows/security.yml`)
  - CodeQL analysis for security vulnerabilities
  - Secret scanning to prevent credential leaks
  - Status: Required to pass before merge

- **Staging Deploy** (`.github/workflows/deploy-staging.yml`)
  - Runs on: merge to main
  - Deploys to staging environment
  - Runs smoke tests

- **Production Release** (`.github/workflows/release.yml`)
  - Runs on: release published
  - Deploys to production
  - Creates release notes

### Status Badges

[![CI - Build & Test](https://github.com/Ronnie14789/my-website/actions/workflows/ci.yml/badge.svg)](https://github.com/Ronnie14789/my-website/actions/workflows/ci.yml)
[![Security Checks](https://github.com/Ronnie14789/my-website/actions/workflows/security.yml/badge.svg)](https://github.com/Ronnie14789/my-website/actions/workflows/security.yml)

### Deployment

#### Staging
Automatically deployed on merge to `main`.

#### Production
Create a release tag to deploy to production:
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Branch Protection Rules

Configure in GitHub Settings → Branches → main:
- ✅ Require CI workflow to pass
- ✅ Require code reviews before merge
- ✅ Require status checks to pass
- ✅ Restrict who can push to main

## 📊 Performance

- **Lighthouse Score**: 90+ target
- **Caching**: Redis with in-memory fallback
- **Code Splitting**: Lazy-loaded admin routes
- **Images**: Cloudinary CDN with auto-optimization
- **Animations**: GPU-accelerated transforms, `prefers-reduced-motion` respected

## 🔒 Security

- JWT authentication for admin routes
- Helmet.js security headers
- CORS origin whitelist
- Input validation (express-validator)
- Rate limiting (tiered per endpoint type)
- File type/size validation for uploads
- NoSQL injection prevention
- bcrypt password hashing (12 rounds)

---

Built with ❤️ by [Ecatu Ronald](mailto:ronaldecatu@gmail.com) — Tata Uganda Ltd
