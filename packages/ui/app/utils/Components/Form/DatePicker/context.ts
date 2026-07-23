import type { DatePickerDateRangePreset } from '@ark-ui/vue/date-picker'
import type { ClassValue, InjectionKey, Ref } from 'vue'
import type { ComponentIntent, ComponentSize } from '~/utils/Components/contextBase'

export type DatePickerIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type DatePickerSize = NonNullable<ComponentSize>

export type DatePickerPreset = {
  value: DatePickerDateRangePreset
  label: string
}

export interface DatePickerChromeContext {
  intent: Ref<DatePickerIntent>
  size: Ref<DatePickerSize>
}

export const datePickerChromeKey: InjectionKey<DatePickerChromeContext> = Symbol.for(
  'hornet_security-test.ui.form.date-picker.chrome',
)

export interface UIDatePickerSlots {
  root?: ClassValue
  label?: ClassValue
  control?: ClassValue
  input?: ClassValue
  trigger?: ClassValue
  clearTrigger?: ClassValue
  positioner?: ClassValue
  content?: ClassValue
  view?: ClassValue
  viewControl?: ClassValue
  viewTrigger?: ClassValue
  prevTrigger?: ClassValue
  nextTrigger?: ClassValue
  rangeText?: ClassValue
  monthSelect?: ClassValue
  yearSelect?: ClassValue
  table?: ClassValue
  tableHead?: ClassValue
  tableBody?: ClassValue
  tableRow?: ClassValue
  tableHeader?: ClassValue
  tableCell?: ClassValue
  dayCellTrigger?: ClassValue
  monthCellTrigger?: ClassValue
  yearCellTrigger?: ClassValue
  weekNumberCell?: ClassValue
  weekNumberHeaderCell?: ClassValue
  presetTrigger?: ClassValue
  presetGroup?: ClassValue
  valueText?: ClassValue
  selectedDates?: ClassValue
  selectedDate?: ClassValue
  selectedDateRemove?: ClassValue
  timeInput?: ClassValue
  footer?: ClassValue
}
