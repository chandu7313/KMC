FROM node:18-alpine AS base
RUN apk add --no-cache curl dumb-init
WORKDIR /app

# Copy shared packages
COPY packages/ ./packages/

# Copy service package files
COPY services/ai-service/package*.json ./services/ai-service/

# Install dependencies
WORKDIR /app/services/ai-service
RUN npm install --omit=dev && npm cache clean --force

# Copy source
COPY services/ai-service/src ./src

ENV NODE_ENV=production
ENV SERVICE_NAME=ai-service

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
