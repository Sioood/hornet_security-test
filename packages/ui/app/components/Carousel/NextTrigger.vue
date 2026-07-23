<script setup lang="ts">
import { Carousel as ArkCarousel, type CarouselNextTriggerBaseProps } from '@ark-ui/vue/carousel'

import {
  carouselChromeKey,
  type CarouselIntent,
  type CarouselSize,
} from '~/utils/Components/Carousel/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselNextTriggerSlots {
  root?: ClassValue
}

export interface CarouselNextTriggerProps extends CarouselNextTriggerBaseProps {
  intent?: CarouselIntent
  size?: CarouselSize
  ui?: Partial<UICarouselNextTriggerSlots>
}

const props = withDefaults(defineProps<CarouselNextTriggerProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(carouselChromeKey, null)

const intent = computed<CarouselIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<CarouselSize>(() => props.size ?? chrome?.size.value ?? 'md')
const orientation = computed(() => chrome?.orientation.value ?? 'horizontal')

const nextIcon = computed(() =>
  orientation.value === 'vertical' ? 'tabler:chevron-down' : 'tabler:chevron-right',
)

const triggerProps = computed(() => pick(props, ['asChild']))

const triggerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselNextTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkCarousel.NextTrigger
    v-if="triggerProps.asChild"
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    :class="ui?.root"
  >
    <slot>
      <Icon :name="nextIcon" class="size-4 shrink-0" />
    </slot>
  </ArkCarousel.NextTrigger>
  <ArkCarousel.NextTrigger v-else v-bind="triggerAttrs" as-child :class="ui?.root">
    <UIButton variant="subtle" :intent :size>
      <slot>
        <Icon :name="nextIcon" class="size-4 shrink-0" />
      </slot>
    </UIButton>
  </ArkCarousel.NextTrigger>
</template>
