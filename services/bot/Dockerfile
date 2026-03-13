# ── Build stage ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

# ── Runtime stage ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
RUN npm install --omit=dev

RUN addgroup -S soraku && adduser -S bot -G soraku
USER bot

# Railway inject PORT secara dinamis — jangan hardcode
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/health || exit 1

CMD ["node", "dist/index.js"]
