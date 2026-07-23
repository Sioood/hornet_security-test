<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
  type DatePickerSize,
} from '~/utils/Components/Form/DatePicker/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerViewTriggerProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerViewTriggerProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed<DatePickerIntent>(() => chrome?.intent.value ?? 'primary')
const size = computed<DatePickerSize>(() => chrome?.size.value ?? 'md')

const viewTriggerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.ViewTrigger v-bind="viewTriggerAttrs" as-child>
    <UIButton
      variant="ghost"
      :intent
      :size
      :ui="{ root: cn('h-full min-h-8 flex-1', ui, viewTriggerAttrs.class as ClassValue) }"
    >
      <slot />
    </UIButton>
  </ArkDatePicker.ViewTrigger>
</template>
