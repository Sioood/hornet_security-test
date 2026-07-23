<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerWeekNumberHeaderCellCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerWeekNumberHeaderCellProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerWeekNumberHeaderCellProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed<DatePickerIntent>(() => chrome?.intent.value ?? 'primary')

const headerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.WeekNumberHeaderCell
    v-bind="headerAttrs"
    :class="cn(datePickerWeekNumberHeaderCellCVA({ intent }), headerAttrs.class as ClassValue, ui)"
  />
</template>
