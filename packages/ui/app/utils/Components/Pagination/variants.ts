import { cva } from 'class-variance-authority'

import type { PaginationIntent, PaginationSize } from './context'

export const paginationRootCVA = cva('flex items-stretch', {
  defaultVariants: {
    intent: 'neutral',
    size: 'md',
  },
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<PaginationIntent, string>,
    size: {
      lg: 'gap-2',
      md: 'gap-1.5',
      sm: 'gap-1',
    } satisfies Record<PaginationSize, string>,
  },
})

export const paginationEllipsisCVA = cva(
  ['inline-flex items-center justify-center', 'pointer-events-none select-none'],
  {
    defaultVariants: {
      size: 'md',
    },
    variants: {
      size: {
        lg: 'txt-h6 min-w-12 px-2 py-3',
        md: 'txt-base min-w-10 px-2 py-2',
        sm: 'txt-caption min-w-8 px-1 py-1',
      } satisfies Record<PaginationSize, string>,
    },
  },
)
