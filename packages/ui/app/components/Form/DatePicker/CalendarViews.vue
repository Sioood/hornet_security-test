<script setup lang="ts">
import { CalendarDateTime, type DateValue } from '@internationalized/date'

import {
  datePickerChromeKey,
  type DatePickerIntent,
  type UIDatePickerSlots,
} from '~/utils/Components/Form/DatePicker/context'
import {
  datePickerMultipleMonthsCVA,
  datePickerTimeInputCVA,
} from '~/utils/Components/Form/DatePicker/variants'

defineOptions({ inheritAttrs: false })

export interface DatePickerCalendarViewsProps {
  showMonthYearSelect?: boolean
  showWeekNumbers?: boolean
  showTodayButton?: boolean
  withTime?: boolean
  numOfMonths?: number
  ui?: Partial<UIDatePickerSlots>
}

const props = withDefaults(defineProps<DatePickerCalendarViewsProps>(), {
  numOfMonths: 1,
  showMonthYearSelect: false,
  showTodayButton: false,
  showWeekNumbers: false,
  ui: undefined,
  withTime: false,
})

const chrome = inject(datePickerChromeKey, null)
const intent = computed<DatePickerIntent>(() => chrome?.intent.value ?? 'primary')

const monthIndexes = computed(() =>
  Array.from({ length: Math.max(1, props.numOfMonths ?? 1) }, (_, index) => index),
)

function getTimeValue(values: DateValue[]): string {
  const [current] = values
  if (current && 'hour' in current && 'minute' in current) {
    return `${String(current.hour).padStart(2, '0')}:${String(current.minute).padStart(2, '0')}`
  }
  return ''
}

function onTimeInput(
  datePicker: { value: DateValue[]; setValue: (values: DateValue[]) => void },
  event: Event,
) {
  const target = event.target as HTMLInputElement
  const [hours, minutes] = target.value.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return

  const [current] = datePicker.value
  if (!current) return

  if ('hour' in current && 'minute' in current) {
    datePicker.setValue([(current as CalendarDateTime).set({ hour: hours, minute: minutes })])
    return
  }

  datePicker.setValue([
    new CalendarDateTime(current.year, current.month, current.day, hours, minutes),
  ])
}
</script>

<template>
  <UIFormDatePickerView view="day" :ui="ui?.view">
    <UIFormDatePickerContext v-slot="datePicker">
      <UIFormDatePickerViewControl :ui="ui?.viewControl">
        <UIFormDatePickerPrevTrigger :ui="ui?.prevTrigger" />
        <div v-if="showMonthYearSelect" class="flex flex-1 items-center justify-center gap-2">
          <UIFormDatePickerMonthSelect :ui="ui?.monthSelect" />
          <UIFormDatePickerYearSelect :ui="ui?.yearSelect" />
        </div>
        <UIFormDatePickerViewTrigger v-else :ui="ui?.viewTrigger">
          <UIFormDatePickerRangeText :ui="ui?.rangeText" />
        </UIFormDatePickerViewTrigger>
        <UIFormDatePickerNextTrigger :ui="ui?.nextTrigger" />
      </UIFormDatePickerViewControl>

      <div :class="cn(numOfMonths > 1 ? datePickerMultipleMonthsCVA() : undefined)">
        <UIFormDatePickerDayGrid
          v-for="monthIndex in monthIndexes"
          :key="monthIndex"
          :month-offset="monthIndex"
          :show-week-numbers="showWeekNumbers"
          :ui="{
            table: ui?.table,
            tableHead: ui?.tableHead,
            tableBody: ui?.tableBody,
            tableRow: ui?.tableRow,
            tableHeader: ui?.tableHeader,
            tableCell: ui?.tableCell,
            dayCellTrigger: ui?.dayCellTrigger,
            weekNumberCell: ui?.weekNumberCell,
            weekNumberHeaderCell: ui?.weekNumberHeaderCell,
          }"
        />
      </div>

      <div v-if="withTime || showTodayButton" :class="cn('flex flex-col gap-2', ui?.footer)">
        <input
          v-if="withTime"
          type="time"
          :value="getTimeValue(datePicker.value)"
          :class="cn(datePickerTimeInputCVA({ intent }), ui?.timeInput)"
          @input="onTimeInput(datePicker, $event)"
        />
        <UIButton
          v-if="showTodayButton"
          variant="subtle"
          :intent
          size="sm"
          text="Today"
          @click="datePicker.selectToday()"
        />
      </div>

      <slot name="footer" :date-picker="datePicker" />
    </UIFormDatePickerContext>
  </UIFormDatePickerView>

  <UIFormDatePickerView view="month" :ui="ui?.view">
    <UIFormDatePickerContext v-slot="datePicker">
      <UIFormDatePickerViewControl :ui="ui?.viewControl">
        <UIFormDatePickerPrevTrigger :ui="ui?.prevTrigger" />
        <UIFormDatePickerViewTrigger :ui="ui?.viewTrigger">
          <UIFormDatePickerRangeText :ui="ui?.rangeText" />
        </UIFormDatePickerViewTrigger>
        <UIFormDatePickerNextTrigger :ui="ui?.nextTrigger" />
      </UIFormDatePickerViewControl>

      <UIFormDatePickerTable :ui="ui?.table">
        <UIFormDatePickerTableBody :ui="ui?.tableBody">
          <UIFormDatePickerTableRow
            v-for="(months, rowIndex) in datePicker.getMonthsGrid({ columns: 4, format: 'short' })"
            :key="rowIndex"
            :ui="ui?.tableRow"
          >
            <UIFormDatePickerTableCell
              v-for="(month, monthIndex) in months"
              :key="monthIndex"
              :value="month.value"
              :ui="ui?.tableCell"
            >
              <UIFormDatePickerTableCellTrigger variant="month" :ui="ui?.monthCellTrigger">
                {{ month.label }}
              </UIFormDatePickerTableCellTrigger>
            </UIFormDatePickerTableCell>
          </UIFormDatePickerTableRow>
        </UIFormDatePickerTableBody>
      </UIFormDatePickerTable>
    </UIFormDatePickerContext>
  </UIFormDatePickerView>

  <UIFormDatePickerView view="year" :ui="ui?.view">
    <UIFormDatePickerContext v-slot="datePicker">
      <UIFormDatePickerViewControl :ui="ui?.viewControl">
        <UIFormDatePickerPrevTrigger :ui="ui?.prevTrigger" />
        <UIFormDatePickerViewTrigger :ui="ui?.viewTrigger">
          <UIFormDatePickerRangeText :ui="ui?.rangeText" />
        </UIFormDatePickerViewTrigger>
        <UIFormDatePickerNextTrigger :ui="ui?.nextTrigger" />
      </UIFormDatePickerViewControl>

      <UIFormDatePickerTable :ui="ui?.table">
        <UIFormDatePickerTableBody :ui="ui?.tableBody">
          <UIFormDatePickerTableRow
            v-for="(years, rowIndex) in datePicker.getYearsGrid({ columns: 4 })"
            :key="rowIndex"
            :ui="ui?.tableRow"
          >
            <UIFormDatePickerTableCell
              v-for="(year, yearIndex) in years"
              :key="yearIndex"
              :value="year.value"
              :ui="ui?.tableCell"
            >
              <UIFormDatePickerTableCellTrigger variant="year" :ui="ui?.yearCellTrigger">
                {{ year.label }}
              </UIFormDatePickerTableCellTrigger>
            </UIFormDatePickerTableCell>
          </UIFormDatePickerTableRow>
        </UIFormDatePickerTableBody>
      </UIFormDatePickerTable>
    </UIFormDatePickerContext>
  </UIFormDatePickerView>
</template>
