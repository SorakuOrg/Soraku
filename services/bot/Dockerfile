# ── Build stage ──────────────────────────────────────────────────────────────
# Build context = services/bot/ (Railway pakai folder yg ada railway.toml)
# Semua COPY path relatif terhadap services/bot/
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy package files dulu (layer cache)
COPY package.json ./
COPY tsconfig.json ./

# Install semua deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY src ./src

# Build TypeScript → dist/
RUN pnpm build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

# Copy hasil build + package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Install production deps only
RUN pnpm install --prod --frozen-lockfile

# Non-root user untuk keamanan
RUN addgroup -S soraku && adduser -S bot -G soraku
USER bot

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]
