import { cva } from 'class-variance-authority'

import type { StepsIntent, StepsSize } from './context'

export const stepsRootCVA = cva('flex flex-col gap-4', {
  defaultVariants: {
    intent: 'neutral',
    size: 'md',
  },
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<StepsIntent, string>,
    size: {
      lg: '',
      md: '',
      sm: '',
    } satisfies Record<StepsSize, string>,
  },
})

export const stepsListCVA = cva('flex w-full justify-center data-[orientation=vertical]:flex-col', {
  defaultVariants: {
    intent: 'neutral',
    size: 'md',
  },
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<StepsIntent, string>,
    size: {
      lg: 'gap-4',
      md: 'gap-3',
      sm: 'gap-2',
    } satisfies Record<StepsSize, string>,
  },
})

export const stepsItemCVA = cva(
  'group flex flex-1 items-center last:flex-none data-[orientation=vertical]:items-start',
  {
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    },
    variants: {
      intent: {
        accent: '',
        neutral: '',
        primary: '',
        secondary: '',
      } satisfies Record<StepsIntent, string>,
      size: {
        lg: 'gap-3',
        md: 'gap-2',
        sm: 'gap-1.5',
      } satisfies Record<StepsSize, string>,
    },
  },
)

export const stepsContentCVA = cva('w-full', {
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
    } satisfies Record<StepsIntent, string>,
    size: {
      lg: 'txt-h6 py-4',
      md: 'txt-base py-3',
      sm: 'txt-body-sm py-2',
    } satisfies Record<StepsSize, string>,
  },
})

export const stepsIndicatorCVA = cva(
  ['inline-flex shrink-0 items-center justify-center', 'transition-colors duration-150'],
  {
    compoundVariants: [
      // Pending
      {
        className:
          'border-neutral-border-subtle bg-neutral-fill-subtle text-neutral-text-subtle disabled:pointer-events-none disabled:opacity-40',
        intent: 'neutral',
        status: 'pending',
      },
      {
        className:
          'border-primary-border-subtle bg-primary-fill-subtle text-primary-text-subtle disabled:pointer-events-none disabled:opacity-40',
        intent: 'primary',
        status: 'pending',
      },
      {
        className:
          'border-secondary-border-subtle bg-secondary-fill-subtle text-secondary-text-subtle disabled:pointer-events-none disabled:opacity-40',
        intent: 'secondary',
        status: 'pending',
      },
      {
        className:
          'border-accent-border-subtle bg-accent-fill-subtle text-accent-text-subtle disabled:pointer-events-none disabled:opacity-40',
        intent: 'accent',
        status: 'pending',
      },
      // Current
      {
        className:
          'border-neutral-border bg-neutral-fill text-neutral-on-fill disabled:pointer-events-none disabled:opacity-40',
        intent: 'neutral',
        status: ['current', 'completed'],
      },
      {
        className:
          'border-primary-border bg-primary-fill text-primary-on-fill disabled:pointer-events-none disabled:opacity-40',
        intent: 'primary',
        status: ['current', 'completed'],
      },
      {
        className:
          'border-secondary-border bg-secondary-fill text-secondary-on-fill disabled:pointer-events-none disabled:opacity-40',
        intent: 'secondary',
        status: ['current', 'completed'],
      },
      {
        className:
          'border-accent-border bg-accent-fill text-accent-on-fill disabled:pointer-events-none disabled:opacity-40',
        intent: 'accent',
        status: ['current', 'completed'],
      },
    ],
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
      status: 'pending',
    },
    variants: {
      intent: {
        accent: '',
        neutral: '',
        primary: '',
        secondary: '',
      } satisfies Record<StepsIntent, string>,
      size: {
        lg: 'txt-base size-10 rounded-xs border',
        md: 'txt-label size-8 rounded-xs border',
        sm: 'txt-caption size-6 rounded-xs border',
      } satisfies Record<StepsSize, string>,
      status: {
        completed: '',
        current: '',
        pending: '',
      },
    },
  },
)

export const stepsSeparatorCVA = cva(['flex-1 shrink-0 transition-colors duration-150'], {
  compoundVariants: [
    {
      className: 'bg-neutral-border',
      completed: true,
      intent: 'neutral',
    },
    {
      className: 'bg-primary-border',
      completed: true,
      intent: 'primary',
    },
    {
      className: 'bg-secondary-border',
      completed: true,
      intent: 'secondary',
    },
    {
      className: 'bg-accent-border',
      completed: true,
      intent: 'accent',
    },
  ],
  defaultVariants: {
    completed: false,
    intent: 'neutral',
    orientation: 'horizontal',
    size: 'md',
  },
  variants: {
    completed: {
      false: '',
      true: '',
    },
    intent: {
      accent: 'bg-accent-border-subtle',
      neutral: 'bg-neutral-border-subtle',
      primary: 'bg-primary-border-subtle',
      secondary: 'bg-secondary-border-subtle',
    } satisfies Record<StepsIntent, string>,
    orientation: {
      horizontal: 'h-px self-center',
      vertical: 'mx-auto my-1 w-0.5 flex-none self-stretch',
    },
    size: {
      lg: '',
      md: '',
      sm: '',
    } satisfies Record<StepsSize, string>,
  },
})

export const stepsCompletedContentCVA = cva('w-full', {
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
    } satisfies Record<StepsIntent, string>,
    size: {
      lg: 'txt-h6 py-4',
      md: 'txt-base py-3',
      sm: 'txt-body-sm py-2',
    } satisfies Record<StepsSize, string>,
  },
})
