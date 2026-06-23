# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production --prefer-offline && npm cache clean --force

# Copy built output
COPY --from=builder /app/dist ./dist

RUN mkdir -p logs

EXPOSE 5000

USER node

CMD ["node", "dist/server.js"]
