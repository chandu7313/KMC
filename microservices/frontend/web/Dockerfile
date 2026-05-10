# ─── Stage 1: Development ────────────────
FROM node:18-alpine AS development
WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
# Remove lockfile to prevent architecture mismatch for native bindings (esbuild/tailwindcss)
RUN rm -f package-lock.json && npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# ─── Stage 2: Builder ────────────────────
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_API_URL
ARG REACT_APP_ENV=production
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ENV=$REACT_APP_ENV
RUN npm run build

# ─── Stage 3: Production (Nginx) ─────────
FROM nginx:alpine AS production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
