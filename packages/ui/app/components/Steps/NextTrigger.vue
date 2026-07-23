<script setup lang="ts">
import { Steps as ArkSteps, type StepsNextTriggerBaseProps } from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsNextTriggerSlots {
  root?: ClassValue
}

export interface StepsNextTriggerProps extends StepsNextTriggerBaseProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsNextTriggerSlots>
}

const props = withDefaults(defineProps<StepsNextTriggerProps>(), {
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
    ui?: Partial<UIStepsNextTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkSteps.NextTrigger
    v-if="triggerProps.asChild"
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    :class="ui?.root"
  >
    <slot>
      <span>Next</span>
      <Icon name="tabler:chevron-right" class="size-4 shrink-0" />
    </slot>
  </ArkSteps.NextTrigger>
  <ArkSteps.NextTrigger v-else v-bind="triggerAttrs" as-child :class="ui?.root">
    <UIButton :variant="'default'" :intent :size>
      <slot>
        <span>Next</span>
        <Icon name="tabler:chevron-right" class="size-4 shrink-0" />
      </slot>
    </UIButton>
  </ArkSteps.NextTrigger>
</template>
