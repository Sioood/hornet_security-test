<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import { comboboxChromeKey, type ComboboxSize } from '~/utils/Components/Form/Combobox/context'
import {
  comboboxClearTriggerCVA,
  comboboxIconSizeCVA,
} from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface ComboboxClearTriggerProps {
  size?: ComboboxSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<ComboboxClearTriggerProps>(), {
  size: undefined,
  ui: undefined,
})

const chrome = inject(comboboxChromeKey, null)
const attrs = useAttrs()

const size = computed(() => props.size ?? chrome?.size.value ?? 'md')
const iconClass = computed(() => cn(comboboxIconSizeCVA({ size: size.value })))

const clearAttrs = computed(() => {
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
  <ArkCombobox.ClearTrigger
    v-bind="clearAttrs"
    :class="cn(comboboxClearTriggerCVA({ size }), clearAttrs.class as ClassValue, ui)"
    @click.prevent
  >
    <slot>
      <Icon name="tabler:x" :class="iconClass" />
    </slot>
  </ArkCombobox.ClearTrigger>
</template>
