#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = dirname(fileURLToPath(import.meta.url))
const coverageTs = join(packageRoot, 'i18n/utils/coverage.ts')
const result = spawnSync(
  process.execPath,
  ['--experimental-strip-types', coverageTs, ...process.argv.slice(2)],
  { stdio: 'inherit' },
)

process.exit(result.status ?? 1)
