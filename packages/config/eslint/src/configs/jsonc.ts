import { pluginJsonc } from '../plugins.ts'
import { defineConfig } from '../types.ts'

export const jsonc = defineConfig([...pluginJsonc.configs['flat/recommended-with-jsonc']])
