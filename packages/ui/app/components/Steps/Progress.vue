<script setup lang="ts">
import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsProgressSlots {
  root?: ClassValue
}

export interface StepsProgressProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsProgressSlots>
}

const props = withDefaults(defineProps<StepsProgressProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(stepsChromeKey, null)

const intent = computed<StepsIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<StepsSize>(() => props.size ?? chrome?.size.value ?? 'md')

const progressAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIStepsProgressSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <UIStepsContext v-slot="{ percent }">
    <UIProgress
      v-bind="{ ...progressAttrs, 'data-part': 'progress' }"
      :model-value="percent"
      :intent
      :size
      :ui="{
        root: cn('grid-cols-1 gap-0 h-auto', ui?.root),
        label: 'hidden',
        valueText: 'hidden',
        track: 'col-span-full',
        range: 'transition-all duration-300',
      }"
    >
      <slot />
    </UIProgress>
  </UIStepsContext>
</template>
