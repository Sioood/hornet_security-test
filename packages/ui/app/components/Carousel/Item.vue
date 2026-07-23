<script setup lang="ts">
import { Carousel as ArkCarousel, type CarouselItemBaseProps } from '@ark-ui/vue/carousel'

import { carouselChromeKey, type CarouselSize } from '~/utils/Components/Carousel/context'
import { carouselItemCVA } from '~/utils/Components/Carousel/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselItemSlots {
  root?: ClassValue
}

export interface CarouselItemProps extends CarouselItemBaseProps {
  size?: CarouselSize
  ui?: Partial<UICarouselItemSlots>
}

const props = withDefaults(defineProps<CarouselItemProps>(), {
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(carouselChromeKey, null)

const size = computed<CarouselSize>(() => props.size ?? chrome?.size.value ?? 'md')

const itemProps = computed(() => pick(props, ['asChild', 'index', 'snapAlign']))

const itemAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselItemSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {
    index: 0,
  },
})
</script>

<template>
  <ArkCarousel.Item
    v-bind="{ ...itemProps, ...itemAttrs }"
    :class="cn(carouselItemCVA({ size }), ui?.root)"
  >
    <slot />
  </ArkCarousel.Item>
</template>
