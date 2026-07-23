import { cva } from 'class-variance-authority'

import type { CarouselIntent, CarouselSize } from './context'

export const carouselRootCVA = cva(
  'relative flex w-full flex-col gap-4 data-[orientation=vertical]:flex-row',
  {
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
      } satisfies Record<CarouselIntent, string>,
      size: {
        lg: 'gap-5',
        md: 'gap-4',
        sm: 'gap-3',
      } satisfies Record<CarouselSize, string>,
    },
  },
)

export const carouselControlCVA = cva('flex items-center gap-2', {
  defaultVariants: {
    orientation: 'horizontal',
  },
  variants: {
    orientation: {
      horizontal: 'flex-row justify-between',
      vertical: 'flex-col justify-between',
    },
  },
})

export const carouselItemGroupCVA = cva(
  [
    'flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden',
    'scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]',
    '[&::-webkit-scrollbar]:hidden',
    'data-[orientation=vertical]:flex-col data-[orientation=vertical]:overflow-x-hidden data-[orientation=vertical]:overflow-y-auto',
  ].join(' '),
)

export const carouselItemCVA = cva('min-w-0 shrink-0 grow-0 basis-(--slide-item-size,100%)', {
  variants: {
    size: {
      lg: '',
      md: '',
      sm: '',
    } satisfies Record<CarouselSize, string>,
  },
})

export const carouselViewportCVA = cva('group/viewport relative w-full')

export const carouselOverlayTriggerCVA = cva(
  [
    'absolute z-10 opacity-0 transition-opacity',
    'group-hover/viewport:opacity-100 group-focus-within/viewport:opacity-100',
    'focus-visible:opacity-100',
  ].join(' '),
  {
    compoundVariants: [
      {
        class: 'top-1/2 left-2 -translate-y-1/2',
        orientation: 'horizontal',
        position: 'prev',
      },
      {
        class: 'top-1/2 right-2 -translate-y-1/2',
        orientation: 'horizontal',
        position: 'next',
      },
      {
        class: 'top-2 left-1/2 -translate-x-1/2',
        orientation: 'vertical',
        position: 'prev',
      },
      {
        class: 'bottom-2 left-1/2 -translate-x-1/2',
        orientation: 'vertical',
        position: 'next',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      position: 'prev',
    },
    variants: {
      orientation: {
        horizontal: '',
        vertical: '',
      },
      position: {
        next: '',
        prev: '',
      },
    },
  },
)

export const carouselIndicatorGroupCVA = cva('flex items-center justify-center', {
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'dot',
  },
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    variant: {
      dot: 'gap-2',
      thumbnail: 'gap-3',
    },
  },
})

export const carouselDotIndicatorCVA = cva(
  'size-2.5 shrink-0 cursor-pointer border-0 p-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-border disabled:cursor-not-allowed disabled:opacity-50 data-[current]:ring',
  {
    defaultVariants: {
      intent: 'primary',
    },
    variants: {
      intent: {
        accent:
          'bg-accent-fill-subtle data-[current]:bg-accent-fill data-[current]:ring-accent-border',
        neutral:
          'bg-neutral-fill-subtle data-[current]:bg-neutral-fill data-[current]:ring-neutral-border',
        primary:
          'bg-primary-fill-subtle data-[current]:bg-primary-fill data-[current]:ring-primary-border',
        secondary:
          'bg-secondary-fill-subtle data-[current]:bg-secondary-fill data-[current]:ring-secondary-border',
      } satisfies Record<CarouselIntent, string>,
    },
  },
)

export const carouselThumbnailIndicatorCVA = cva(
  'block shrink-0 cursor-pointer overflow-hidden border-2 border-transparent p-0 opacity-60 transition-[opacity,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-border disabled:cursor-not-allowed disabled:opacity-50 data-[current]:opacity-100 data-[current]:ring',
  {
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
    variants: {
      intent: {
        accent: 'data-[current]:ring-accent-border',
        neutral: 'data-[current]:ring-neutral-border',
        primary: 'data-[current]:ring-primary-border',
        secondary: 'data-[current]:ring-secondary-border',
      } satisfies Record<CarouselIntent, string>,
      size: {
        lg: 'h-28 w-44',
        md: 'h-24 w-36',
        sm: 'h-20 w-28',
      } satisfies Record<CarouselSize, string>,
    },
  },
)

export const carouselProgressTextCVA = cva('txt-label font-medium tabular-nums', {
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
    } satisfies Record<CarouselIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<CarouselSize, string>,
  },
})
