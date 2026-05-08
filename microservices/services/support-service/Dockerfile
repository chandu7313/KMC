# ─── Stage 1: Dependencies ───────────────
FROM node:18-alpine AS dependencies
WORKDIR /app

# Copy root package files for workspaces
COPY package*.json ./
COPY packages/ ./packages/
COPY services/support-service/package*.json ./services/support-service/

# Install all dependencies using workspaces
RUN npm install --include=dev && npm cache clean --force

# Copy installed node_modules to a temp dir for production
RUN cp -R node_modules /tmp/prod_modules

# ─── Stage 2: Development ────────────────
FROM node:18-alpine AS development
WORKDIR /app

# Install dev tools
RUN apk add --no-cache curl

# Copy everything from dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages ./packages
COPY --from=dependencies /app/services/support-service ./services/support-service

# Copy source
COPY services/support-service/src ./services/support-service/src

# Create logs directory
RUN mkdir -p logs

# Expose port (build arg)
ARG PORT=3011
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /app/services/support-service

# Health check
HEALTHCHECK --interval=30s --timeout=10s \
  --start-period=40s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Run with nodemon for hot reload
CMD ["../../node_modules/.bin/nodemon", "src/index.js"]

# ─── Stage 3: Builder ────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages ./packages
COPY --from=dependencies /app/services/support-service ./services/support-service
COPY services/support-service/src ./services/support-service/src

# ─── Stage 4: Production ─────────────────
FROM node:18-alpine AS production
WORKDIR /app

# Security: non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Install only curl for healthcheck
RUN apk add --no-cache curl

# Copy only production node_modules
COPY --from=dependencies /tmp/prod_modules ./node_modules
COPY --from=dependencies /app/packages ./packages
COPY --from=builder /app/services/support-service ./services/support-service

# Create logs dir with correct permissions
RUN mkdir -p logs && chown -R nodeuser:nodejs logs

# Switch to non-root
USER nodeuser

ARG PORT=3011
ENV PORT=$PORT
ENV NODE_ENV=production

EXPOSE $PORT

WORKDIR /app/services/support-service

HEALTHCHECK --interval=30s --timeout=10s \
  --start-period=40s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

CMD ["node", "src/index.js"]
