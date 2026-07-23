<script setup lang="ts">
import { Steps as ArkSteps, type StepsIndicatorBaseProps } from '@ark-ui/vue/steps'
import { useStepsItemContext } from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'
import { stepsIndicatorCVA } from '~/utils/Components/Steps/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsIndicatorSlots {
  root?: ClassValue
}

export interface StepsIndicatorProps extends StepsIndicatorBaseProps {
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsIndicatorSlots>
}

const props = withDefaults(defineProps<StepsIndicatorProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(stepsChromeKey, null)

const intent = computed<StepsIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<StepsSize>(() => props.size ?? chrome?.size.value ?? 'md')

const itemState = useStepsItemContext()

const indicatorProps = computed(() => pick(props, ['asChild'] as const))

const indicatorAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIStepsIndicatorSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkSteps.Indicator
    v-bind="{ ...indicatorProps, ...indicatorAttrs }"
    :class="
      cn(
        stepsIndicatorCVA({
          intent,
          size,
          status: itemState?.completed ? 'completed' : itemState?.current ? 'current' : 'pending',
        }),
        ui?.root,
      )
    "
  >
    <slot>
      <template v-if="itemState">
        <Icon v-if="itemState.completed" name="tabler:check" class="size-3.5 shrink-0" />
        <span v-else class="txt-label">{{ Number(itemState.index) + 1 }}</span>
      </template>
    </slot>
  </ArkSteps.Indicator>
</template>
