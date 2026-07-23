<script setup lang="ts">
// oxlint-disable no-console
import { useDatePicker, type DatePickerValueChangeDetails } from '@ark-ui/vue/date-picker'
import { CalendarDateTime, parseDate, type DateValue } from '@internationalized/date'

import type { DatePickerPreset } from '~/utils/Components/Form/DatePicker/context'

const controlledValue = ref<DateValue[]>([parseDate('2025-06-15')])
const controlledOpen = ref(false)

const providerApi = useDatePicker({
  defaultValue: [parseDate('2025-03-10')],
  selectionMode: 'single',
})

const rangePresets: DatePickerPreset[] = [
  { label: 'Last 7 days', value: 'last7Days' },
  { label: 'Last 30 days', value: 'last30Days' },
  { label: 'This month', value: 'thisMonth' },
]

const multipleValue = ref<DateValue[]>([])
const maxMultipleValue = ref<DateValue[]>([])

const timeValue = ref<DateValue[]>([new CalendarDateTime(2025, 6, 15, 14, 30)])

function isWeekend(date: DateValue) {
  const day = new Date(date.year, date.month - 1, date.day).getDay()
  return day === 0 || day === 6
}

function parseFlexible(value: string): DateValue | undefined {
  const parts = value.split('/').map(Number)
  if (parts.length === 2 && parts[0] && parts[1]) {
    return parseDate(
      `2025-${String(parts[1]).padStart(2, '0')}-${String(parts[0]).padStart(2, '0')}`,
    )
  }
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const year = parts[2] < 100 ? 2000 + parts[2] : parts[2]
    return parseDate(
      `${year}-${String(parts[1]).padStart(2, '0')}-${String(parts[0]).padStart(2, '0')}`,
    )
  }
  return undefined
}

function formatMonthYear(date: DateValue) {
  return `${String(date.month).padStart(2, '0')}/${date.year}`
}

function parseMonthYear(value: string): DateValue | undefined {
  const [month, year] = value.split('/').map(Number)
  if (!month || !year) return undefined
  return parseDate(`${year}-${String(month).padStart(2, '0')}-01`)
}

function formatYear(date: DateValue) {
  return String(date.year)
}

function parseYear(value: string): DateValue | undefined {
  const year = Number(value)
  if (Number.isNaN(year)) return undefined
  return parseDate(`${year}-01-01`)
}

function onValueChange(details: DatePickerValueChangeDetails) {
  console.log('valueChange', details)
}

const formResult = ref('')

function onFormSubmit(event: Event) {
  event.preventDefault()
  const data = new FormData(event.target as HTMLFormElement)
  formResult.value = String(data.get('event-date') ?? '')
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-10 p-6">
    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Default value</h2>
      <UIFormDatePicker
        label="Start date"
        :default-value="[parseDate('2025-01-15')]"
        @value-change="onValueChange"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Controlled</h2>
      <p class="txt-caption text-neutral-text-subtle">
        Value: {{ controlledValue.map((d) => d.toString()).join(', ') }}
      </p>
      <UIFormDatePicker
        v-model="controlledValue"
        v-model:open="controlledOpen"
        label="Controlled date"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Trailing trigger (Button)</h2>
      <p class="txt-caption text-neutral-text-subtle">
        Calendar open button rendered inside the control shell via
        <code class="txt-caption">trigger-placement="inner-trailing"</code>.
      </p>
      <UIFormDatePicker label="Event date" trigger-placement="inner-trailing" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Root provider</h2>
      <UIButton size="sm" variant="subtle" @click="providerApi.selectToday()">
        Select today
      </UIButton>
      <UIFormDatePicker label="External API" :value="providerApi" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Default view (month)</h2>
      <UIFormDatePicker label="Month view" default-view="month" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Month and year select</h2>
      <UIFormDatePicker label="With selects" show-month-year-select />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Range</h2>
      <UIFormDatePicker label="Date range" selection-mode="range" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Multiple</h2>
      <UIFormDatePicker
        v-model="multipleValue"
        label="Multiple dates"
        selection-mode="multiple"
        show-selected-tags
        :close-on-select="false"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Max selected dates</h2>
      <UIFormDatePicker
        v-model="maxMultipleValue"
        label="Up to 3 dates"
        selection-mode="multiple"
        :max-selected-dates="3"
        :close-on-select="false"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Multiple months</h2>
      <UIFormDatePicker label="Two months" :num-of-months="2" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Presets</h2>
      <UIFormDatePicker label="Range presets" selection-mode="range" :presets="rangePresets" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Min and max</h2>
      <UIFormDatePicker
        label="Q2 2025"
        :min="parseDate('2025-04-01')"
        :max="parseDate('2025-06-30')"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Unavailable (weekends)</h2>
      <UIFormDatePicker label="Weekdays only" :is-date-unavailable="isWeekend" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Locale</h2>
      <p class="txt-caption text-neutral-text-subtle">
        Uses the active i18n locale and week start by default.
      </p>
      <UIFormDatePicker label="Default locale" />
      <UIFormDatePicker label="German override" locale="de-DE" :start-of-week="1" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Month picker</h2>
      <UIFormDatePicker
        label="Month only"
        default-view="month"
        min-view="month"
        :format="formatMonthYear"
        :parse="parseMonthYear"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Year picker</h2>
      <UIFormDatePicker
        label="Year only"
        default-view="year"
        min-view="year"
        :format="formatYear"
        :parse="parseYear"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Inline</h2>
      <UIFormDatePicker label="Inline calendar" inline :show-trigger="false" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Custom parsing</h2>
      <UIFormDatePicker
        label="Flexible input"
        placeholder="DD/MM or DD/MM/YY"
        :parse="parseFlexible"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Month picker range</h2>
      <UIFormDatePicker
        label="Month range"
        selection-mode="range"
        default-view="month"
        min-view="month"
        :format="formatMonthYear"
        :parse="parseMonthYear"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Year range</h2>
      <UIFormDatePicker
        label="Year range"
        selection-mode="range"
        default-view="year"
        min-view="year"
        :format="formatYear"
        :parse="parseYear"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Select today</h2>
      <UIFormDatePicker label="With today button" show-today-button />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Fixed weeks</h2>
      <UIFormDatePicker label="Fixed 6 weeks" fixed-weeks />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">Form</h2>
      <form class="flex flex-col gap-3" @submit="onFormSubmit">
        <UIFormDatePicker
          label="Event date"
          name="event-date"
          :default-value="[parseDate('2025-08-01')]"
          :is-date-unavailable="isWeekend"
        />
        <UIButton type="submit" size="sm" text="Submit" />
      </form>
      <p v-if="formResult" class="txt-caption text-neutral-text-subtle">
        Submitted: {{ formResult }}
      </p>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="txt-h3">With time</h2>
      <UIFormDatePicker
        v-model="timeValue"
        label="Date and time"
        with-time
        :close-on-select="false"
      />
    </section>
  </div>
</template>
