<script setup lang="ts">
import { Steps as ArkSteps, type StepsSeparatorBaseProps } from '@ark-ui/vue/steps'
import { useStepsItemContext } from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'
import { stepsSeparatorCVA } from '~/utils/Components/Steps/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsSeparatorSlots {
  root?: ClassValue
}

export interface StepsSeparatorProps extends StepsSeparatorBaseProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsSeparatorSlots>
}

const props = withDefaults(defineProps<StepsSeparatorProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(stepsChromeKey, null)

const itemState = useStepsItemContext()

const intent = computed<StepsIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<StepsSize>(() => props.size ?? chrome?.size.value ?? 'md')

const orientation = computed<'horizontal' | 'vertical'>(
  () => chrome?.orientation.value ?? 'horizontal',
)

const completed = computed<boolean>(() => itemState?.completed ?? false)

const separatorProps = computed(() => pick(props, ['asChild'] as const))

const separatorAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIStepsSeparatorSlots>
  }
  // data-complete is set by zag-js via ArkSteps.Separator —
  // do NOT bind it manually to avoid overriding with undefined.
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkSteps.Separator
    v-bind="{ ...separatorProps, ...separatorAttrs }"
    :class="cn(stepsSeparatorCVA({ intent, size, orientation, completed }), ui?.root)"
  >
    <slot />
  </ArkSteps.Separator>
</template>
