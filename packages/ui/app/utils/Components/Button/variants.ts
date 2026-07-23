import { cva } from 'class-variance-authority'

import type { ButtonIntent, ButtonSize, ButtonVariant } from '~/utils/Components/Button/context'

export const buttonCVA = cva('inline-flex h-full items-center justify-center', {
  compoundVariants: [
    {
      class:
        'border-neutral-border bg-neutral-fill text-neutral-on-fill hover:border-neutral-border-hover hover:bg-neutral-fill-hover active:border-neutral-border-active active:bg-neutral-fill-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'neutral',
      variant: 'default',
    },
    {
      class:
        'border-primary-border bg-primary-fill text-primary-on-fill hover:border-primary-border-hover hover:bg-primary-fill-hover active:border-primary-border-active active:bg-primary-fill-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'primary',
      variant: 'default',
    },
    {
      class:
        'border-secondary-border bg-secondary-fill text-secondary-on-fill hover:border-secondary-border-hover hover:bg-secondary-fill-hover active:border-secondary-border-active active:bg-secondary-fill-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'secondary',
      variant: 'default',
    },
    {
      class:
        'border-accent-border bg-accent-fill text-accent-on-fill hover:border-accent-border-hover hover:bg-accent-fill-hover active:border-accent-border-active active:bg-accent-fill-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'accent',
      variant: 'default',
    },
    {
      class:
        'border-info-border bg-info-fill text-info-on-fill hover:border-info-border-hover hover:bg-info-fill-hover active:border-info-border-active active:bg-info-fill-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'info',
      variant: 'default',
    },
    {
      class:
        'border-warning-border bg-warning-fill text-warning-on-fill hover:border-warning-border-hover hover:bg-warning-fill-hover active:border-warning-border-active active:bg-warning-fill-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'warning',
      variant: 'default',
    },
    {
      class:
        'border-error-border bg-error-fill text-error-on-fill hover:border-error-border-hover hover:bg-error-fill-hover active:border-error-border-active active:bg-error-fill-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'error',
      variant: 'default',
    },
    {
      class:
        'border-success-border bg-success-fill text-success-on-fill hover:border-success-border-hover hover:bg-success-fill-hover active:border-success-border-active active:bg-success-fill-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'success',
      variant: 'default',
    },
    {
      class:
        'border-primary-border-subtle bg-primary-fill-subtle text-primary-text-subtle hover:border-primary-border-subtle-hover hover:bg-primary-fill-subtle-hover active:border-primary-border-subtle-active active:bg-primary-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'primary',
      variant: 'subtle',
    },
    {
      class:
        'border-secondary-border-subtle bg-secondary-fill-subtle text-secondary-text-subtle hover:border-secondary-border-subtle-hover hover:bg-secondary-fill-subtle-hover active:border-secondary-border-subtle-active active:bg-secondary-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'secondary',
      variant: 'subtle',
    },
    {
      class:
        'border-accent-border-subtle bg-accent-fill-subtle text-accent-text-subtle hover:border-accent-border-subtle-hover hover:bg-accent-fill-subtle-hover active:border-accent-border-subtle-active active:bg-accent-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'accent',
      variant: 'subtle',
    },
    {
      class:
        'border-neutral-border-subtle bg-neutral-fill-subtle text-neutral-text-subtle hover:border-neutral-border-subtle-hover hover:bg-neutral-fill-subtle-hover active:border-neutral-border-subtle-active active:bg-neutral-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'neutral',
      variant: 'subtle',
    },
    {
      class:
        'border-info-border-subtle bg-info-fill-subtle text-info-text-subtle hover:border-info-border-subtle-hover hover:bg-info-fill-subtle-hover active:border-info-border-subtle-active active:bg-info-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'info',
      variant: 'subtle',
    },
    {
      class:
        'border-warning-border-subtle bg-warning-fill-subtle text-warning-text-subtle hover:border-warning-border-subtle-hover hover:bg-warning-fill-subtle-hover active:border-warning-border-subtle-active active:bg-warning-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'warning',
      variant: 'subtle',
    },
    {
      class:
        'border-error-border-subtle bg-error-fill-subtle text-error-text-subtle hover:border-error-border-subtle-hover hover:bg-error-fill-subtle-hover active:border-error-border-subtle-active active:bg-error-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'error',
      variant: 'subtle',
    },
    {
      class:
        'border-success-border-subtle bg-success-fill-subtle text-success-text-subtle hover:border-success-border-subtle-hover hover:bg-success-fill-subtle-hover active:border-success-border-subtle-active active:bg-success-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'success',
      variant: 'subtle',
    },
    {
      class:
        'bg-transparent text-primary-text-subtle hover:border-primary-border-subtle-hover! hover:bg-primary-fill-subtle-hover active:border-primary-border-subtle-active active:bg-primary-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'primary',
      variant: 'ghost',
    },
    {
      class:
        'bg-transparent text-secondary-text-subtle hover:border-secondary-border-subtle-hover hover:bg-secondary-fill-subtle-hover active:border-secondary-border-subtle-active active:bg-secondary-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'secondary',
      variant: 'ghost',
    },
    {
      class:
        'bg-transparent text-accent-text-subtle hover:border-accent-border-subtle-hover hover:bg-accent-fill-subtle-hover active:border-accent-border-subtle-active active:bg-accent-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'accent',
      variant: 'ghost',
    },
    {
      class:
        'bg-transparent text-neutral-text-subtle hover:border-neutral-border-subtle-hover hover:bg-neutral-fill-subtle-hover active:border-neutral-border-subtle-active active:bg-neutral-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'neutral',
      variant: 'ghost',
    },
    {
      class:
        'bg-transparent text-info-text-subtle hover:border-info-border-subtle-hover hover:bg-info-fill-subtle-hover active:border-info-border-subtle-active active:bg-info-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'info',
      variant: 'ghost',
    },
    {
      class:
        'bg-transparent text-warning-text-subtle hover:border-warning-border-subtle-hover hover:bg-warning-fill-subtle-hover active:border-warning-border-subtle-active active:bg-warning-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'warning',
      variant: 'ghost',
    },
    {
      class:
        'bg-transparent text-error-text-subtle hover:border-error-border-subtle-hover hover:bg-error-fill-subtle-hover active:border-error-border-subtle-active active:bg-error-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'error',
      variant: 'ghost',
    },
    {
      class:
        'bg-transparent text-success-text-subtle hover:border-success-border-subtle-hover hover:bg-success-fill-subtle-hover active:border-success-border-subtle-active active:bg-success-fill-subtle-active disabled:pointer-events-none disabled:opacity-40',
      intent: 'success',
      variant: 'ghost',
    },
  ],
  variants: {
    disabled: {
      false: 'cursor-pointer active:scale-97',
      true: 'cursor-not-allowed',
    },
    intent: {
      accent: '',
      error: '',
      info: '',
      neutral: '',
      primary: '',
      secondary: '',
      success: '',
      warning: '',
    } satisfies Record<ButtonIntent, string>,
    size: {
      lg: 'txt-label gap-4 rounded-xs px-4 py-2',
      md: 'txt-base gap-3 rounded-xs px-3 py-1.75',
      sm: 'txt-caption gap-1.5 rounded-xs px-2 py-0.75',
    } satisfies Record<ButtonSize, string>,
    variant: {
      default: 'border',
      ghost:
        'border border-transparent hover:border-inherit active:border-inherit disabled:border-inherit',
      subtle: 'border',
    } satisfies Record<ButtonVariant, string>,
  },
})

export const toggleCVA = cva('', {
  compoundVariants: [
    {
      class:
        'data-[state=on]:text-neutral-text-inverse-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-neutral-border-active data-[state=on]:bg-neutral-fill-active',
      intent: 'neutral',
      variant: 'default',
    },
    {
      class:
        'data-[state=on]:text-primary-text-inverse-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-primary-border-active data-[state=on]:bg-primary-fill-active',
      intent: 'primary',
      variant: 'default',
    },
    {
      class:
        'data-[state=on]:text-secondary-text-inverse-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-secondary-border-active data-[state=on]:bg-secondary-fill-active',
      intent: 'secondary',
      variant: 'default',
    },
    {
      class:
        'data-[state=on]:text-accent-text-inverse-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-accent-border-active data-[state=on]:bg-accent-fill-active',
      intent: 'accent',
      variant: 'default',
    },
    {
      class:
        'data-[state=on]:text-info-text-inverse-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-info-border-active data-[state=on]:bg-info-fill-active',
      intent: 'info',
      variant: 'default',
    },
    {
      class:
        'data-[state=on]:text-warning-text-inverse-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-warning-border-active data-[state=on]:bg-warning-fill-active',
      intent: 'warning',
      variant: 'default',
    },
    {
      class:
        'data-[state=on]:text-error-text-inverse-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-error-border-active data-[state=on]:bg-error-fill-active',
      intent: 'error',
      variant: 'default',
    },
    {
      class:
        'data-[state=on]:text-success-text-inverse-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-success-border-active data-[state=on]:bg-success-fill-active',
      intent: 'success',
      variant: 'default',
    },
    {
      class:
        'data-[state=on]:text-primary-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-primary-border-subtle-active data-[state=on]:bg-primary-fill-subtle-active',
      intent: 'primary',
      variant: 'subtle',
    },
    {
      class:
        'data-[state=on]:text-secondary-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-secondary-border-subtle-active data-[state=on]:bg-secondary-fill-subtle-active',
      intent: 'secondary',
      variant: 'subtle',
    },
    {
      class:
        'data-[state=on]:text-accent-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-accent-border-subtle-active data-[state=on]:bg-accent-fill-subtle-active',
      intent: 'accent',
      variant: 'subtle',
    },
    {
      class:
        'data-[state=on]:text-neutral-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-neutral-border-subtle-active data-[state=on]:bg-neutral-fill-subtle-active',
      intent: 'neutral',
      variant: 'subtle',
    },
    {
      class:
        'data-[state=on]:text-info-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-info-border-subtle-active data-[state=on]:bg-info-fill-subtle-active',
      intent: 'info',
      variant: 'subtle',
    },
    {
      class:
        'data-[state=on]:text-warning-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-warning-border-subtle-active data-[state=on]:bg-warning-fill-subtle-active',
      intent: 'warning',
      variant: 'subtle',
    },
    {
      class:
        'data-[state=on]:text-error-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-error-border-subtle-active data-[state=on]:bg-error-fill-subtle-active',
      intent: 'error',
      variant: 'subtle',
    },
    {
      class:
        'data-[state=on]:text-success-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-success-border-subtle-active data-[state=on]:bg-success-fill-subtle-active',
      intent: 'success',
      variant: 'subtle',
    },
    {
      class:
        'data-[state=on]:text-primary-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-primary-border-subtle-active data-[state=on]:bg-primary-fill-subtle-active',
      intent: 'primary',
      variant: 'ghost',
    },
    {
      class:
        'data-[state=on]:text-secondary-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-secondary-border-subtle-active data-[state=on]:bg-secondary-fill-subtle-active',
      intent: 'secondary',
      variant: 'ghost',
    },
    {
      class:
        'data-[state=on]:text-accent-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-accent-border-subtle-active data-[state=on]:bg-accent-fill-subtle-active',
      intent: 'accent',
      variant: 'ghost',
    },
    {
      class:
        'data-[state=on]:text-neutral-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-neutral-border-subtle-active data-[state=on]:bg-neutral-fill-subtle-active',
      intent: 'neutral',
      variant: 'ghost',
    },
    {
      class:
        'data-[state=on]:text-info-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-info-border-subtle-active data-[state=on]:bg-info-fill-subtle-active',
      intent: 'info',
      variant: 'ghost',
    },
    {
      class:
        'data-[state=on]:text-warning-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-warning-border-subtle-active data-[state=on]:bg-warning-fill-subtle-active',
      intent: 'warning',
      variant: 'ghost',
    },
    {
      class:
        'data-[state=on]:text-error-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-error-border-subtle-active data-[state=on]:bg-error-fill-subtle-active',
      intent: 'error',
      variant: 'ghost',
    },
    {
      class:
        'data-[state=on]:text-success-text-subtle-active disabled:pointer-events-none disabled:opacity-40 data-[state=on]:border-success-border-subtle-active data-[state=on]:bg-success-fill-subtle-active',
      intent: 'success',
      variant: 'ghost',
    },
  ],
  variants: {
    intent: {
      accent: '',
      error: '',
      info: '',
      neutral: '',
      primary: '',
      secondary: '',
      success: '',
      warning: '',
    } satisfies Record<ButtonIntent, string>,
    variant: {
      default: '',
      ghost: '',
      subtle: '',
    } satisfies Record<ButtonVariant, string>,
  },
})
