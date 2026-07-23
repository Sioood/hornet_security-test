import { cva } from 'class-variance-authority'

import {
  selectContentCVA,
  selectIconSizeCVA,
  selectItemCVA,
  selectItemGroupLabelCVA,
  selectPositionerCVA,
} from '~/utils/Components/Form/Select/variants'

import type { ComboboxIntent, ComboboxSize } from './context'

export {
  selectContentCVA as comboboxContentCVA,
  selectIconSizeCVA as comboboxIconSizeCVA,
  selectItemCVA as comboboxItemCVA,
  selectItemGroupLabelCVA as comboboxItemGroupLabelCVA,
}

export const comboboxPositionerCVA = cva([
  selectPositionerCVA(),
  'w-(--reference-width) min-w-(--reference-width)',
])

export const comboboxRootCVA = cva('flex w-full flex-col gap-1')

export const comboboxControlCVA = cva('flex min-w-0 flex-1 flex-col items-stretch gap-0.5 p-0')

export const comboboxControlRowCVA = cva('flex w-full min-w-0 items-center')

export const comboboxInputCVA = cva(
  'txt-base w-full min-w-0 flex-none border-0 bg-transparent p-0 outline-none',
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
      } satisfies Record<ComboboxIntent, string>,
      size: {
        lg: 'txt-base',
        md: 'txt-label',
        sm: 'txt-caption',
      } satisfies Record<ComboboxSize, string>,
    },
  },
)

export const comboboxTriggerCVA = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent outline-none disabled:cursor-not-allowed',
  {
    variants: {
      intent: {
        accent: 'text-accent-text-subtle hover:text-accent-text disabled:text-accent-text-disabled',
        neutral:
          'text-neutral-text-subtle hover:text-neutral-text disabled:text-neutral-text-disabled',
        primary:
          'text-primary-text-subtle hover:text-primary-text disabled:text-primary-text-disabled',
        secondary:
          'text-secondary-text-subtle hover:text-secondary-text disabled:text-secondary-text-disabled',
      } satisfies Record<ComboboxIntent, string>,
      size: {
        lg: 'size-9',
        md: 'size-8',
        sm: 'size-7',
      } satisfies Record<ComboboxSize, string>,
    },
  },
)

export const comboboxClearTriggerCVA = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  {
    variants: {
      size: {
        lg: 'size-9',
        md: 'size-8',
        sm: 'size-7',
      } satisfies Record<ComboboxSize, string>,
    },
  },
)

export const comboboxSelectedItemsCVA = cva('flex flex-wrap items-center gap-1')

export const comboboxEmptyCVA = cva('cursor-default text-neutral-text-subtle', {
  variants: {
    size: {
      lg: 'txt-base px-3 py-2',
      md: 'txt-label px-2 py-1.5',
      sm: 'txt-caption px-2 py-1',
    } satisfies Record<ComboboxSize, string>,
  },
})
