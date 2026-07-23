<script setup lang="ts">
import { Steps as ArkSteps, type StepsItemBaseProps } from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'
import { stepsItemCVA } from '~/utils/Components/Steps/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsItemSlots {
  root?: ClassValue
}

export interface StepsItemProps extends StepsItemBaseProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsItemSlots>
}

const props = withDefaults(defineProps<StepsItemProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(stepsChromeKey, null)

const intent = computed<StepsIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<StepsSize>(() => props.size ?? chrome?.size.value ?? 'md')

const itemProps = computed(() => pick(props, ['asChild', 'index'] as const))

const itemAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIStepsItemSlots>
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
  <ArkSteps.Item
    v-bind="{ ...itemProps, ...itemAttrs }"
    :class="cn(stepsItemCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkSteps.Item>
</template>
