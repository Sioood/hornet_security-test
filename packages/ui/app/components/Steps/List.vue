<script setup lang="ts">
import { Steps as ArkSteps, type StepsListBaseProps } from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'
import { stepsListCVA } from '~/utils/Components/Steps/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsListSlots {
  root?: ClassValue
}

export interface StepsListProps extends StepsListBaseProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsListSlots>
}

const props = withDefaults(defineProps<StepsListProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(stepsChromeKey, null)

const intent = computed<StepsIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<StepsSize>(() => props.size ?? chrome?.size.value ?? 'md')

const listProps = computed(() => pick(props, ['asChild'] as const))

const listAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIStepsListSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkSteps.List
    v-bind="{ ...listProps, ...listAttrs }"
    :class="cn(stepsListCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkSteps.List>
</template>
