<script setup lang="ts">
import { Carousel as ArkCarousel, type CarouselItemGroupBaseProps } from '@ark-ui/vue/carousel'

import { carouselItemGroupCVA } from '~/utils/Components/Carousel/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselItemGroupSlots {
  root?: ClassValue
}

export interface CarouselItemGroupProps extends CarouselItemGroupBaseProps {
  ui?: Partial<UICarouselItemGroupSlots>
}

const props = withDefaults(defineProps<CarouselItemGroupProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const groupProps = computed(() => pick(props, ['asChild']))

const groupAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselItemGroupSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkCarousel.ItemGroup
    v-bind="{ ...groupProps, ...groupAttrs }"
    :class="cn(carouselItemGroupCVA(), ui?.root)"
  >
    <slot />
  </ArkCarousel.ItemGroup>
</template>
