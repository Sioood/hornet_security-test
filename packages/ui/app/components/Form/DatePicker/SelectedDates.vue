<script setup lang="ts">
import {
  datePickerChromeKey,
  type DatePickerIntent,
  type DatePickerSize,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerSelectedDatesCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerSelectedDatesProps {
  intent?: DatePickerIntent
  placeholder?: string
  ui?: {
    root?: ClassValue
    /** Passed to each date chip root (`UIChip.ui.root`). */
    date?: ClassValue
    /** Passed to each date chip action icon (`UIChip.ui.actionIcon`). */
    remove?: ClassValue
  }
}

const props = withDefaults(defineProps<DatePickerSelectedDatesProps>(), {
  intent: undefined,
  placeholder: 'Select dates…',
  ui: undefined,
})

const chrome = inject(datePickerChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<DatePickerSize>(() => chrome?.size.value ?? 'md')
</script>

<template>
  <UIFormDatePickerContext v-slot="datePicker">
    <div :class="cn(datePickerSelectedDatesCVA({ intent }), ui?.root)">
      <template v-if="datePicker.value.length > 0">
        <UIChip
          v-for="(date, index) in datePicker.value"
          :key="`${date.year}-${date.month}-${date.day}-${index}`"
          :label="datePicker.format(date)"
          :intent
          :size
          action-icon="tabler:x"
          :on-icon-action="true"
          :ui="{
            root: ui?.date,
            actionIcon: ui?.remove,
          }"
          :on-click="
            () =>
              datePicker.setValue(datePicker.value.filter((_, itemIndex) => itemIndex !== index))
          "
        />
      </template>
      <span v-else class="txt-base text-neutral-text-subtle">{{ placeholder }}</span>
    </div>
  </UIFormDatePickerContext>
</template>
