<script setup lang="ts">
import { Carousel as ArkCarousel, type CarouselProgressTextBaseProps } from '@ark-ui/vue/carousel'

import {
  carouselChromeKey,
  type CarouselIntent,
  type CarouselSize,
} from '~/utils/Components/Carousel/context'
import { carouselProgressTextCVA } from '~/utils/Components/Carousel/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselProgressTextSlots {
  root?: ClassValue
}

export interface CarouselProgressTextProps extends CarouselProgressTextBaseProps {
  intent?: CarouselIntent
  size?: CarouselSize
  ui?: Partial<UICarouselProgressTextSlots>
}

const props = withDefaults(defineProps<CarouselProgressTextProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(carouselChromeKey, null)

const intent = computed<CarouselIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<CarouselSize>(() => props.size ?? chrome?.size.value ?? 'md')

const textProps = computed(() => pick(props, ['asChild']))

const textAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselProgressTextSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkCarousel.ProgressText
    v-bind="{ ...textProps, ...textAttrs }"
    :class="cn(carouselProgressTextCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkCarousel.ProgressText>
</template>
