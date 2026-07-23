<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import {
  selectChromeKey,
  type SelectIntent,
  type SelectSize,
} from '~/utils/Components/Form/Select/context'
import { selectItemCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectItemProps {
  item: unknown
  intent?: SelectIntent
  size?: SelectSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<SelectItemProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(selectChromeKey, null)
const attrs = useAttrs()

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const itemAttrs = computed(() => {
  const {
    intent: _intent,
    size: _size,
    item: _item,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    intent?: SelectIntent
    size?: SelectSize
    item?: unknown
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkSelect.Item
    :item="item"
    v-bind="itemAttrs"
    :class="cn(selectItemCVA({ intent, size }), itemAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkSelect.Item>
</template>
