import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import eslint from '@hornet_security-test/eslint'

const __dirname = dirname(fileURLToPath(import.meta.url))

// lint-staged runs this root config on all staged .vue files (e.g. under packages/ui).
export default eslint({
  oxlint: resolve(__dirname, '.oxlintrc.json'),
  tsconfigRootDir: __dirname,
  typescript: true,
  /** Required so staged `*.vue` under apps/packages are parsed as SFCs (not plain TS). */
  vue: true,
}).append(
  {
    rules: {
      'import-x/no-unresolved': ['error', { ignore: ['^~ui/', '^~nuxt-essentials/'] }],
    },
  },
  {
    files: ['packages/ui/test/**/*.ts', '**/*.component.test.ts'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/one-component-per-file': 'off',
    },
  },
  {
    // Embedded code uses virtual paths such as README.md/0_0.js (not *.md), so include **/*.md/**.
    files: ['**/*.md', '**/*.md/**'],
    rules: {
      'import-x/no-unresolved': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
)
