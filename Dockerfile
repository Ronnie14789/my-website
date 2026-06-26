# syntax=docker/dockerfile:1

FROM node:20-alpine
WORKDIR /app

# Install backend dependencies (fallback: npm install)
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend source
WORKDIR /app
COPY backend ./backend

# Build backend
WORKDIR /app/backend
RUN npm run build

ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000

CMD ["npm", "start"]