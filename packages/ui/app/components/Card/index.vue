<script setup lang="ts">
import { cva } from 'class-variance-authority'

import type { CardBaseProps } from './Base.vue'
import type {
  CardIntent,
  CardSize,
  UICardBaseSlots,
  UICardSlots,
} from '~/utils/Components/Card/context'

const CardBodyHeaderCVA = cva('flex w-full items-center justify-between font-mono uppercase', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } as const satisfies Record<CardIntent, string>,
    size: {
      lg: 'txt-base mt-3 mr-4 mb-2 min-w-60 gap-3',
      md: 'txt-caption mt-2 mr-3 mb-1 min-w-60 gap-2',
      sm: 'txt-small mt-1 mr-2 mb-0.5 min-w-60 gap-1',
    } as const satisfies Record<CardSize, string>,
  },
})

const CardIconCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } as const satisfies Record<CardIntent, string>,
    size: {
      lg: 'size-8',
      md: 'size-6',
      sm: 'size-4',
    } as const satisfies Record<CardSize, string>,
  },
})

const CardBodyCVA = cva('flex flex-col', {
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } as const satisfies Record<CardIntent, string>,
    size: {
      lg: 'gap-6 p-2',
      md: 'gap-4 p-2',
      sm: 'gap-2 p-2',
    } as const satisfies Record<CardSize, string>,
  },
})

const CardBodyTitleDescriptionWrapperCVA = cva('flex flex-col', {
  variants: {
    size: {
      lg: 'gap-2',
      md: 'gap-1',
      sm: 'gap-0.5',
    } as const satisfies Record<CardSize, string>,
  },
})

const CardBodyTitleCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } as const satisfies Record<CardIntent, string>,
    size: {
      lg: 'txt-h3',
      md: 'txt-h4',
      sm: 'txt-h5',
    } as const satisfies Record<CardSize, string>,
  },
})

const CardBodyDescriptionCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } as const satisfies Record<CardIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-base',
      sm: 'txt-caption',
    } as const satisfies Record<CardSize, string>,
  },
})

export interface CardProps extends Omit<CardBaseProps, 'ui'>, UseComponentIconsProps {
  subtitle?: string
  tag?: string
  title?: string
  description?: string
  cardBaseUi?: Partial<UICardBaseSlots>
  elementIntent?: CardIntent
  ui?: UICardSlots
}

const props = withDefaults(defineProps<CardProps>(), {
  cardBaseUi: undefined,
  description: undefined,
  elementIntent: 'accent',
  intent: 'neutral',
  size: 'md',
  subtitle: undefined,
  tag: undefined,
  title: undefined,
  ui: undefined,
})

const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const cardBaseProps = computed(() => ({
  ...pick(props, ['intent', 'variant', 'size']),
  ui: { ...props.cardBaseUi, body: cn('relative', props.cardBaseUi?.body) },
}))
</script>

<template>
  <UICardBase v-bind="cardBaseProps">
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <div :class="cn(CardBodyCVA({ intent, size }), ui?.content)">
      <UIBadge
        v-if="tag"
        :label="tag"
        :ui="{ root: 'absolute top-0 right-0' }"
        variant="subtle"
        :intent="elementIntent"
      />

      <div
        v-if="subtitle || leadingIconName || trailingIconName"
        :class="cn(CardBodyHeaderCVA({ intent, size }))"
      >
        <Icon
          v-if="isLeading && leadingIconName"
          :name="leadingIconName"
          :class="cn(CardIconCVA({ intent: elementIntent, size }))"
        />
        <span class="flex-1">{{ subtitle }}</span>
        <Icon
          v-if="isTrailing && trailingIconName"
          :name="trailingIconName"
          :class="cn(CardIconCVA({ intent: elementIntent, size }))"
        />
      </div>

      <div
        v-if="title || description"
        :class="cn(CardBodyTitleDescriptionWrapperCVA({ size }), ui?.bodyTitleDescriptionWrapper)"
      >
        <h3 v-if="title" :class="cn(CardBodyTitleCVA({ intent, size }), ui?.bodyTitle)">
          {{ $te(title) ? $t(title) : title }}
        </h3>
        <p
          v-if="description"
          :class="cn(CardBodyDescriptionCVA({ intent, size }), ui?.bodyDescription)"
        >
          {{ $te(description) ? $t(description) : description }}
        </p>
      </div>

      <slot />
    </div>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UICardBase>
</template>
