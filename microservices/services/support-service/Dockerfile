FROM node:18-alpine AS base
RUN apk add --no-cache curl dumb-init
WORKDIR /app

# Copy shared packages
COPY packages/ ./packages/

# Copy service package files
COPY services/support-service/package*.json ./services/support-service/

# Install dependencies
WORKDIR /app/services/support-service
RUN npm install --omit=dev && npm cache clean --force

# Copy source
COPY services/support-service/src ./src

ENV NODE_ENV=production
ENV SERVICE_NAME=support-service

EXPOSE 3011

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3011/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
