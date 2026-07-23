import { composer } from 'eslint-flat-config-utils'

import { imports, jsonc, markdown, oxlint, prettier, typescript, vue, yml } from './configs.ts'
import { GLOB_EXCLUDE } from './globs.ts'

import type { FlatConfigs, OptionsConfig } from './types.ts'

export function eslint(options: OptionsConfig = {}, ...userConfigs: FlatConfigs) {
  const {
    imports: hasImports = true,
    jsonc: hasJsonc = true,
    markdown: hasMarkdown = true,
    oxlint: oxlintOptions = true,
    tsconfigRootDir,
    typescript: hasTypescript = true,
    vue: hasVue = false,
    yml: hasYml = true,
  } = options

  const configs: FlatConfigs = [
    {
      ignores: [...GLOB_EXCLUDE],
    },
  ]

  if (hasTypescript) {
    configs.push(...typescript(tsconfigRootDir))
  }

  if (hasImports) {
    configs.push(...imports)
  }

  if (hasJsonc) {
    configs.push(...jsonc)
  }

  if (hasMarkdown) {
    configs.push(...markdown)
  }

  if (hasYml) {
    configs.push(...yml)
  }

  if (hasVue) {
    configs.push(...vue({ hasTypescript, tsconfigRootDir }))
  }

  if (oxlintOptions) {
    configs.push(...oxlint(oxlintOptions))
  }

  configs.push(...prettier())

  return composer(...configs, ...userConfigs)
}
