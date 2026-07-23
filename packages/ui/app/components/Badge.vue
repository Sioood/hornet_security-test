<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

import type { UseComponentIconsProps } from '@/composables/useComponentIcons'
import type { ClassValue } from 'vue'

type BadgeIntent =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'gray'
type BadgeSize = 'sm' | 'md' | 'lg'
type BadgeVariant = 'default' | 'subtle'

const badgeCVA = cva('flex w-fit items-center justify-center', {
  variants: {
    intent: {
      accent: 'border-accent-border bg-accent-surface',
      blue: 'border-blue-border bg-blue-surface',
      error: 'border-error-border bg-error-surface',
      gray: 'border-neutral-border bg-neutral-surface',
      green: 'border-green-border bg-green-surface',
      info: 'border-info-border bg-info-surface',
      neutral: 'border-neutral-border bg-neutral-surface',
      orange: 'border-orange-border bg-orange-surface',
      pink: 'border-pink-border bg-pink-surface',
      primary: 'border-primary-border bg-primary-surface',
      purple: 'border-purple-border bg-purple-surface',
      red: 'border-red-border bg-red-surface',
      secondary: 'border-secondary-border bg-secondary-surface',
      success: 'border-success-border bg-success-surface',
      warning: 'border-warning-border bg-warning-surface',
      yellow: 'border-yellow-border bg-yellow-surface',
    } satisfies Record<BadgeIntent, string>,
    size: {
      lg: 'gap-1.5 rounded-xs border p-1.5',
      md: 'gap-1 rounded-xs border p-1',
      sm: 'gap-0.5 rounded-xs border p-0.5',
    } satisfies Record<BadgeSize, string>,
    variant: {
      default: '',
      subtle: 'border-none',
    } satisfies Record<BadgeVariant, string>,
  },
})

type BadgeCVAProps = VariantProps<typeof badgeCVA>

const badgeIconCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-icon',
      blue: 'text-blue-icon',
      error: 'text-error-icon',
      gray: 'text-neutral-icon',
      green: 'text-green-icon',
      info: 'text-info-icon',
      neutral: 'text-neutral-icon',
      orange: 'text-orange-icon',
      pink: 'text-pink-icon',
      primary: 'text-primary-icon',
      purple: 'text-purple-icon',
      red: 'text-red-icon',
      secondary: 'text-secondary-icon',
      success: 'text-success-icon',
      warning: 'text-warning-icon',
      yellow: 'text-yellow-icon',
    } satisfies Record<BadgeIntent, string>,
    size: {
      lg: 'size-4',
      md: 'size-3',
      sm: 'size-2.5',
    } satisfies Record<BadgeSize, string>,
  },
})

const badgeLabelCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      blue: 'text-blue-text',
      error: 'text-error-text',
      gray: 'text-neutral-text',
      green: 'text-green-text',
      info: 'text-info-text',
      neutral: 'text-neutral-text',
      orange: 'text-orange-text',
      pink: 'text-pink-text',
      primary: 'text-primary-text',
      purple: 'text-purple-text',
      red: 'text-red-text',
      secondary: 'text-secondary-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
      yellow: 'text-yellow-text',
    } satisfies Record<BadgeIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-caption',
      sm: 'txt-small',
    } satisfies Record<BadgeSize, string>,
  },
})

interface UIBadgeSlots {
  root?: ClassValue
  label?: ClassValue
  icon?: ClassValue
}

interface BadgeProps extends UseComponentIconsProps {
  intent?: BadgeCVAProps['intent']
  label?: string
  size?: BadgeCVAProps['size']
  variant?: BadgeCVAProps['variant']
  ui?: Partial<UIBadgeSlots>
}

const props = withDefaults(defineProps<BadgeProps>(), {
  intent: 'primary',
  label: '',
  size: 'md',
  ui: undefined,
  variant: 'default',
})

const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(() => props)

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    label: 'Badge',
    leadingIcon: 'tabler:badge',
    size: 'md',
    ui: undefined,
  },
})
</script>

<template>
  <div :class="cn(badgeCVA({ intent, size, variant }), ui?.root)">
    <Icon
      v-if="isLeading && leadingIconName"
      :name="leadingIconName"
      :class="cn(badgeIconCVA({ intent, size }), ui?.icon)"
    />
    <slot>
      <span :class="cn(badgeLabelCVA({ intent, size }), ui?.label)">
        {{ $te(label) ? $t(label) : label }}
      </span>
    </slot>
    <Icon
      v-if="isTrailing && trailingIconName"
      :name="trailingIconName"
      :class="cn(badgeIconCVA({ intent, size }), ui?.icon)"
    />
  </div>
</template>
