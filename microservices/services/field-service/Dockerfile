FROM node:18-alpine AS base
RUN apk add --no-cache curl dumb-init
WORKDIR /app

# Copy shared packages
COPY packages/ ./packages/

# Copy service package files
COPY services/field-service/package*.json ./services/field-service/

# Install dependencies
WORKDIR /app/services/field-service
RUN npm install --omit=dev && npm cache clean --force

# Copy source
COPY services/field-service/src ./src

ENV NODE_ENV=production
ENV SERVICE_NAME=field-service

EXPOSE 3015

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3015/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
