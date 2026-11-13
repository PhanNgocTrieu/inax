# GreenHabitat – image production (Next.js standalone + Payload + SQLite)
#
#   docker build -t greenhabitat --build-arg NEXT_PUBLIC_SITE_URL=https://demo.example.com .
#   docker run -p 3000:3000 -v gh-data:/data --env-file .env.production greenhabitat
#
# Dữ liệu bền (DB + ảnh upload) nằm trong /data – PHẢI gắn volume vào /data.

FROM node:22.23.4-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10 --activate

# ---- Cài dependencies ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* được gắn cứng vào bundle lúc build
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
# Thẻ meta noindex nằm trong các trang render sẵn => cần biết lúc build
ARG SITE_NOINDEX=
ENV SITE_NOINDEX=$SITE_NOINDEX
ENV NEXT_TELEMETRY_DISABLED=1
# DB tạm chỉ dùng lúc build để render sẵn trang ISR có dữ liệu mẫu; không đưa vào image
ENV DATABASE_URL=file:/tmp/build.db
ENV PAYLOAD_SECRET=build-only-secret
# (NODE_ENV=production để seed không tự push schema kiểu dev – sẽ làm migration bị kẹt)
RUN NODE_ENV=production pnpm payload migrate \
 && NODE_ENV=production pnpm seed \
 && pnpm run build

# ---- Chạy ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/data/greenhabitat.db
ENV MEDIA_DIR=/data/media

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
RUN mkdir -p /data/media .next && chown -R nextjs:nodejs /data .next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
VOLUME /data
EXPOSE 3000
CMD ["node", "server.js"]
