<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import { datePickerControlCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerControlProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerControlProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const controlAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.Control
    v-bind="controlAttrs"
    :class="cn(datePickerControlCVA(), controlAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.Control>
</template>
