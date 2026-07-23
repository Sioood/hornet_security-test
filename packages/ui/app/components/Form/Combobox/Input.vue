<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import {
  comboboxChromeKey,
  type ComboboxIntent,
  type ComboboxSize,
} from '~/utils/Components/Form/Combobox/context'
import { comboboxInputCVA } from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface ComboboxInputProps {
  intent?: ComboboxIntent
  size?: ComboboxSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<ComboboxInputProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(comboboxChromeKey, null)
const attrs = useAttrs()

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const inputAttrs = computed(() => {
  const {
    intent: _intent,
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    intent?: ComboboxIntent
    size?: ComboboxSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkCombobox.Input
    v-bind="inputAttrs"
    :class="cn(comboboxInputCVA({ intent, size }), inputAttrs.class as ClassValue, ui)"
  />
</template>
