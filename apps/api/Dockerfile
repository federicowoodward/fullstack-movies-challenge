# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --filter @fs/api... --frozen-lockfile

COPY . .
RUN pnpm --filter @fs/api build

FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app /app

EXPOSE 3001
CMD ["pnpm", "--filter", "@fs/api", "start"]
