import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { eslint } from './src/index.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default eslint({
  oxlint: resolve(__dirname, '../../../.oxlintrc.json'),
  tsconfigRootDir: __dirname,
  typescript: true,
})
