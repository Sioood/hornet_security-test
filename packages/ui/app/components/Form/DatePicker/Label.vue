<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
  type DatePickerSize,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerLabelCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerLabelProps {
  intent?: DatePickerIntent
  size?: DatePickerSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerLabelProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const labelAttrs = computed(() => {
  const {
    ui: _ui,
    intent: _intent,
    size: _size,
    ...rest
  } = attrs as Record<string, unknown> & {
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkDatePicker.Label
    v-bind="labelAttrs"
    :class="cn(datePickerLabelCVA({ intent, size }), labelAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.Label>
</template>
