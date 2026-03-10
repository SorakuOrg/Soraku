# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files (needed for monorepo resolution)
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy bot package files
COPY services/bot/package.json ./services/bot/
COPY services/bot/tsconfig.json ./services/bot/

# Install deps (bot only)
WORKDIR /app/services/bot
RUN pnpm install --frozen-lockfile

# Copy source
COPY services/bot/src ./src

# Build TypeScript
RUN pnpm build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

# Copy built files
COPY --from=builder /app/services/bot/dist ./dist
COPY --from=builder /app/services/bot/package.json ./package.json

# Install production deps only
RUN pnpm install --prod --frozen-lockfile

# Non-root user for security
RUN addgroup -S soraku && adduser -S bot -G soraku
USER bot

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]
