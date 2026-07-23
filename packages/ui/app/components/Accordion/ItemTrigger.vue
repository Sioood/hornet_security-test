<script setup lang="ts">
import {
  Accordion as ArkAccordion,
  type AccordionItemTriggerBaseProps,
} from '@ark-ui/vue/accordion'

import {
  accordionChromeKey,
  type AccordionIntent,
  type AccordionSize,
} from '~/utils/Components/Accordion/context'
import { accordionItemTriggerCVA } from '~/utils/Components/Accordion/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIAccordionItemTriggerSlots {
  root?: ClassValue
}

export interface AccordionItemTriggerProps extends AccordionItemTriggerBaseProps {
  intent?: AccordionIntent
  size?: AccordionSize
  ui?: Partial<UIAccordionItemTriggerSlots>
}

const props = withDefaults(defineProps<AccordionItemTriggerProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(accordionChromeKey, null)

const intent = computed<AccordionIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<AccordionSize>(() => props.size ?? chrome?.size.value ?? 'md')

const triggerProps = computed(() => pick(props, ['asChild'] as const))

const triggerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIAccordionItemTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkAccordion.ItemTrigger
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    type="button"
    :class="cn(accordionItemTriggerCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkAccordion.ItemTrigger>
</template>
