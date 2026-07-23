<script setup lang="ts">
import {
  Carousel as ArkCarousel,
  type CarouselAutoplayIndicatorBaseProps,
} from '@ark-ui/vue/carousel'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselAutoplayIndicatorSlots {
  root?: ClassValue
}

export interface CarouselAutoplayIndicatorProps extends CarouselAutoplayIndicatorBaseProps {
  ui?: Partial<UICarouselAutoplayIndicatorSlots>
}

const props = withDefaults(defineProps<CarouselAutoplayIndicatorProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const indicatorProps = computed(() => pick(props, ['asChild', 'fallback']))

const indicatorAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselAutoplayIndicatorSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkCarousel.AutoplayIndicator
    v-bind="{ ...indicatorProps, ...indicatorAttrs }"
    :class="ui?.root"
  >
    <slot>
      <Icon name="tabler:player-pause" class="size-4 shrink-0" />
    </slot>
    <template #fallback>
      <slot name="fallback">
        <Icon name="tabler:player-play" class="size-4 shrink-0" />
      </slot>
    </template>
  </ArkCarousel.AutoplayIndicator>
</template>
