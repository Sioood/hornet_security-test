<script setup lang="ts">
import {
  DatePicker as ArkDatePicker,
  type DatePickerWeekNumberCellBaseProps,
} from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerWeekNumberCellCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerWeekNumberCellProps extends DatePickerWeekNumberCellBaseProps {
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerWeekNumberCellProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed<DatePickerIntent>(() => chrome?.intent.value ?? 'primary')

const cellProps = computed(() => pick(props, ['asChild', 'week', 'weekIndex']))

const cellAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.WeekNumberCell
    v-bind="{ ...cellProps, ...cellAttrs }"
    :class="cn(datePickerWeekNumberCellCVA({ intent }), cellAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.WeekNumberCell>
</template>
