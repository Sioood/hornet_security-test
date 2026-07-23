<script setup lang="ts">
import { DatePicker as ArkDatePicker, type DatePickerTableBaseProps } from '@ark-ui/vue/date-picker'

import { datePickerTableCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerTableProps extends DatePickerTableBaseProps {
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerTableProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const tableProps = computed(() => pick(props, ['asChild', 'columns', 'id', 'view']))

const tableAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.Table
    v-bind="{ ...tableProps, ...tableAttrs }"
    :class="cn(datePickerTableCVA(), tableAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.Table>
</template>
