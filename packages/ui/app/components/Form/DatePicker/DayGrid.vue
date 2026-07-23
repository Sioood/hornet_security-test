<script setup lang="ts">
import type { DatePickerTableCellBaseProps } from '@ark-ui/vue/date-picker'
import type { DateValue } from '@internationalized/date'
import type { ClassValue } from 'vue'

type VisibleRange = NonNullable<DatePickerTableCellBaseProps['visibleRange']>

defineOptions({ inheritAttrs: false })

export interface DatePickerDayGridProps {
  /** Month offset from the visible range (0 = current month). */
  monthOffset?: number
  showWeekNumbers?: boolean
  ui?: Partial<{
    table: ClassValue
    tableHead: ClassValue
    tableBody: ClassValue
    tableRow: ClassValue
    tableHeader: ClassValue
    tableCell: ClassValue
    dayCellTrigger: ClassValue
    weekNumberCell: ClassValue
    weekNumberHeaderCell: ClassValue
  }>
}

const props = withDefaults(defineProps<DatePickerDayGridProps>(), {
  monthOffset: 0,
  showWeekNumbers: false,
  ui: undefined,
})

function resolveWeeks(datePicker: {
  weeks: DateValue[][]
  getOffset: (duration: { months: number }) => {
    weeks: DateValue[][]
    visibleRange: VisibleRange
  }
  getWeekNumber: (week: DateValue[]) => number
}) {
  if (props.monthOffset === 0) {
    return {
      visibleRange: undefined as VisibleRange | undefined,
      weeks: datePicker.weeks,
    }
  }
  const offset = datePicker.getOffset({ months: props.monthOffset })
  return {
    visibleRange: offset.visibleRange,
    weeks: offset.weeks,
  }
}
</script>

<template>
  <UIFormDatePickerContext v-slot="datePicker">
    <UIFormDatePickerTable :class="ui?.table">
      <UIFormDatePickerTableHead :class="ui?.tableHead">
        <UIFormDatePickerTableRow :class="ui?.tableRow">
          <UIFormDatePickerWeekNumberHeaderCell
            v-if="showWeekNumbers"
            :class="ui?.weekNumberHeaderCell"
          />
          <UIFormDatePickerTableHeader
            v-for="(weekDay, weekDayIndex) in datePicker.weekDays"
            :key="weekDayIndex"
            :class="ui?.tableHeader"
          >
            {{ weekDay.short }}
          </UIFormDatePickerTableHeader>
        </UIFormDatePickerTableRow>
      </UIFormDatePickerTableHead>

      <UIFormDatePickerTableBody :class="ui?.tableBody">
        <UIFormDatePickerTableRow
          v-for="(week, weekIndex) in resolveWeeks(datePicker).weeks"
          :key="weekIndex"
          :class="ui?.tableRow"
        >
          <UIFormDatePickerWeekNumberCell
            v-if="showWeekNumbers"
            :week="week"
            :week-index="weekIndex"
            :class="ui?.weekNumberCell"
          >
            {{ datePicker.getWeekNumber(week) }}
          </UIFormDatePickerWeekNumberCell>

          <UIFormDatePickerTableCell
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            :value="day"
            :visible-range="resolveWeeks(datePicker).visibleRange"
            :class="ui?.tableCell"
          >
            <UIFormDatePickerTableCellTrigger variant="day" :class="ui?.dayCellTrigger">
              {{ day.day }}
            </UIFormDatePickerTableCellTrigger>
          </UIFormDatePickerTableCell>
        </UIFormDatePickerTableRow>
      </UIFormDatePickerTableBody>
    </UIFormDatePickerTable>
  </UIFormDatePickerContext>
</template>
