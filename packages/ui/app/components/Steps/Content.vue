<script setup lang="ts">
import { Steps as ArkSteps, type StepsContentBaseProps } from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'
import { stepsContentCVA } from '~/utils/Components/Steps/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsContentSlots {
  root?: ClassValue
}

export interface StepsContentProps extends StepsContentBaseProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsContentSlots>
}

const props = withDefaults(defineProps<StepsContentProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(stepsChromeKey, null)

const intent = computed<StepsIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<StepsSize>(() => props.size ?? chrome?.size.value ?? 'md')

const contentProps = computed(() => pick(props, ['asChild', 'index'] as const))

const contentAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIStepsContentSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {
    index: 0,
  },
})
</script>

<template>
  <ArkSteps.Content
    v-bind="{ ...contentProps, ...contentAttrs }"
    :class="cn(stepsContentCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkSteps.Content>
</template>
