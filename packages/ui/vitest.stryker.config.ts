import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const packageRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: packageRoot,
  test: {
    environment: 'node',
    exclude: ['test/**/*.component.test.ts', 'test/**/*.visual.test.ts'],
    include: ['test/**/*.test.ts'],
  },
})
