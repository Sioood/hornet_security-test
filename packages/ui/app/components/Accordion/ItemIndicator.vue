<script setup lang="ts">
import {
  Accordion as ArkAccordion,
  type AccordionItemIndicatorBaseProps,
} from '@ark-ui/vue/accordion'

import {
  accordionChromeKey,
  type AccordionIntent,
  type AccordionSize,
} from '~/utils/Components/Accordion/context'
import { accordionItemIndicatorCVA } from '~/utils/Components/Accordion/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIAccordionItemIndicatorSlots {
  root?: ClassValue
}

export interface AccordionItemIndicatorProps extends AccordionItemIndicatorBaseProps {
  intent?: AccordionIntent
  size?: AccordionSize
  ui?: Partial<UIAccordionItemIndicatorSlots>
}

const props = withDefaults(defineProps<AccordionItemIndicatorProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(accordionChromeKey, null)

const intent = computed<AccordionIntent>(() => props.intent ?? chrome?.intent.value ?? 'neutral')
const size = computed<AccordionSize>(() => props.size ?? chrome?.size.value ?? 'md')

const indicatorProps = computed(() => pick(props, ['asChild'] as const))

const indicatorAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIAccordionItemIndicatorSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkAccordion.ItemIndicator
    v-bind="{ ...indicatorProps, ...indicatorAttrs }"
    :class="cn(accordionItemIndicatorCVA({ intent, size }), ui?.root)"
  >
    <slot>
      <Icon class="size-full" name="tabler:chevron-down" />
    </slot>
  </ArkAccordion.ItemIndicator>
</template>
