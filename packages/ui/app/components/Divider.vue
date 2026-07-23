<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

import type { ClassValue } from 'vue'

type DividerIntent = 'neutral' | 'primary' | 'secondary' | 'accent'
type DividerSize = 'sm' | 'md' | 'lg'
type DividerOrientation = 'horizontal' | 'vertical'

const dividerCVA = cva('', {
  compoundVariants: [
    { class: 'h-0.25', orientation: 'horizontal', size: 'sm' },
    { class: 'h-0.5', orientation: 'horizontal', size: 'md' },
    { class: 'h-0.75', orientation: 'horizontal', size: 'lg' },
    { class: 'w-0.25', orientation: 'vertical', size: 'sm' },
    { class: 'w-0.5', orientation: 'vertical', size: 'md' },
    { class: 'w-0.75', orientation: 'vertical', size: 'lg' },
  ],
  variants: {
    intent: {
      accent: 'bg-accent-border-subtle',
      neutral: 'bg-neutral-border-subtle',
      primary: 'bg-primary-border-subtle',
      secondary: 'bg-secondary-border-subtle',
    } satisfies Record<DividerIntent, string>,
    orientation: {
      horizontal: 'w-full min-w-8',
      vertical: 'h-full min-h-8',
    } satisfies Record<DividerOrientation, string>,
    size: {
      lg: '',
      md: '',
      sm: '',
    } satisfies Record<DividerSize, string>,
  },
})

type DividerCVAProps = VariantProps<typeof dividerCVA>

interface UIDividerSlots {
  root?: ClassValue
}

interface DividerProps {
  intent?: DividerCVAProps['intent']
  orientation?: DividerCVAProps['orientation']
  size?: DividerCVAProps['size']
  ui?: Partial<UIDividerSlots>
}

withDefaults(defineProps<DividerProps>(), {
  intent: 'primary',
  orientation: 'horizontal',
  size: 'md',
  ui: undefined,
})
</script>

<template>
  <span :class="cn(dividerCVA({ intent, size, orientation }), ui?.root)" />
</template>
