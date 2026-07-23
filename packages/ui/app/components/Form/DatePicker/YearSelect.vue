<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerSelectCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerYearSelectProps {
  intent?: DatePickerIntent
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerYearSelectProps>(), {
  intent: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')

const selectAttrs = computed(() => {
  const {
    ui: _ui,
    intent: _intent,
    ...rest
  } = attrs as Record<string, unknown> & {
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkDatePicker.YearSelect
    v-bind="selectAttrs"
    :class="cn(datePickerSelectCVA({ intent }), selectAttrs.class as ClassValue, ui)"
  />
</template>
