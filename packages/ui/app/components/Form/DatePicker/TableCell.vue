<script setup lang="ts">
import {
  DatePicker as ArkDatePicker,
  type DatePickerTableCellBaseProps,
} from '@ark-ui/vue/date-picker'

import { datePickerTableCellCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerTableCellProps extends DatePickerTableCellBaseProps {
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerTableCellProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const cellProps = computed(() =>
  pick(props, ['asChild', 'columns', 'disabled', 'value', 'visibleRange']),
)

const cellAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.TableCell
    v-bind="{ ...cellProps, ...cellAttrs }"
    :class="cn(datePickerTableCellCVA(), cellAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.TableCell>
</template>
