<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerRangeTextCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerRangeTextProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerRangeTextProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed<DatePickerIntent>(() => chrome?.intent.value ?? 'primary')

const rangeTextAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.RangeText
    v-bind="rangeTextAttrs"
    :class="cn(datePickerRangeTextCVA({ intent }), rangeTextAttrs.class as ClassValue, ui)"
  />
</template>
