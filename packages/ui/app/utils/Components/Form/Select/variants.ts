import { cva } from 'class-variance-authority'

import type { SelectIntent, SelectSize } from './context'

export const selectRootCVA = cva('flex w-full flex-col gap-1')

export const selectControlCVA = cva('flex items-center gap-1')

export const selectTriggerCVA = cva('w-full justify-between active:scale-100', {
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<SelectIntent, string>,
    size: {
      lg: '',
      md: '',
      sm: '',
    } satisfies Record<SelectSize, string>,
  },
})

export const selectClearTriggerCVA = cva(
  'cursor-pointer data-[disabled=true]:cursor-not-allowed [hidden]:hidden',
)

export const selectPositionerCVA = cva('origin-(--transform-origin)')

export const selectContentCVA = cva(
  [
    'overflow-y-auto border',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
    'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
    'max-h-[min(var(--available-height,20rem),20rem)]',
    'w-(--reference-width) max-w-(--reference-width) min-w-(--reference-width)',
  ],
  {
    variants: {
      intent: {
        accent:
          'border-accent-border-subtle bg-accent-fill-subtle text-accent-text disabled:pointer-events-none disabled:opacity-40',
        neutral:
          'border-neutral-border-subtle bg-neutral-fill-subtle text-neutral-text disabled:pointer-events-none disabled:opacity-40',
        primary:
          'border-primary-border-subtle bg-primary-fill-subtle text-primary-text disabled:pointer-events-none disabled:opacity-40',
        secondary:
          'border-secondary-border-subtle bg-secondary-fill-subtle text-secondary-text disabled:pointer-events-none disabled:opacity-40',
      } satisfies Record<SelectIntent, string>,
      size: {
        lg: 'txt-base p-1',
        md: 'txt-label p-1',
        sm: 'txt-caption p-1',
      } satisfies Record<SelectSize, string>,
    },
  },
)

export const selectItemCVA = cva(
  'flex cursor-pointer items-center outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  {
    variants: {
      intent: {
        accent:
          'text-accent-text data-[disabled]:text-accent-text-subtle data-[highlighted]:bg-accent-fill-subtle-hover',
        neutral:
          'text-neutral-text data-[disabled]:text-neutral-text-subtle data-[highlighted]:bg-neutral-fill-subtle-hover',
        primary:
          'text-primary-text data-[disabled]:text-primary-text-subtle data-[highlighted]:bg-primary-fill-subtle-hover',
        secondary:
          'text-secondary-text data-[disabled]:text-secondary-text-subtle data-[highlighted]:bg-secondary-fill-subtle-hover',
      } satisfies Record<SelectIntent, string>,
      size: {
        lg: 'txt-base gap-2 px-3 py-2',
        md: 'txt-label gap-2 px-2 py-1.5',
        sm: 'txt-caption gap-2 px-2 py-1',
      } satisfies Record<SelectSize, string>,
    },
  },
)

export const selectItemGroupLabelCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<SelectIntent, string>,
    size: {
      lg: 'txt-label px-2 py-1',
      md: 'txt-caption px-2 py-1',
      sm: 'txt-caption px-2 py-1',
    } satisfies Record<SelectSize, string>,
  },
})

export const selectLabelCVA = cva('block', {
  variants: {
    intent: {
      accent: 'text-accent-text data-[disabled]:opacity-50 data-[invalid]:text-error-text',
      neutral: 'text-neutral-text data-[disabled]:opacity-50 data-[invalid]:text-error-text',
      primary: 'text-primary-text data-[disabled]:opacity-50 data-[invalid]:text-error-text',
      secondary: 'text-secondary-text data-[disabled]:opacity-50 data-[invalid]:text-error-text',
    } satisfies Record<SelectIntent, string>,
    size: {
      lg: 'txt-h6',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<SelectSize, string>,
  },
})

export const selectIconSizeCVA = cva('shrink-0', {
  variants: {
    size: {
      lg: 'size-4',
      md: 'size-3.5',
      sm: 'size-3',
    } satisfies Record<SelectSize, string>,
  },
})
