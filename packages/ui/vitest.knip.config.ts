import { dirname, resolve as resolvePath } from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig, defineProject } from 'vitest/config'

/** Static Vitest config for Knip only — real runs use `vitest.config.ts` (Nuxt projects). */
const packageRoot = dirname(fileURLToPath(import.meta.url))
const componentSetupPath = resolvePath(packageRoot, 'test/component-setup.ts')
const visualSetupPath = resolvePath(packageRoot, 'test/visual-setup.ts')

export default defineConfig({
  plugins: [vue(), autoImport({ dts: false, imports: ['vue'] })],
  root: packageRoot,
  test: {
    coverage: {
      provider: 'v8',
    },
    projects: [
      defineProject({
        root: packageRoot,
        test: {
          environment: 'node',
          exclude: ['test/**/*.component.test.ts', 'test/**/*.visual.test.ts'],
          include: ['test/**/*.test.ts'],
          name: 'ui-unit',
        },
      }),
      defineProject({
        plugins: [vue(), autoImport({ dts: false, imports: ['vue'] })],
        root: packageRoot,
        test: {
          environment: 'node',
          include: ['test/**/*.component.test.ts'],
          name: 'ui-component',
          setupFiles: [componentSetupPath],
        },
      }),
      defineProject({
        root: packageRoot,
        test: {
          browser: {
            enabled: true,
            provider: 'playwright',
          },
          include: ['test/**/*.visual.test.ts'],
          name: 'ui-visual',
          setupFiles: [visualSetupPath],
        },
      }),
    ],
  },
})
