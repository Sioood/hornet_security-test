<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import { comboboxItemCVA } from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'
import type { ComboboxIntent, ComboboxSize } from '~/utils/Components/Form/Combobox/context'

defineOptions({ inheritAttrs: false })

export interface ComboboxItemProps {
  item: unknown
  intent?: ComboboxIntent
  size?: ComboboxSize
  ui?: ClassValue
}

withDefaults(defineProps<ComboboxItemProps>(), {
  intent: 'primary',
  size: 'md',
  ui: undefined,
})

const attrs = useAttrs()

const itemAttrs = computed(() => {
  const {
    intent: _intent,
    size: _size,
    item: _item,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    intent?: ComboboxIntent
    size?: ComboboxSize
    item?: unknown
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkCombobox.Item
    :item="item"
    v-bind="itemAttrs"
    :class="cn(comboboxItemCVA({ intent, size }), itemAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkCombobox.Item>
</template>
