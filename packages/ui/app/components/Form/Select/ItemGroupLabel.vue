<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import {
  selectChromeKey,
  type SelectIntent,
  type SelectSize,
} from '~/utils/Components/Form/Select/context'
import { selectItemGroupLabelCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectItemGroupLabelProps {
  intent?: SelectIntent
  size?: SelectSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<SelectItemGroupLabelProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(selectChromeKey, null)
const attrs = useAttrs()

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const labelAttrs = computed(() => {
  const {
    intent: _intent,
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    intent?: SelectIntent
    size?: SelectSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkSelect.ItemGroupLabel
    v-bind="labelAttrs"
    :class="cn(selectItemGroupLabelCVA({ intent, size }), labelAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkSelect.ItemGroupLabel>
</template>
