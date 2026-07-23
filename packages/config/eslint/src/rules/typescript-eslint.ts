import type { Linter } from 'eslint'

/** Shared @typescript-eslint rule overrides (TS/JS and Vue `<script lang="ts">`). */
export const typescriptEslintRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
      varsIgnorePattern: '^_',
    },
  ],
} satisfies Linter.RulesRecord
