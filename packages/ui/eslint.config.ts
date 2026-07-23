import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import eslint from '@hornet_security-test/eslint'

import { withNuxt } from './.nuxt/eslint.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default withNuxt(
  await eslint({
    oxlint: resolve(__dirname, '.oxlintrc.json'),
    tsconfigRootDir: __dirname,
    typescript: true,
    vue: true,
  }),
  {
    rules: {
      'import-x/no-unresolved': 'error',
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: resolve(__dirname, '.nuxt/tsconfig.app.json'),
        },
      },
    },
  },
  {
    files: ['test/**/*.ts', '**/*.component.test.ts'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/one-component-per-file': 'off',
      'vue/require-default-prop': 'off',
    },
  },
  {
    files: ['**/*.md', '**/*.md/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
)
