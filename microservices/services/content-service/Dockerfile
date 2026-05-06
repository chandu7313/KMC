FROM node:18-alpine AS base
RUN apk add --no-cache curl dumb-init
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY src ./src
ENV NODE_ENV=production
ENV SERVICE_NAME=content-service
EXPOSE 3013
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3013/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
