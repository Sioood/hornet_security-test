#!/bin/sh
set -e

cd /app

# Materialize Linux native optional deps (e.g. oxc-parser) inside the container.
# Image build must not rely on a cache-only store; this also refreshes the node_modules volume.
pnpm install --frozen-lockfile

pnpm --filter @hornet_security-test/nuxt-essentials exec nuxt prepare
pnpm --filter @hornet_security-test/ui exec nuxt prepare
pnpm --filter @hornet_security-test/web exec nuxt prepare

exec "$@"
