<script setup lang="ts">
import { Steps as ArkSteps, type StepsTriggerBaseProps } from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsTriggerSlots {
  root?: ClassValue
}

export interface StepsTriggerProps extends StepsTriggerBaseProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsTriggerSlots>
}

const props = withDefaults(defineProps<StepsTriggerProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(stepsChromeKey, null)

const intent = computed<StepsIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<StepsSize>(() => props.size ?? chrome?.size.value ?? 'md')

const triggerProps = computed(() => pick(props, ['asChild'] as const))

const triggerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIStepsTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkSteps.Trigger
    v-if="triggerProps.asChild"
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    :class="ui?.root"
  >
    <slot />
  </ArkSteps.Trigger>
  <ArkSteps.Trigger v-else v-bind="triggerAttrs" as-child :class="ui?.root">
    <UIButton :variant="'ghost'" :intent :size>
      <slot />
    </UIButton>
  </ArkSteps.Trigger>
</template>
