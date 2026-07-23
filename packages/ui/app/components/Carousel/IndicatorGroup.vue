<script setup lang="ts">
import { Carousel as ArkCarousel, type CarouselIndicatorGroupBaseProps } from '@ark-ui/vue/carousel'

import {
  carouselChromeKey,
  type CarouselIndicatorVariant,
} from '~/utils/Components/Carousel/context'
import { carouselIndicatorGroupCVA } from '~/utils/Components/Carousel/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselIndicatorGroupSlots {
  root?: ClassValue
}

export interface CarouselIndicatorGroupProps extends CarouselIndicatorGroupBaseProps {
  variant?: CarouselIndicatorVariant
  ui?: Partial<UICarouselIndicatorGroupSlots>
}

const props = withDefaults(defineProps<CarouselIndicatorGroupProps>(), {
  ui: undefined,
  variant: undefined,
})

const attrs = useAttrs()
const chrome = inject(carouselChromeKey, null)

const orientation = computed(() => chrome?.orientation.value ?? 'horizontal')
const variant = computed<CarouselIndicatorVariant>(
  () => props.variant ?? chrome?.indicatorVariant.value ?? 'dot',
)

const groupProps = computed(() => pick(props, ['asChild']))

const groupAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselIndicatorGroupSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkCarousel.IndicatorGroup
    v-bind="{ ...groupProps, ...groupAttrs }"
    :class="cn(carouselIndicatorGroupCVA({ orientation, variant }), ui?.root)"
  >
    <slot />
  </ArkCarousel.IndicatorGroup>
</template>
