import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const packageRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: packageRoot,
  test: {
    coverage: {
      exclude: ['i18n/utils/__fixtures__/**', 'test/**'],
      include: ['i18n/utils/**/*.ts', 'app/composables/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    environment: 'node',
    include: ['test/**/*.test.ts'],
    name: 'nuxt-essentials',
  },
})
