import { cva } from 'class-variance-authority'

import type { TabsSize, TabsTriggerLayout } from './context'

export const tabsRootCVA = cva('w-fit', {
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'line',
  },
  variants: {
    orientation: {
      horizontal: 'flex flex-col',
      vertical: 'flex',
    },
    variant: {
      line: '',
      pill: '',
    },
  },
})

export const tabsOptionIconCVA = cva('shrink-0', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-5',
      md: 'size-4',
      sm: 'size-3',
    } satisfies Record<TabsSize, string>,
  },
})

export const tabsTriggerLayoutCVA = cva('', {
  defaultVariants: {
    triggerLayout: 'inline',
  },
  variants: {
    triggerLayout: {
      inline: '',
      stacked: 'flex-col items-center justify-center gap-0.5 text-center whitespace-normal',
    } satisfies Record<TabsTriggerLayout, string>,
  },
})

export const tabsOptionLabelCVA = cva('min-w-0 truncate', {
  defaultVariants: {
    triggerLayout: 'inline',
  },
  variants: {
    triggerLayout: {
      inline: '',
      stacked: 'txt-caption max-w-full truncate',
    } satisfies Record<TabsTriggerLayout, string>,
  },
})
