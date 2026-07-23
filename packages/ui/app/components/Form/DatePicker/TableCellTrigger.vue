<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
} from '~/utils/Components/Form/DatePicker/context'
import {
  datePickerDayCellTriggerCVA,
  datePickerMonthCellTriggerCVA,
  datePickerYearCellTriggerCVA,
} from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

type TableCellTriggerVariant = 'day' | 'month' | 'year'

export interface DatePickerTableCellTriggerProps {
  variant?: TableCellTriggerVariant
  intent?: DatePickerIntent
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerTableCellTriggerProps>(), {
  intent: undefined,
  ui: undefined,
  variant: 'day',
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')

const triggerClass = computed(() => {
  switch (props.variant) {
    case 'month':
      return datePickerMonthCellTriggerCVA({ intent: intent.value })
    case 'year':
      return datePickerYearCellTriggerCVA({ intent: intent.value })
    default:
      return datePickerDayCellTriggerCVA({ intent: intent.value })
  }
})

const triggerAttrs = computed(() => {
  const {
    ui: _ui,
    variant: _variant,
    intent: _intent,
    ...rest
  } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.TableCellTrigger
    v-bind="triggerAttrs"
    :class="cn(triggerClass, triggerAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.TableCellTrigger>
</template>
