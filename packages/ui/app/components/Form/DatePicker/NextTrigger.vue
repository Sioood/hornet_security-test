<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
  type DatePickerSize,
} from '~/utils/Components/Form/DatePicker/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerNextTriggerProps {
  size?: DatePickerSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerNextTriggerProps>(), {
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const size = computed(() => props.size ?? chrome?.size.value ?? 'md')
const intent = computed<DatePickerIntent>(() => chrome?.intent.value ?? 'primary')

const nextAttrs = computed(() => {
  const { ui: _ui, size: _size, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.NextTrigger v-bind="nextAttrs" as-child>
    <UIButton
      variant="ghost"
      :intent
      :size
      icon-only
      icon="tabler:chevron-right"
      leading
      :ui="{ root: cn('h-full min-h-8 shrink-0', ui, nextAttrs.class as ClassValue) }"
    />
  </ArkDatePicker.NextTrigger>
</template>
