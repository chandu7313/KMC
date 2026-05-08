FROM node:18-alpine AS base
RUN apk add --no-cache curl dumb-init
WORKDIR /app

# Copy shared packages
COPY packages/ ./packages/

# Copy service package files
COPY services/content-service/package*.json ./services/content-service/

# Install dependencies
WORKDIR /app/services/content-service
RUN npm install --omit=dev && npm cache clean --force

# Copy source
COPY services/content-service/src ./src

ENV NODE_ENV=production
ENV SERVICE_NAME=content-service

EXPOSE 3013

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3013/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
