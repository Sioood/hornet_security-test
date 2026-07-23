import { cva } from 'class-variance-authority'

import type { TreeViewIntent, TreeViewSize } from './context'

export const treeViewRootCVA = cva('flex w-full flex-col gap-2', {
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<TreeViewIntent, string>,
    size: {
      lg: 'txt-base max-w-md',
      md: 'txt-label max-w-sm',
      sm: 'txt-caption max-w-xs',
    } satisfies Record<TreeViewSize, string>,
  },
})

export const treeViewLabelCVA = cva('font-medium select-none', {
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<TreeViewIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<TreeViewSize, string>,
  },
})

export const treeViewTreeCVA = cva('flex flex-col outline-none', {
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<TreeViewIntent, string>,
    size: {
      lg: 'gap-1',
      md: 'gap-0.5',
      sm: 'gap-0.5',
    } satisfies Record<TreeViewSize, string>,
  },
})

const treeNodeRowBase = [
  'relative flex w-full items-center gap-2 border-0 bg-transparent text-start select-none',
  'not-data-[disabled]:cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  'ps-[calc(0.75rem+1rem*(var(--depth,1)-1))] pe-3 py-1.5',
  'focus-visible:focus-ring',
  'data-[focus]:z-1',
]

const treeNodeSelectedText = {
  accent: 'data-[selected]:font-medium data-[selected]:text-accent-text',
  neutral: 'data-[selected]:font-medium data-[selected]:text-neutral-text',
  primary: 'data-[selected]:font-medium data-[selected]:text-primary-text',
  secondary: 'data-[selected]:font-medium data-[selected]:text-secondary-text',
} satisfies Record<TreeViewIntent, string>

export const treeViewBranchControlCVA = cva(treeNodeRowBase, {
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
  variants: {
    intent: {
      accent: `text-accent-text hover:text-accent-text ${treeNodeSelectedText.accent}`,
      neutral: `text-neutral-text hover:text-neutral-text ${treeNodeSelectedText.neutral}`,
      primary: `text-primary-text hover:text-primary-text ${treeNodeSelectedText.primary}`,
      secondary: `text-secondary-text hover:text-secondary-text ${treeNodeSelectedText.secondary}`,
    } satisfies Record<TreeViewIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<TreeViewSize, string>,
  },
})

export const treeViewItemCVA = cva(treeNodeRowBase, {
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
  variants: {
    intent: {
      accent: `text-accent-text hover:text-accent-text ${treeNodeSelectedText.accent}`,
      neutral: `text-neutral-text hover:text-neutral-text ${treeNodeSelectedText.neutral}`,
      primary: `text-primary-text hover:text-primary-text ${treeNodeSelectedText.primary}`,
      secondary: `text-secondary-text hover:text-secondary-text ${treeNodeSelectedText.secondary}`,
    } satisfies Record<TreeViewIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<TreeViewSize, string>,
  },
})

export const treeViewBranchContentCVA = cva('relative', {
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<TreeViewIntent, string>,
    size: {
      lg: '',
      md: '',
      sm: '',
    } satisfies Record<TreeViewSize, string>,
  },
})

export const treeViewBranchIndentGuideCVA = cva(
  'absolute top-0 left-[calc(0.75rem+1rem*(var(--depth,1)-1)+0.5rem-1px)] z-1 h-full w-px p-0',
  {
    variants: {
      intent: {
        accent: 'bg-accent-border-subtle',
        neutral: 'bg-neutral-border-subtle',
        primary: 'bg-primary-border-subtle',
        secondary: 'bg-secondary-border-subtle',
      } satisfies Record<TreeViewIntent, string>,
      size: {
        lg: '',
        md: '',
        sm: '',
      } satisfies Record<TreeViewSize, string>,
    },
  },
)

export const treeViewBranchTriggerCVA = cva('inline-flex shrink-0 items-center justify-center', {
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<TreeViewIntent, string>,
    size: {
      lg: '',
      md: '',
      sm: '',
    } satisfies Record<TreeViewSize, string>,
  },
})

export const treeViewBranchIndicatorCVA = cva(
  'inline-flex shrink-0 items-center justify-center text-neutral-text-subtle transition-transform duration-150 data-[state=open]:rotate-90',
  {
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
    variants: {
      intent: {
        accent: 'text-accent-text-subtle',
        neutral: 'text-neutral-text-subtle',
        primary: 'text-primary-text-subtle',
        secondary: 'text-secondary-text-subtle',
      } satisfies Record<TreeViewIntent, string>,
      size: {
        lg: 'size-4',
        md: 'size-4',
        sm: 'size-3.5',
      } satisfies Record<TreeViewSize, string>,
    },
  },
)

export const treeViewNodeTextCVA = cva('inline-flex min-w-0 flex-1 items-center gap-2 truncate', {
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<TreeViewIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<TreeViewSize, string>,
  },
})

export const treeViewNodeRenameInputCVA = cva(
  'txt-label min-w-0 flex-1 border border-primary-border-strong bg-neutral-fill-subtle px-1 py-0 text-primary-text outline-none focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      intent: {
        accent: 'border-accent-border-strong text-accent-text',
        neutral: 'border-neutral-border-strong text-neutral-text',
        primary: 'border-primary-border-strong text-primary-text',
        secondary: 'border-secondary-border-strong text-secondary-text',
      } satisfies Record<TreeViewIntent, string>,
      size: {
        lg: 'txt-base',
        md: 'txt-label',
        sm: 'txt-caption',
      } satisfies Record<TreeViewSize, string>,
    },
  },
)
