<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import { comboboxChromeKey, type ComboboxSize } from '~/utils/Components/Form/Combobox/context'
import { comboboxEmptyCVA } from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface ComboboxEmptyProps {
  size?: ComboboxSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<ComboboxEmptyProps>(), {
  size: undefined,
  ui: undefined,
})

const chrome = inject(comboboxChromeKey, null)
const attrs = useAttrs()

const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const emptyAttrs = computed(() => {
  const {
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    size?: ComboboxSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkCombobox.Empty
    v-bind="emptyAttrs"
    :class="cn(comboboxEmptyCVA({ size }), emptyAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkCombobox.Empty>
</template>
