import { cva } from 'class-variance-authority'

import type { TableIntent, TableSize, TableSticky } from './context'

const tableIntents = [
  'neutral',
  'primary',
  'secondary',
  'accent',
] as const satisfies readonly TableIntent[]

const stickyHeaderBackground: Record<TableIntent, string> = {
  accent: 'sticky inset-x-0 top-0 z-10 bg-accent-fill-subtle backdrop-blur-sm',
  neutral: 'sticky inset-x-0 top-0 z-10 bg-neutral-fill-subtle backdrop-blur-sm',
  primary: 'sticky inset-x-0 top-0 z-10 bg-primary-fill-subtle backdrop-blur-sm',
  secondary: 'sticky inset-x-0 top-0 z-10 bg-secondary-fill-subtle backdrop-blur-sm',
}

const stickyFooterBackground: Record<TableIntent, string> = {
  accent: 'sticky inset-x-0 bottom-0 z-10 bg-accent-fill-subtle backdrop-blur-sm',
  neutral: 'sticky inset-x-0 bottom-0 z-10 bg-neutral-fill-subtle backdrop-blur-sm',
  primary: 'sticky inset-x-0 bottom-0 z-10 bg-primary-fill-subtle backdrop-blur-sm',
  secondary: 'sticky inset-x-0 bottom-0 z-10 bg-secondary-fill-subtle backdrop-blur-sm',
}

const loadingIndicatorBackground: Record<TableIntent, string> = {
  accent: 'after:bg-accent-fill',
  neutral: 'after:bg-neutral-fill',
  primary: 'after:bg-primary-fill',
  secondary: 'after:bg-secondary-fill',
}

const pinnedHeadBackground: Record<TableIntent, string> = {
  accent: 'bg-accent-fill-subtle/95',
  neutral: 'bg-neutral-fill-subtle/95',
  primary: 'bg-primary-fill-subtle/95',
  secondary: 'bg-secondary-fill-subtle/95',
}

const pinnedCellBackground: Record<TableIntent, string> = {
  accent: 'bg-accent-fill-subtle/95',
  neutral: 'bg-neutral-fill-subtle/95',
  primary: 'bg-primary-fill-subtle/95',
  secondary: 'bg-secondary-fill-subtle/95',
}

const selectedRowBackground: Record<TableIntent, string> = {
  accent: 'bg-accent-fill-subtle/70',
  neutral: 'bg-neutral-fill-subtle/70',
  primary: 'bg-primary-fill-subtle/70',
  secondary: 'bg-secondary-fill-subtle/70',
}

const pinnedRowBackground: Record<TableIntent, string> = {
  accent: 'bg-accent-fill-subtle/90',
  neutral: 'bg-neutral-fill-subtle/90',
  primary: 'bg-primary-fill-subtle/90',
  secondary: 'bg-secondary-fill-subtle/90',
}

const expandedRowBackground: Record<TableIntent, string> = {
  accent: 'bg-accent-fill-subtle/40',
  neutral: 'bg-neutral-fill-subtle/40',
  primary: 'bg-primary-fill-subtle/40',
  secondary: 'bg-secondary-fill-subtle/40',
}

export const tableRootCVA = cva('relative overflow-auto', {
  defaultVariants: {
    sticky: false,
  },
  variants: {
    sticky: {
      false: '',
      footer: '',
      header: '',
      true: '',
    } satisfies Record<string, string>,
  },
})

export const tableBaseCVA = cva('w-full caption-bottom border-separate border-spacing-0', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'txt-base',
      md: 'txt-base',
      sm: 'txt-caption',
    } satisfies Record<TableSize, string>,
  },
})

export const tableCaptionCVA = cva('mb-2 caption-top', {
  defaultVariants: {
    intent: 'neutral',
    size: 'md',
  },
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<TableIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<TableSize, string>,
  },
})

export const tableTheadCVA = cva('relative', {
  compoundVariants: tableIntents.flatMap((intent) => [
    { class: stickyHeaderBackground[intent], intent, sticky: true as const },
    { class: stickyHeaderBackground[intent], intent, sticky: 'header' as const },
    { class: loadingIndicatorBackground[intent], intent, loading: true as const },
  ]),
  defaultVariants: {
    intent: 'neutral',
    loading: false,
    sticky: false,
  },
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<TableIntent, string>,
    loading: {
      false: '',
      true: 'after:absolute after:inset-x-0 after:top-0 after:z-20 after:h-px',
    } satisfies Record<string, string>,
    sticky: {
      false: '',
      footer: '',
      header: '',
      true: '',
    } satisfies Record<string, string>,
  },
})

export const tableTbodyCVA = cva('', {
  defaultVariants: {
    intent: 'neutral',
  },
  variants: {
    intent: {
      accent: '[&>tr[data-selectable=true]:hover]:bg-accent-fill-subtle/40',
      neutral: '[&>tr[data-selectable=true]:hover]:bg-neutral-fill-subtle/60',
      primary: '[&>tr[data-selectable=true]:hover]:bg-primary-fill-subtle/40',
      secondary: '[&>tr[data-selectable=true]:hover]:bg-secondary-fill-subtle/40',
    } satisfies Record<TableIntent, string>,
  },
})

export const tableTfootCVA = cva('relative', {
  compoundVariants: tableIntents.flatMap((intent) => [
    { class: stickyFooterBackground[intent], intent, sticky: true as const },
    { class: stickyFooterBackground[intent], intent, sticky: 'footer' as const },
  ]),
  defaultVariants: {
    intent: 'neutral',
    sticky: false,
  },
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<TableIntent, string>,
    sticky: {
      false: '',
      footer: '',
      header: '',
      true: '',
    } satisfies Record<string, string>,
  },
})

export const tableRowCVA = cva('border-b transition-colors', {
  compoundVariants: tableIntents.flatMap((intent) => [
    { class: selectedRowBackground[intent], intent, selected: true as const },
    { class: pinnedRowBackground[intent], intent, pinned: true as const },
    { class: expandedRowBackground[intent], expanded: true as const, intent },
  ]),
  defaultVariants: {
    expanded: false,
    intent: 'neutral',
    pinned: false,
    selected: false,
  },
  variants: {
    expanded: {
      false: '',
      true: '',
    },
    intent: {
      accent: 'border-accent-border-subtle',
      neutral: 'border-neutral-border-subtle',
      primary: 'border-primary-border-subtle',
      secondary: 'border-secondary-border-subtle',
    } satisfies Record<TableIntent, string>,
    pinned: {
      false: '',
      true: '',
    },
    selected: {
      false: '',
      true: '',
    },
  },
})

export const tableHeadCVA = cva(
  'border-b text-left align-middle font-semibold [&:has([role=checkbox])]:pe-0',
  {
    compoundVariants: tableIntents.map((intent) => ({
      class: pinnedHeadBackground[intent],
      intent,
      pinned: true as const,
    })),
    defaultVariants: {
      intent: 'neutral',
      pinned: false,
      size: 'md',
    },
    variants: {
      intent: {
        accent: 'border-accent-border-subtle text-accent-text',
        neutral: 'border-neutral-border-subtle text-neutral-text',
        primary: 'border-primary-border-subtle text-primary-text',
        secondary: 'border-secondary-border-subtle text-secondary-text',
      } satisfies Record<TableIntent, string>,
      pinned: {
        false: '',
        true: 'sticky z-20',
      },
      size: {
        lg: 'txt-base px-4 py-3.5',
        md: 'txt-label px-4 py-3',
        sm: 'txt-caption px-2 py-2',
      } satisfies Record<TableSize, string>,
    },
  },
)

export const tableCellCVA = cva('border-b align-middle [&:has([role=checkbox])]:pe-0', {
  compoundVariants: tableIntents.map((intent) => ({
    class: pinnedCellBackground[intent],
    intent,
    pinned: true as const,
  })),
  defaultVariants: {
    intent: 'neutral',
    pinned: false,
    size: 'md',
  },
  variants: {
    intent: {
      accent: 'border-accent-border-subtle text-accent-text-subtle',
      neutral: 'border-neutral-border-subtle text-neutral-text-subtle',
      primary: 'border-primary-border-subtle text-primary-text-subtle',
      secondary: 'border-secondary-border-subtle text-secondary-text-subtle',
    } satisfies Record<TableIntent, string>,
    pinned: {
      false: '',
      true: 'sticky z-10',
    },
    size: {
      lg: 'txt-base px-4 py-3.5',
      md: 'txt-base px-4 py-3',
      sm: 'txt-caption px-2 py-2',
    } satisfies Record<TableSize, string>,
  },
})

export const tableEmptyCVA = cva('py-8 text-center', {
  defaultVariants: {
    intent: 'neutral',
    size: 'md',
  },
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<TableIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-base',
      sm: 'txt-caption',
    } satisfies Record<TableSize, string>,
  },
})

export const tableLoadingCVA = cva('py-8 text-center', {
  defaultVariants: {
    intent: 'neutral',
    size: 'md',
  },
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<TableIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-base',
      sm: 'txt-caption',
    } satisfies Record<TableSize, string>,
  },
})

export function resolveStickyVariant(
  sticky: TableSticky | undefined,
): boolean | 'header' | 'footer' {
  if (sticky === true) return true
  if (sticky === 'header') return 'header'
  if (sticky === 'footer') return 'footer'
  return false
}
