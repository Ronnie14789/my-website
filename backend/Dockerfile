# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && \
    npm ci --only=development --ignore-scripts

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --chown=nodejs:nodejs src/templates ./src/templates

RUN mkdir -p logs tmp && chown -R nodejs:nodejs logs tmp

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "dist/server.js"]
