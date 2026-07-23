import { configs as tseslintConfigs } from 'typescript-eslint'

import { typescriptEslintRules } from '../rules/typescript-eslint.ts'
import { defineConfig, type FlatConfigs } from '../types.ts'

export function typescript(tsconfigRootDir?: string) {
  return defineConfig([
    ...(tseslintConfigs.recommended as FlatConfigs),
    {
      files: [
        '**/*.ts',
        '**/*.tsx',
        '**/*.mts',
        '**/*.cts',
        '**/*.js',
        '**/*.jsx',
        '**/*.mjs',
        '**/*.cjs',
      ],
      languageOptions: {
        parserOptions: {
          projectService: false,
          ...(tsconfigRootDir ? { tsconfigRootDir } : {}),
        },
      },
      rules: typescriptEslintRules,
    },
  ])
}
