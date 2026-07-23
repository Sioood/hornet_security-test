<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface ComboboxItemTextProps {
  ui?: ClassValue
}

withDefaults(defineProps<ComboboxItemTextProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const textAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkCombobox.ItemText
    v-bind="textAttrs"
    :class="cn('flex-1 truncate', textAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkCombobox.ItemText>
</template>
