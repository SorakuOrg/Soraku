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

# Railway inject PORT env secara dinamis
# Default 3000 kalau tidak ada
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "--experimental-vm-modules", "dist/index.js"]
