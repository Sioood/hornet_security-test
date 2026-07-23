<script setup lang="ts">
import {
  Accordion as ArkAccordion,
  type AccordionItemContentBaseProps,
} from '@ark-ui/vue/accordion'

import {
  accordionChromeKey,
  type AccordionIntent,
  type AccordionSize,
} from '~/utils/Components/Accordion/context'
import { accordionItemContentCVA } from '~/utils/Components/Accordion/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIAccordionItemContentSlots {
  root?: ClassValue
}

export interface AccordionItemContentProps extends AccordionItemContentBaseProps {
  intent?: AccordionIntent
  size?: AccordionSize
  ui?: Partial<UIAccordionItemContentSlots>
}

const props = withDefaults(defineProps<AccordionItemContentProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(accordionChromeKey, null)

const intent = computed<AccordionIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<AccordionSize>(() => props.size ?? chrome?.size.value ?? 'md')

const contentProps = computed(() => pick(props, ['asChild'] as const))

const contentAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIAccordionItemContentSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkAccordion.ItemContent
    v-bind="{ ...contentProps, ...contentAttrs }"
    :class="cn(accordionItemContentCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkAccordion.ItemContent>
</template>
