# syntax=docker/dockerfile:1

ARG NODE_VERSION=25.8.0

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN npm install -g pnpm@11.2.2

FROM base AS prepare
WORKDIR /app
COPY . .
RUN pnpm dlx turbo@^2.9.14 prune @hornet_security-test/web --docker

FROM base AS deps
WORKDIR /app
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=prepare /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY .npmrc .npmrc
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile

FROM deps AS builder
COPY --from=prepare /app/out/full/ .
ENV NODE_ENV=production
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile
RUN pnpm --filter @hornet_security-test/nuxt-essentials exec nuxt prepare \
  && pnpm --filter @hornet_security-test/ui exec nuxt prepare \
  && pnpm --filter @hornet_security-test/web exec nuxt prepare
RUN --mount=type=cache,id=turbo,target=/app/.turbo \
  pnpm exec turbo build --filter=@hornet_security-test/web --only

FROM base AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps apps
COPY packages packages
COPY scripts/docker-dev-entrypoint.sh /usr/local/bin/hornet_security-test-docker-dev-entrypoint.sh
RUN chmod +x /usr/local/bin/hornet_security-test-docker-dev-entrypoint.sh
# Do not use a cache-only store mount here: node_modules symlinks must resolve in the final image/volume.
RUN mkdir -p /pnpm/store \
  && pnpm install --frozen-lockfile
ENV NODE_ENV=development
EXPOSE 3000
ENTRYPOINT ["hornet_security-test-docker-dev-entrypoint.sh"]

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nuxtjs
COPY --from=builder --chown=nuxtjs:nodejs /app/apps/web/.output ./.output
USER nuxtjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", ".output/server/index.mjs"]
