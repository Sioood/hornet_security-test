<script setup lang="ts">
import { Steps as ArkSteps, type StepsCompletedContentBaseProps } from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'
import { stepsCompletedContentCVA } from '~/utils/Components/Steps/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsCompletedContentSlots {
  root?: ClassValue
}

export interface StepsCompletedContentProps extends StepsCompletedContentBaseProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsCompletedContentSlots>
}

const props = withDefaults(defineProps<StepsCompletedContentProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(stepsChromeKey, null)

const intent = computed<StepsIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<StepsSize>(() => props.size ?? chrome?.size.value ?? 'md')

const contentProps = computed(() => pick(props, ['asChild'] as const))

const contentAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIStepsCompletedContentSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkSteps.CompletedContent
    v-bind="{ ...contentProps, ...contentAttrs }"
    :class="cn(stepsCompletedContentCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkSteps.CompletedContent>
</template>
