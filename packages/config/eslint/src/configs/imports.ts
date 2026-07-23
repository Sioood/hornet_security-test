import { importX } from '../plugins.ts'
import { defineConfig, type FlatConfig } from '../types.ts'

export const imports = defineConfig([
  importX.flatConfigs.recommended as FlatConfig,
  importX.flatConfigs.typescript as FlatConfig,
  {
    rules: {
      // Opinionated rule to enforce import order
      'import-x/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
        },
      ],
    },
  },
])
