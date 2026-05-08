# ─── Stage 1: Dependencies ───────────────
FROM node:18-alpine AS dependencies
WORKDIR /app

# Copy root package files for workspaces
COPY package*.json ./
COPY packages/ ./packages/
COPY services/field-service/package*.json ./services/field-service/

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
COPY --from=dependencies /app/services/field-service ./services/field-service

# Copy source
COPY services/field-service/src ./services/field-service/src

# Create logs directory
RUN mkdir -p logs

# Expose port (build arg)
ARG PORT=3015
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /app/services/field-service

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
COPY --from=dependencies /app/services/field-service ./services/field-service
COPY services/field-service/src ./services/field-service/src

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
COPY --from=builder /app/services/field-service ./services/field-service

# Create logs dir with correct permissions
RUN mkdir -p logs && chown -R nodeuser:nodejs logs

# Switch to non-root
USER nodeuser

ARG PORT=3015
ENV PORT=$PORT
ENV NODE_ENV=production

EXPOSE $PORT

WORKDIR /app/services/field-service

HEALTHCHECK --interval=30s --timeout=10s \
  --start-period=40s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

CMD ["node", "src/index.js"]
