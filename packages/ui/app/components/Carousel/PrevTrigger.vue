<script setup lang="ts">
import { Carousel as ArkCarousel, type CarouselPrevTriggerBaseProps } from '@ark-ui/vue/carousel'

import {
  carouselChromeKey,
  type CarouselIntent,
  type CarouselSize,
} from '~/utils/Components/Carousel/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselPrevTriggerSlots {
  root?: ClassValue
}

export interface CarouselPrevTriggerProps extends CarouselPrevTriggerBaseProps {
  intent?: CarouselIntent
  size?: CarouselSize
  ui?: Partial<UICarouselPrevTriggerSlots>
}

const props = withDefaults(defineProps<CarouselPrevTriggerProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(carouselChromeKey, null)

const intent = computed<CarouselIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<CarouselSize>(() => props.size ?? chrome?.size.value ?? 'md')
const orientation = computed(() => chrome?.orientation.value ?? 'horizontal')

const prevIcon = computed(() =>
  orientation.value === 'vertical' ? 'tabler:chevron-up' : 'tabler:chevron-left',
)

const triggerProps = computed(() => pick(props, ['asChild'] as const))

const triggerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselPrevTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkCarousel.PrevTrigger
    v-if="triggerProps.asChild"
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    :class="ui?.root"
  >
    <slot>
      <Icon :name="prevIcon" class="size-4 shrink-0" />
    </slot>
  </ArkCarousel.PrevTrigger>
  <ArkCarousel.PrevTrigger v-else v-bind="triggerAttrs" as-child :class="ui?.root">
    <UIButton variant="subtle" :intent :size>
      <slot>
        <Icon :name="prevIcon" class="size-4 shrink-0" />
      </slot>
    </UIButton>
  </ArkCarousel.PrevTrigger>
</template>
