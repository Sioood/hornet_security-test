<script setup lang="ts">
import {
  Carousel as ArkCarousel,
  type CarouselAutoplayTriggerBaseProps,
} from '@ark-ui/vue/carousel'

import {
  carouselChromeKey,
  type CarouselIntent,
  type CarouselSize,
} from '~/utils/Components/Carousel/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselAutoplayTriggerSlots {
  root?: ClassValue
}

export interface CarouselAutoplayTriggerProps extends CarouselAutoplayTriggerBaseProps {
  intent?: CarouselIntent
  size?: CarouselSize
  ui?: Partial<UICarouselAutoplayTriggerSlots>
}

const props = withDefaults(defineProps<CarouselAutoplayTriggerProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(carouselChromeKey, null)

const intent = computed<CarouselIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<CarouselSize>(() => props.size ?? chrome?.size.value ?? 'md')

const triggerProps = computed(() => pick(props, ['asChild']))

const triggerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UICarouselAutoplayTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkCarousel.AutoplayTrigger
    v-if="triggerProps.asChild"
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    :class="ui?.root"
  >
    <slot>
      <Icon name="tabler:player-play" class="size-4 shrink-0" />
    </slot>
  </ArkCarousel.AutoplayTrigger>
  <ArkCarousel.AutoplayTrigger v-else v-bind="triggerAttrs" as-child :class="ui?.root">
    <UIButton variant="subtle" :intent :size>
      <slot>
        <Icon name="tabler:player-play" class="size-4 shrink-0" />
      </slot>
    </UIButton>
  </ArkCarousel.AutoplayTrigger>
</template>
