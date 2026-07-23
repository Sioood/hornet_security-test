import { cva } from 'class-variance-authority'

import type { ComponentIntent, ComponentSize } from '../contextBase'

export type SegmentedIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type SegmentedSize = NonNullable<ComponentSize>
export type SegmentedOrientation = 'horizontal' | 'vertical'
export type SegmentedVariant = 'pill' | 'line'

export const segmentedRootCVA = cva('relative inline-flex w-fit items-center', {
  compoundVariants: [
    {
      class:
        'border-neutral-border bg-neutral-fill-subtle disabled:pointer-events-none disabled:opacity-40',
      intent: 'neutral',
      variant: 'pill',
    },
    {
      class:
        'border-primary-border bg-primary-fill-subtle disabled:pointer-events-none disabled:opacity-40',
      intent: 'primary',
      variant: 'pill',
    },
    {
      class:
        'border-secondary-border bg-secondary-fill-subtle disabled:pointer-events-none disabled:opacity-40',
      intent: 'secondary',
      variant: 'pill',
    },
    {
      class:
        'border-accent-border bg-accent-fill-subtle disabled:pointer-events-none disabled:opacity-40',
      intent: 'accent',
      variant: 'pill',
    },
    {
      class: 'border-b p-0',
      orientation: 'horizontal',
      variant: 'line',
    },
    {
      class: 'border-r p-0',
      orientation: 'vertical',
      variant: 'line',
    },
    {
      class: 'border-neutral-border-subtle',
      intent: 'neutral',
      variant: 'line',
    },
    {
      class: 'border-primary-border-subtle',
      intent: 'primary',
      variant: 'line',
    },
    {
      class: 'border-secondary-border-subtle',
      intent: 'secondary',
      variant: 'line',
    },
    {
      class: 'border-accent-border-subtle',
      intent: 'accent',
      variant: 'line',
    },
  ],
  defaultVariants: {
    intent: 'primary',
    orientation: 'horizontal',
    size: 'md',
    variant: 'pill',
  },
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<SegmentedIntent, string>,
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    } satisfies Record<SegmentedOrientation, string>,
    size: {
      lg: 'gap-1.5 p-1.5',
      md: 'gap-1 p-1',
      sm: 'gap-0.5 p-0.5',
    } satisfies Record<SegmentedSize, string>,
    variant: {
      line: '',
      pill: 'rounded-xs border p-0.5',
    } satisfies Record<SegmentedVariant, string>,
  },
})

export const segmentedItemCVA = cva(
  'relative z-10 cursor-pointer font-medium transition-colors duration-200',
  {
    compoundVariants: [
      {
        class:
          'data-selected:text-neutral-text-inverse data-[state="checked"]:text-neutral-text-inverse',
        intent: 'neutral',
        variant: 'pill',
      },
      {
        class:
          'data-selected:text-primary-text-inverse data-[state="checked"]:text-primary-text-inverse',
        intent: 'primary',
        variant: 'pill',
      },
      {
        class:
          'data-selected:text-secondary-text-inverse data-[state="checked"]:text-secondary-text-inverse',
        intent: 'secondary',
        variant: 'pill',
      },
      {
        class:
          'data-selected:text-accent-text-inverse data-[state="checked"]:text-accent-text-inverse',
        intent: 'accent',
        variant: 'pill',
      },
      {
        class: 'data-selected:text-neutral-text data-[state="checked"]:text-neutral-text',
        intent: 'neutral',
        variant: 'line',
      },
      {
        class: 'data-selected:text-primary-text data-[state="checked"]:text-primary-text',
        intent: 'primary',
        variant: 'line',
      },
      {
        class: 'data-selected:text-secondary-text data-[state="checked"]:text-secondary-text',
        intent: 'secondary',
        variant: 'line',
      },
      {
        class: 'data-selected:text-accent-text data-[state="checked"]:text-accent-text',
        intent: 'accent',
        variant: 'line',
      },
    ],
    defaultVariants: {
      disabled: false,
      intent: 'primary',
      orientation: 'horizontal',
      size: 'md',
      variant: 'pill',
    },
    variants: {
      disabled: {
        true: 'pointer-events-none cursor-not-allowed opacity-50',
      },
      intent: {
        accent: 'border-accent-border-subtle text-accent-text-subtle hover:text-accent-text',
        neutral: 'border-neutral-border-subtle text-neutral-text-subtle hover:text-neutral-text',
        primary: 'border-primary-border-subtle text-primary-text-subtle hover:text-primary-text',
        secondary:
          'border-secondary-border-subtle text-secondary-text-subtle hover:text-secondary-text',
      } satisfies Record<SegmentedIntent, string>,
      orientation: {
        horizontal:
          'inline-flex max-w-full min-w-0 items-center justify-center gap-1.5 text-center whitespace-nowrap',
        vertical: 'inline-flex w-full min-w-0 flex-col items-start gap-1 text-left',
      } satisfies Record<SegmentedOrientation, string>,
      size: {
        lg: 'txt-base px-4 py-2',
        md: 'txt-label px-3 py-1.5',
        sm: 'txt-caption px-2 py-1',
      } satisfies Record<SegmentedSize, string>,
      variant: {
        line: '',
        pill: 'rounded-xs',
      } satisfies Record<SegmentedVariant, string>,
    },
  },
)

export const segmentedIndicatorCVA = cva(
  'pointer-events-none absolute transition-all duration-200 ease-out',
  {
    compoundVariants: [
      {
        class: 'translate-y-px border-b-2',
        orientation: 'horizontal',
        variant: 'line',
      },
      {
        class: 'translate-x-px border-r-2',
        orientation: 'vertical',
        variant: 'line',
      },
      {
        class: 'border-neutral-fill',
        intent: 'neutral',
        variant: 'line',
      },
      {
        class: 'border-primary-fill',
        intent: 'primary',
        variant: 'line',
      },
      {
        class: 'border-secondary-fill',
        intent: 'secondary',
        variant: 'line',
      },
      {
        class: 'border-accent-fill',
        intent: 'accent',
        variant: 'line',
      },
    ],
    defaultVariants: {
      intent: 'primary',
      orientation: 'horizontal',
      variant: 'pill',
    },
    variants: {
      intent: {
        accent: 'bg-accent-fill',
        neutral: 'bg-neutral-fill',
        primary: 'bg-primary-fill',
        secondary: 'bg-secondary-fill',
      } satisfies Record<SegmentedIntent, string>,
      orientation: {
        horizontal: '',
        vertical: '',
      } satisfies Record<SegmentedOrientation, string>,
      variant: {
        line: 'z-10 bg-transparent!',
        pill: '',
      } satisfies Record<SegmentedVariant, string>,
    },
  },
)
