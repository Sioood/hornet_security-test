import path from 'node:path'

import { pluginOxlint } from '../plugins.ts'
import { defineConfig } from '../types.ts'

export function oxlint(options: boolean | string | Record<string, unknown>) {
  if (options === false) return []

  if (typeof options === 'string') {
    return defineConfig(pluginOxlint.buildFromOxlintConfigFile(path.resolve(options)))
  }

  if (typeof options === 'object') {
    return defineConfig(
      pluginOxlint.buildFromOxlintConfig(
        options as Parameters<typeof pluginOxlint.buildFromOxlintConfig>[0],
      ),
    )
  }

  // if options is true, use default config file
  return defineConfig(pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'))
}
