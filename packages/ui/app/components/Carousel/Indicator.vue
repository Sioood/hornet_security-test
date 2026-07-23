<script setup lang="ts">
import { Carousel as ArkCarousel, type CarouselIndicatorBaseProps } from '@ark-ui/vue/carousel'

import {
  carouselChromeKey,
  type CarouselIndicatorVariant,
  type CarouselIntent,
  type CarouselSize,
} from '~/utils/Components/Carousel/context'
import {
  carouselDotIndicatorCVA,
  carouselThumbnailIndicatorCVA,
} from '~/utils/Components/Carousel/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselIndicatorSlots {
  root?: ClassValue
}

export interface CarouselIndicatorProps extends CarouselIndicatorBaseProps {
  intent?: CarouselIntent
  size?: CarouselSize
  /** Dot or thumbnail styling. Thumbnails render slot content (e.g. `<NuxtImg>`). @default 'dot' */
  variant?: CarouselIndicatorVariant
  ui?: Partial<UICarouselIndicatorSlots>
}

const props = withDefaults(defineProps<CarouselIndicatorProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
  variant: undefined,
})

const attrs = useAttrs()
const chrome = inject(carouselChromeKey, null)

const intent = computed<CarouselIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<CarouselSize>(() => props.size ?? chrome?.size.value ?? 'md')
const variant = computed<CarouselIndicatorVariant>(
  () => props.variant ?? chrome?.indicatorVariant.value ?? 'dot',
)

const indicatorProps = computed(() => pick(props, ['asChild', 'index', 'readOnly']))

const indicatorAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselIndicatorSlots>
  }
  return rest
})

const indicatorClass = computed(() => {
  if (variant.value === 'thumbnail') {
    return cn(
      carouselThumbnailIndicatorCVA({ intent: intent.value, size: size.value }),
      props.ui?.root,
    )
  }
  return cn(carouselDotIndicatorCVA({ intent: intent.value }), props.ui?.root)
})

extendCompodiumMeta({
  defaultProps: {
    index: 0,
    variant: 'dot',
  },
})
</script>

<template>
  <ArkCarousel.Indicator v-bind="{ ...indicatorProps, ...indicatorAttrs }" :class="indicatorClass">
    <slot />
  </ArkCarousel.Indicator>
</template>
