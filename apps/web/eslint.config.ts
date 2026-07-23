import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import eslint from '@hornet_security-test/eslint'

import { withNuxt } from './.nuxt/eslint.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default withNuxt(
  eslint({
    oxlint: resolve(__dirname, '.oxlintrc.json'),
    tsconfigRootDir: __dirname,
    typescript: true,
    vue: true,
  }),
  {
    rules: {
      'import-x/no-unresolved': ['error', { ignore: ['^~ui/', '^~nuxt-essentials/'] }],
    },
  },
)
