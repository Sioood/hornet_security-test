import eslintConfigPrettier from 'eslint-config-prettier/flat'

import { defineConfig } from '../types.ts'

/** Disables ESLint stylistic rules that conflict with oxfmt (Prettier-compatible Vue templates). */
export const prettier = () => defineConfig([eslintConfigPrettier])
