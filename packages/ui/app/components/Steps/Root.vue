<script setup lang="ts">
import {
  Steps as ArkSteps,
  type StepsRootBaseProps,
  type StepsRootProviderBaseProps,
  type UseStepsReturn,
} from '@ark-ui/vue/steps'

import { stepsChromeKey, type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'
import { stepsRootCVA } from '~/utils/Components/Steps/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIStepsRootSlots {
  root?: ClassValue
}

/**
 * Steps (stepper/wizard) root component.
 *
 * Supports both Root (controlled/uncontrolled via `v-model:step`) and
 * RootProvider (pass a `useSteps()` return via `:value`) modes.
 *
 * Compose manually with sub-components:
 * - `<UIStepsList>` + `<UIStepsItem>` + `<UIStepsTrigger>` + `<UIStepsIndicator>` + `<UIStepsSeparator>`
 * - `<UIStepsContent>`
 * - `<UIStepsCompletedContent>`
 * - `<UIStepsNextTrigger>` / `<UIStepsPrevTrigger>`
 * - `<UIStepsProgress>`
 */
export interface StepsProps
  extends Omit<StepsRootBaseProps, 'step'>, Omit<StepsRootProviderBaseProps, 'value'> {
  /** Pass the return value of `useSteps()` to enable RootProvider mode. */
  value?: UseStepsReturn['value']
  intent?: StepsIntent
  size?: StepsSize
  ui?: Partial<UIStepsRootSlots>
}

const props = withDefaults(defineProps<StepsProps>(), {
  intent: 'neutral',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const step = defineModel<number>('step', { required: false })

const attrs = useAttrs()

const intent = toRef(props, 'intent')
const size = toRef(props, 'size')

const orientation = computed<'horizontal' | 'vertical'>(() => props.orientation ?? 'horizontal')

provide(stepsChromeKey, { intent, orientation, size })

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() => (isProvider.value ? ArkSteps.RootProvider : ArkSteps.Root))

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  return pick(props, [
    'asChild',
    'count',
    'defaultStep',
    'id',
    'ids',
    'isStepSkippable',
    'isStepValid',
    'linear',
    'orientation',
  ] as const)
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(
      stepsRootCVA({ intent: intent.value, size: size.value }),
      arkAttrs.value.class as ClassValue,
      props.ui?.root,
    ),
  }
  if (!isProvider.value && step.value !== undefined) {
    base.step = step.value
    base['onUpdate:step'] = (next: number) => {
      step.value = next
    }
  }
  return base
})

extendCompodiumMeta({
  defaultProps: {
    count: 3,
    intent: 'neutral',
    size: 'md',
  },
})
</script>

<template>
  <component :is="rootComponent" v-bind="rootBindings">
    <slot />
  </component>
</template>
