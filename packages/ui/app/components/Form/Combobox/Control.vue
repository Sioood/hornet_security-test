<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import { comboboxControlCVA } from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface ComboboxControlProps {
  ui?: ClassValue
}

withDefaults(defineProps<ComboboxControlProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const controlAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkCombobox.Control
    v-bind="controlAttrs"
    :class="cn(comboboxControlCVA(), controlAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkCombobox.Control>
</template>
