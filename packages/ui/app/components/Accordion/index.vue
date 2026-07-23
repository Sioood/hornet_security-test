<script setup lang="ts">
import {
  Accordion as ArkAccordion,
  type AccordionRootBaseProps,
  type AccordionRootProviderBaseProps,
  type UseAccordionReturn,
} from '@ark-ui/vue/accordion'

import {
  accordionChromeKey,
  type AccordionIntent,
  type AccordionSize,
} from '~/utils/Components/Accordion/context'
import { accordionRootCVA } from '~/utils/Components/Accordion/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIAccordionSlots {
  root?: ClassValue
}

/** Forwards Ark `Accordion.Root` props, `v-model` (`modelValue`), events, and render strategy. */
export interface AccordionProps
  extends
    Omit<AccordionRootBaseProps, 'modelValue'>,
    Omit<AccordionRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useAccordion()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseAccordionReturn['value']
  intent?: AccordionIntent
  size?: AccordionSize
  ui?: Partial<UIAccordionSlots>
}

const props = withDefaults(defineProps<AccordionProps>(), {
  intent: 'neutral',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const modelValue = defineModel<string[]>({ required: false })

const attrs = useAttrs()

const intent = toRef(props, 'intent')
const size = toRef(props, 'size')

provide(accordionChromeKey, { intent, size })

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkAccordion.RootProvider : ArkAccordion.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'lazyMount', 'unmountOnExit', 'value'] as const)
  }
  return pick(props, [
    'asChild',
    'collapsible',
    'defaultValue',
    'disabled',
    'id',
    'ids',
    'lazyMount',
    'multiple',
    'orientation',
    'unmountOnExit',
  ] as const)
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(
      accordionRootCVA({ intent: intent.value, size: size.value }),
      arkAttrs.value.class as ClassValue,
      props.ui?.root,
    ),
  }
  if (!isProvider.value && modelValue.value !== undefined) {
    base.modelValue = modelValue.value
    base['onUpdate:modelValue'] = (next: string[]) => {
      modelValue.value = next
    }
  }
  return base
})

extendCompodiumMeta({
  defaultProps: {
    collapsible: true,
    defaultValue: ['one'],
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
