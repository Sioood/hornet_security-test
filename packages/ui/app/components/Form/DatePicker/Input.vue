<script setup lang="ts">
import { DatePicker as ArkDatePicker, type DatePickerInputBaseProps } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
  type DatePickerSize,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerInputCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerInputProps extends DatePickerInputBaseProps {
  intent?: DatePickerIntent
  size?: DatePickerSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerInputProps>(), {
  fixOnBlur: true,
  index: undefined,
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const inputProps = computed(() => pick(props, ['asChild', 'fixOnBlur', 'index']))

const inputAttrs = computed(() => {
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
  <ArkDatePicker.Input
    v-bind="{ ...inputProps, ...inputAttrs }"
    :class="cn(datePickerInputCVA({ intent, size }), inputAttrs.class as ClassValue, ui)"
  />
</template>
