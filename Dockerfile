# Frontend build
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# Backend build
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY backend/ .
RUN npm run build

# Production
FROM node:20-alpine
WORKDIR /app

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY backend/package*.json ./backend/

EXPOSE 3001

CMD ["node", "backend/dist/index.js"]
