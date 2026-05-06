# ─────────────────────────────────────
# auth-service Dockerfile
# ─────────────────────────────────────
FROM node:18-alpine AS base

RUN apk add --no-cache curl dumb-init

WORKDIR /app

# Copy shared packages first (for caching)
COPY ../../packages/shared /packages/shared
COPY ../../packages/events /packages/events

# Install shared package dependencies
RUN cd /packages/shared && npm ci --only=production
RUN cd /packages/events && npm ci --only=production

# Copy service package files
COPY package*.json ./

# Install service dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src ./src

# Set environment
ENV NODE_ENV=production
ENV SERVICE_NAME=auth-service

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
