# ── Build stage ──────────────────────────────────────────────────────────────
# Build context = services/bot/ (Railway set root directory ke services/bot/)
# Lockfile ada di root monorepo, tidak tersedia di sini → pakai npm install biasa
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files dulu (layer cache optimal)
COPY package.json tsconfig.json ./

# Install semua deps (tanpa frozen-lockfile karena lockfile di root monorepo)
RUN npm install

# Copy source
COPY src ./src

# Build TypeScript → dist/
RUN npm run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copy hasil build + package.json dari builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Install hanya production deps
RUN npm install --omit=dev

# Non-root user untuk keamanan
RUN addgroup -S soraku && adduser -S bot -G soraku
USER bot

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]
