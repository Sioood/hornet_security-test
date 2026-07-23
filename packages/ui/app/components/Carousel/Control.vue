<script setup lang="ts">
import { Carousel as ArkCarousel, type CarouselControlBaseProps } from '@ark-ui/vue/carousel'

import { carouselChromeKey } from '~/utils/Components/Carousel/context'
import { carouselControlCVA } from '~/utils/Components/Carousel/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselControlSlots {
  root?: ClassValue
}

export interface CarouselControlProps extends CarouselControlBaseProps {
  ui?: Partial<UICarouselControlSlots>
}

const props = withDefaults(defineProps<CarouselControlProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(carouselChromeKey, null)

const orientation = computed(() => chrome?.orientation.value ?? 'horizontal')

const controlProps = computed(() => pick(props, ['asChild']))

const controlAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselControlSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkCarousel.Control
    v-bind="{ ...controlProps, ...controlAttrs }"
    :class="cn(carouselControlCVA({ orientation }), ui?.root)"
  >
    <slot />
  </ArkCarousel.Control>
</template>
