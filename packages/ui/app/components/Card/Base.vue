<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

import type {
  CardIntent,
  CardSize,
  CardVariant,
  UICardBaseSlots,
} from '~/utils/Components/Card/context'

const cardCVA = cva('', {
  compoundVariants: [
    /** default */
    {
      class: 'border-neutral-border bg-neutral-surface text-neutral-text',
      intent: 'neutral',
      variant: 'default',
    },
    {
      class: 'border-primary-border bg-primary-surface text-primary-text',
      intent: 'primary',
      variant: 'default',
    },
    {
      class: 'border-secondary-border bg-secondary-surface text-secondary-text',
      intent: 'secondary',
      variant: 'default',
    },
    {
      class: 'border-accent-border bg-accent-surface text-accent-text',
      intent: 'accent',
      variant: 'default',
    },
    /** subtle */
    {
      class: 'border-accent-border-subtle bg-accent-surface-subtle text-accent-text-subtle',
      intent: 'accent',
      variant: 'subtle',
    },
    {
      class: 'border-neutral-border-subtle bg-neutral-surface-subtle text-neutral-text-subtle',
      intent: 'neutral',
      variant: 'subtle',
    },
    {
      class: 'border-primary-border-subtle bg-primary-surface-subtle text-primary-text-subtle',
      intent: 'primary',
      variant: 'subtle',
    },
    {
      class:
        'border-secondary-border-subtle bg-secondary-surface-subtle text-secondary-text-subtle',
      intent: 'secondary',
      variant: 'subtle',
    },
    {
      class: 'border-accent-border-subtle bg-accent-surface-subtle text-accent-text-subtle',
      intent: 'accent',
      variant: 'subtle',
    },
    /** strong */
    {
      class: 'border-neutral-border-strong bg-neutral-surface text-neutral-text',
      intent: 'neutral',
      variant: 'strong',
    },
    {
      class: 'border-primary-border-strong bg-primary-surface text-primary-text',
      intent: 'primary',
      variant: 'strong',
    },
    {
      class: 'border-secondary-border-strong bg-secondary-surface text-secondary-text',
      intent: 'secondary',
      variant: 'strong',
    },
    {
      class: 'border-accent-border-strong bg-accent-surface text-accent-text',
      intent: 'accent',
      variant: 'strong',
    },
    /** inverse */
    {
      class: 'border-neutral-border-inverse bg-neutral-surface-inverse text-neutral-text-inverse',
      intent: 'neutral',
      variant: 'inverse',
    },
    {
      class: 'border-primary-border-inverse bg-primary-surface-inverse text-primary-text-inverse',
      intent: 'primary',
      variant: 'inverse',
    },
    {
      class:
        'border-secondary-border-inverse bg-secondary-surface-inverse text-secondary-text-inverse',
      intent: 'secondary',
      variant: 'inverse',
    },
    {
      class: 'border-accent-border-inverse bg-accent-surface-inverse text-accent-text-inverse',
      intent: 'accent',
      variant: 'inverse',
    },
  ],
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<CardIntent, string>,
    size: {
      lg: 'p-4',
      md: 'p-2',
      sm: 'p-1',
    } satisfies Record<CardSize, string>,
    variant: {
      default: 'border',
      inverse: 'border',
      strong: 'border',
      subtle: 'border',
    } satisfies Record<CardVariant, string>,
  },
})

const cardHeaderFooterCVA = cva('', {
  compoundVariants: [
    /** default */
    {
      class: 'border-neutral-border bg-neutral-surface text-neutral-text',
      intent: 'neutral',
      variant: 'default',
    },
    {
      class: 'border-primary-border bg-primary-surface text-primary-text',
      intent: 'primary',
      variant: 'default',
    },
    {
      class: 'border-secondary-border bg-secondary-surface text-secondary-text',
      intent: 'secondary',
      variant: 'default',
    },
    {
      class: 'border-accent-border bg-accent-surface text-accent-text',
      intent: 'accent',
      variant: 'default',
    },
    /** subtle */
    {
      class: 'border-accent-border-subtle bg-accent-surface text-accent-text',
      intent: 'accent',
      variant: 'subtle',
    },
    {
      class: 'border-neutral-border-subtle bg-neutral-surface text-neutral-text',
      intent: 'neutral',
      variant: 'subtle',
    },
    {
      class: 'border-primary-border-subtle bg-primary-surface text-primary-text',
      intent: 'primary',
      variant: 'subtle',
    },
    {
      class: 'border-secondary-border-subtle bg-secondary-surface text-secondary-text',
      intent: 'secondary',
      variant: 'subtle',
    },
    {
      class: 'border-accent-border-subtle bg-accent-surface text-accent-text',
      intent: 'accent',
      variant: 'subtle',
    },
    /** strong */
    {
      class: 'border-neutral-border-strong bg-neutral-surface text-neutral-text',
      intent: 'neutral',
      variant: 'strong',
    },
    {
      class: 'border-primary-border-strong bg-primary-surface text-primary-text',
      intent: 'primary',
      variant: 'strong',
    },
    {
      class: 'border-secondary-border-strong bg-secondary-surface text-secondary-text',
      intent: 'secondary',
      variant: 'strong',
    },
    {
      class: 'border-accent-border-strong bg-accent-surface text-accent-text',
      intent: 'accent',
      variant: 'strong',
    },
    /** inverse */
    {
      class: 'border-neutral-border-inverse bg-neutral-surface-inverse text-neutral-text-inverse',
      intent: 'neutral',
      variant: 'inverse',
    },
    {
      class: 'border-primary-border-inverse bg-primary-surface-inverse text-primary-text-inverse',
      intent: 'primary',
      variant: 'inverse',
    },
    {
      class:
        'border-secondary-border-inverse bg-secondary-surface-inverse text-secondary-text-inverse',
      intent: 'secondary',
      variant: 'inverse',
    },
    {
      class: 'border-accent-border-inverse bg-accent-surface-inverse text-accent-text-inverse',
      intent: 'accent',
      variant: 'inverse',
    },
  ],
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<CardIntent, string>,
    size: {
      lg: 'p-4',
      md: 'p-2',
      sm: 'p-1',
    } satisfies Record<CardSize, string>,
    variant: {
      default: 'border',
      inverse: 'border',
      strong: 'border',
      subtle: 'border',
    } satisfies Record<CardVariant, string>,
  },
})

type CardCVAProps = VariantProps<typeof cardCVA>

export interface CardBaseProps {
  variant?: CardCVAProps['variant']
  intent?: CardCVAProps['intent']
  size?: CardCVAProps['size']
  ui?: Partial<UICardBaseSlots>
}

withDefaults(defineProps<CardBaseProps>(), {
  intent: 'primary',
  size: 'md',
  ui: undefined,
  variant: 'default',
})
</script>

<template>
  <div class="join join-vertical" :class="ui?.root">
    <div
      v-if="$slots.header"
      :class="cn('join-item', cardHeaderFooterCVA({ variant, intent, size }), ui?.header)"
    >
      <slot name="header" />
    </div>
    <div :class="cn('join-item', cardCVA({ variant, intent, size }), ui?.body)">
      <slot :class="cn(ui?.content)" />
    </div>
    <div
      v-if="$slots.footer"
      :class="cn('join-item', cardHeaderFooterCVA({ variant, intent, size }), ui?.footer)"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
