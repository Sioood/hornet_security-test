<script setup lang="ts">
import { Steps as ArkSteps, type StepsPrevTriggerBaseProps } from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsPrevTriggerSlots {
  root?: ClassValue
}

export interface StepsPrevTriggerProps extends StepsPrevTriggerBaseProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsPrevTriggerSlots>
}

const props = withDefaults(defineProps<StepsPrevTriggerProps>(), {
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
    ui?: Partial<UIStepsPrevTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkSteps.PrevTrigger
    v-if="triggerProps.asChild"
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    :class="ui?.root"
  >
    <slot>
      <Icon name="tabler:chevron-left" class="size-4 shrink-0" />
      <span>Previous</span>
    </slot>
  </ArkSteps.PrevTrigger>
  <ArkSteps.PrevTrigger v-else v-bind="triggerAttrs" as-child :class="ui?.root">
    <UIButton :variant="'subtle'" :intent :size>
      <slot>
        <Icon name="tabler:chevron-left" class="size-4 shrink-0" />
        <span>Previous</span>
      </slot>
    </UIButton>
  </ArkSteps.PrevTrigger>
</template>
