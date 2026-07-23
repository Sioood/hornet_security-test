import { pluginYml } from '../plugins.ts'
import { defineConfig } from '../types.ts'

export const yml = defineConfig([...pluginYml.configs['flat/recommended']])
