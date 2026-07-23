import { cva } from 'class-variance-authority'

import type { RatingIntent, RatingSize } from './context'

export const ratingRootCVA = cva('flex flex-col gap-1.5 data-[readonly]:pointer-events-none', {
  defaultVariants: {
    intent: 'primary',
  },
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<RatingIntent, string>,
  },
})

export const ratingLabelCVA = cva('select-none data-[disabled]:opacity-50', {
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
    } satisfies Record<RatingIntent, string>,
    size: {
      lg: 'txt-h6',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<RatingSize, string>,
  },
})

export const ratingControlCVA = cva('inline-flex items-center', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'gap-1.5',
      md: 'gap-1',
      sm: 'gap-0.5',
    } satisfies Record<RatingSize, string>,
  },
})

export const ratingItemCVA = cva(
  'inline-flex items-center justify-center outline-none not-data-[disabled]:cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:grayscale',
  {
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
    variants: {
      intent: {
        accent: 'focus-visible:ring-accent-border',
        neutral: 'focus-visible:ring-neutral-border',
        primary: 'focus-visible:ring-primary-border',
        secondary: 'focus-visible:ring-secondary-border',
      } satisfies Record<RatingIntent, string>,
      size: {
        lg: '',
        md: '',
        sm: '',
      } satisfies Record<RatingSize, string>,
    },
  },
)

export const ratingStarIconCVA = cva('shrink-0', {
  compoundVariants: [
    {
      class: 'text-neutral-text-subtle',
      intent: 'neutral',
      state: 'empty',
    },
    {
      class: 'text-primary-text-subtle',
      intent: 'primary',
      state: 'empty',
    },
    {
      class: 'text-secondary-text-subtle',
      intent: 'secondary',
      state: 'empty',
    },
    {
      class: 'text-accent-text-subtle',
      intent: 'accent',
      state: 'empty',
    },
    {
      class: 'text-neutral-fill',
      intent: 'neutral',
      state: 'half',
    },
    {
      class: 'text-primary-fill',
      intent: 'primary',
      state: 'half',
    },
    {
      class: 'text-secondary-fill',
      intent: 'secondary',
      state: 'half',
    },
    {
      class: 'text-accent-fill',
      intent: 'accent',
      state: 'half',
    },
    {
      class: 'text-neutral-fill',
      intent: 'neutral',
      state: 'full',
    },
    {
      class: 'text-primary-fill',
      intent: 'primary',
      state: 'full',
    },
    {
      class: 'text-secondary-fill',
      intent: 'secondary',
      state: 'full',
    },
    {
      class: 'text-accent-fill',
      intent: 'accent',
      state: 'full',
    },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'md',
    state: 'empty',
  },
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<RatingIntent, string>,
    size: {
      lg: 'size-6',
      md: 'size-5',
      sm: 'size-4',
    } satisfies Record<RatingSize, string>,
    state: {
      empty: '',
      full: '',
      half: '',
    } satisfies Record<'empty' | 'full' | 'half', string>,
  },
})

export const ratingValueTextCVA = cva('font-mono tabular-nums', {
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
    } satisfies Record<RatingIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<RatingSize, string>,
  },
})
