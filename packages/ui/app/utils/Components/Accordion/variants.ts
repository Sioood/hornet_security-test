import { cva } from 'class-variance-authority'

import type { AccordionIntent, AccordionSize } from './context'

export const accordionRootCVA = cva(
  [
    'accordionRoot flex w-full',
    'data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
  ],
  {
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
      } satisfies Record<AccordionIntent, string>,
      size: {
        md: '',
      } satisfies Record<AccordionSize, string>,
    },
  },
)

export const accordionItemCVA = cva(
  [
    'accordionItem',
    'overflow-hidden',
    'flex w-full items-center data-[orientation=horizontal]:w-fit data-[orientation=vertical]:flex-col',
  ],
  {
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    },
    variants: {
      intent: {
        accent: 'border-accent-border-subtle',
        neutral: 'border-neutral-border-subtle',
        primary: 'border-primary-border-subtle',
        secondary: 'border-secondary-border-subtle',
      } satisfies Record<AccordionIntent, string>,
      size: {
        md: 'txt-h6 gap-3 p-1 data-[orientation=horizontal]:border-r data-[orientation=vertical]:border-b',
      } satisfies Record<AccordionSize, string>,
    },
  },
)

export const accordionItemTriggerCVA = cva(
  [
    'accordionItemTrigger',
    'flex w-full items-center justify-between text-left data-[orientation=horizontal]:w-fit data-[orientation=horizontal]:flex-col',
    'not-disabled:cursor-pointer disabled:pointer-events-none',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  ],
  {
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
      } satisfies Record<AccordionIntent, string>,
      size: {
        md: 'txt-h6 gap-3 p-1',
      } satisfies Record<AccordionSize, string>,
    },
  },
)

export const accordionItemContentCVA = cva(
  [
    'accordionItemContent',
    'size-full',
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1',
    'data-[orientation=horizontal]:data-[state=closed]:slide-out-to-left-1 data-[orientation=horizontal]:data-[state=open]:slide-in-from-left-1',
  ],
  {
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    },
    variants: {
      intent: {
        accent: 'border-accent-border-subtle text-accent-text',
        neutral: 'border-neutral-border-subtle text-neutral-text',
        primary: 'border-primary-border-subtle text-primary-text',
        secondary: 'border-secondary-border-subtle text-secondary-text',
      } satisfies Record<AccordionIntent, string>,
      size: {
        md: 'txt-base data-[orientation=horizontal]:border-l data-[orientation=horizontal]:px-4 data-[orientation=vertical]:border-t data-[orientation=vertical]:py-4',
      } satisfies Record<AccordionSize, string>,
    },
  },
)

export const accordionItemIndicatorCVA = cva(
  [
    'accordionItemIndicator inline-flex shrink-0 transition-transform duration-200',
    'data-[state=open]:data-[orientation=vertical]:rotate-180',
    'data-[state=open]:data-[orientation=horizontal]:rotate-90',
  ],
  {
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
      } satisfies Record<AccordionIntent, string>,
      size: {
        md: 'size-4',
      } satisfies Record<AccordionSize, string>,
    },
  },
)
