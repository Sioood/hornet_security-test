<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputComboboxInputProps {
  ui?: ClassValue
}

withDefaults(defineProps<TagsInputComboboxInputProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const comboboxInputAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkCombobox.Input as-child>
    <UIFormTagsInputFieldInput v-bind="comboboxInputAttrs" :ui />
  </ArkCombobox.Input>
</template>
