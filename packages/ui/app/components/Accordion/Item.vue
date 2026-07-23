<script setup lang="ts">
import { Accordion as ArkAccordion, type AccordionItemBaseProps } from '@ark-ui/vue/accordion'

import {
  accordionChromeKey,
  type AccordionIntent,
  type AccordionSize,
} from '~/utils/Components/Accordion/context'
import { accordionItemCVA } from '~/utils/Components/Accordion/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIAccordionItemSlots {
  root?: ClassValue
}

export interface AccordionItemProps extends AccordionItemBaseProps {
  intent?: AccordionIntent
  size?: AccordionSize
  ui?: Partial<UIAccordionItemSlots>
}

const props = withDefaults(defineProps<AccordionItemProps>(), {
  disabled: undefined,
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(accordionChromeKey, null)

const intent = computed<AccordionIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<AccordionSize>(() => props.size ?? chrome?.size.value ?? 'md')

const itemProps = computed(() => pick(props, ['asChild', 'disabled', 'value'] as const))

const itemAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIAccordionItemSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {
    value: 'one',
  },
})
</script>

<template>
  <ArkAccordion.Item
    v-bind="{ ...itemProps, ...itemAttrs }"
    :class="cn(accordionItemCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkAccordion.Item>
</template>
