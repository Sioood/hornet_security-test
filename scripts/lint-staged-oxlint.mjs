#!/usr/bin/env node
/**
 * Run oxlint with the nearest `.oxlintrc.json` per staged file (repo root as fallback).
 *
 * Oxlint documents per-file nearest config when no `-c` is passed
 * (https://oxc.rs/docs/guide/usage/linter/nested-config.html). In this repo, invoking
 * `oxlint` from the workspace root on paths like `packages/ui/...` did not apply the
 * UI layer config (Tailwind stayed inactive in a controlled probe). Grouping by
 * discovered config and passing `-c` matches package `lint:oxlint` and keeps
 * lint-staged correct until that behavior aligns with the docs.
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function findOxlintrc(startDir) {
  let dir = resolve(startDir)
  for (;;) {
    const candidate = join(dir, '.oxlintrc.json')
    if (existsSync(candidate)) return candidate
    const parent = dirname(dir)
    if (parent === dir) return join(repoRoot, '.oxlintrc.json')
    dir = parent
  }
}

const OXLINT_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.vue'])

const paths = process.argv.slice(2).filter((p) => {
  const ext = p.slice(p.lastIndexOf('.'))
  return OXLINT_EXTENSIONS.has(ext)
})

if (paths.length === 0) process.exit(0)

const groups = new Map()
for (const rel of paths) {
  const abs = resolve(repoRoot, rel)
  const config = findOxlintrc(dirname(abs))
  if (!groups.has(config)) groups.set(config, [])
  groups.get(config).push(abs)
}

for (const [config, files] of groups) {
  const r = spawnSync('pnpm', ['exec', 'oxlint', '--fix', '-c', config, ...files], {
    cwd: repoRoot,
    stdio: 'inherit',
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
