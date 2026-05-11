# ─── Stage 1: Development ────────────────
FROM ghcr.io/cirruslabs/flutter:stable AS development
WORKDIR /app
COPY . .
# Run pub get to fetch dependencies
RUN flutter pub get
EXPOSE 3000
CMD ["flutter", "run", "-d", "web-server", "--web-hostname", "0.0.0.0", "--web-port", "3000"]

# ─── Stage 2: Builder ────────────────────
FROM ghcr.io/cirruslabs/flutter:stable AS builder
WORKDIR /app
COPY . .
RUN flutter pub get
RUN flutter build web --release

# ─── Stage 3: Production (Nginx) ─────────
FROM nginx:alpine AS production
COPY --from=builder /app/build/web /usr/share/nginx/html
# (Optional) Provide a custom nginx conf here if SPA routing is needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
