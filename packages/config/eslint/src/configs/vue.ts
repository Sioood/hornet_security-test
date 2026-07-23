import { GLOB_VUE } from '../globs.ts'
import { parserTs, parserVue, pluginVue } from '../plugins.ts'
import { typescriptEslintRules } from '../rules/typescript-eslint.ts'
import { defineConfig } from '../types.ts'

import type { OptionsHasTypeScript } from '../types.ts'

export function vue(options: OptionsHasTypeScript = {}) {
  const { hasTypescript = true, tsconfigRootDir } = options

  return defineConfig([
    ...pluginVue.configs['flat/recommended'],
    {
      files: [GLOB_VUE],
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: hasTypescript ? parserTs : undefined,
          sourceType: 'module',
          ...(tsconfigRootDir ? { tsconfigRootDir } : {}),
        },
      },
      rules: {
        ...(hasTypescript ? typescriptEslintRules : {}),
        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'vue/multi-word-component-names': 'off',
      },
    },
  ])
}
