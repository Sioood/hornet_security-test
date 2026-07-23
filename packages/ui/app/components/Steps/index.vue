<script setup lang="ts">
import {
  type StepsRootBaseProps,
  type StepsRootProviderBaseProps,
  type UseStepsReturn,
} from '@ark-ui/vue/steps'

import { type StepsIntent, type StepsSize } from '~/utils/Components/Steps/context'

import type { UIStepsRootSlots } from './Root.vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

export interface UIStepItem {
  title?: string
  description?: string
}

/**
 * High-level Steps component.
 *
 * Automates the rendering of:
 * - `<UIStepsList>` with `<UIStepsItem>`, `<UIStepsIndicator>`, `<UIStepsTrigger>`, `<UIStepsSeparator>`
 * - `<UIStepsProgress>` (optional)
 * - `<UIStepsPrevTrigger>` and `<UIStepsNextTrigger>` (optional)
 *
 * You only need to provide the `<UIStepsContent>` manually in the slot.
 *
 * For full control, use `<UIStepsRoot>` instead.
 */
export interface UIStepsProps
  extends Omit<StepsRootBaseProps, 'step'>, Omit<StepsRootProviderBaseProps, 'value'> {
  /** Pass the return value of `useSteps()` to enable RootProvider mode. */
  value?: UseStepsReturn['value']
  /** Array of step objects or strings for titles. Used to auto-generate the step list. */
  items?: (UIStepItem | string)[]
  /** Intent of the steps. @default 'neutral' */
  intent?: StepsIntent
  /** Size of the steps. @default 'md' */
  size?: StepsSize
  /** Whether to show the progress bar. @default false */
  showProgress?: boolean
  /** Whether to show the navigation buttons (Prev/Next). @default true */
  showTriggers?: boolean
  ui?: Partial<UIStepsRootSlots>
}

const props = withDefaults(defineProps<UIStepsProps>(), {
  intent: 'neutral',
  items: () => [],
  showProgress: false,
  showTriggers: true,
  size: 'md',
  ui: undefined,
  value: undefined,
})

const step = defineModel<number>('step', { required: false })

const normalizedItems = computed(() =>
  props.items.map((item) => (typeof item === 'string' ? { title: item } : item)),
)

const count = computed(
  () =>
    props.count ?? (normalizedItems.value.length > 0 ? normalizedItems.value.length : undefined),
)

const rootProps = computed(() => {
  const { items: _, showProgress: __, showTriggers: ___, ...rest } = props
  return rest
})

extendCompodiumMeta({
  defaultProps: {
    intent: 'neutral',
    showTriggers: true,
    size: 'md',
  },
})
</script>

<template>
  <UIStepsRoot v-bind="{ ...rootProps, ...attrs }" v-model:step="step" :count="count">
    <UIStepsProgress v-if="showProgress" />

    <UIStepsList v-if="normalizedItems.length > 0">
      <UIStepsItem v-for="(item, index) in normalizedItems" :key="index" :index="index">
        <UIStepsIndicator />
        <UIStepsTrigger v-if="item.title">
          {{ item.title }}
        </UIStepsTrigger>
        <UIStepsSeparator v-if="index < normalizedItems.length - 1" />
      </UIStepsItem>
    </UIStepsList>

    <slot />

    <div v-if="showTriggers" class="flex justify-between">
      <UIStepsPrevTrigger />
      <UIStepsNextTrigger />
    </div>
  </UIStepsRoot>
</template>
