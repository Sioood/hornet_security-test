import { cva } from 'class-variance-authority'

import {
  comboboxClearTriggerCVA,
  comboboxIconSizeCVA,
  comboboxRootCVA,
} from '~/utils/Components/Form/Combobox/variants'

import type { TagsInputIntent, TagsInputSize } from './context'

export {
  comboboxClearTriggerCVA as tagsInputClearTriggerCVA,
  comboboxIconSizeCVA as tagsInputComboboxIconSizeCVA,
  comboboxRootCVA as tagsInputRootCVA,
}

export const tagsInputControlCVA = cva('flex min-w-0 flex-1 flex-wrap items-center gap-0.5 p-0', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'min-h-9',
      md: 'min-h-8',
      sm: 'min-h-7',
    } satisfies Record<TagsInputSize, string>,
  },
})

export const tagsInputInputCVA = cva(
  'txt-base min-w-12 flex-1 border-0 bg-transparent p-0 outline-none',
  {
    variants: {
      intent: {
        accent:
          'text-accent-text placeholder:text-accent-text-muted disabled:text-accent-text-disabled',
        neutral:
          'text-neutral-text placeholder:text-neutral-text-muted disabled:text-neutral-text-disabled',
        primary:
          'text-primary-text placeholder:text-primary-text-muted disabled:text-primary-text-disabled',
        secondary:
          'text-secondary-text placeholder:text-secondary-text-muted disabled:text-secondary-text-disabled',
      } satisfies Record<TagsInputIntent, string>,
      size: {
        lg: 'txt-base',
        md: 'txt-label',
        sm: 'txt-caption',
      } satisfies Record<TagsInputSize, string>,
    },
  },
)

export const tagsInputItemsCVA = cva('contents')

export const tagsInputItemPreviewCVA = cva('inline-flex items-center outline-none')

export const tagsInputItemInputCVA = cva(
  'txt-base min-w-12 border-0 bg-transparent px-1 py-0.5 outline-none',
  {
    variants: {
      intent: {
        accent: 'text-accent-text',
        neutral: 'text-neutral-text',
        primary: 'text-primary-text',
        secondary: 'text-secondary-text',
      } satisfies Record<TagsInputIntent, string>,
    },
  },
)
