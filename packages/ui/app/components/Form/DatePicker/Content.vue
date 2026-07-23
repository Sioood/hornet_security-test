<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerContentCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerContentProps {
  intent?: DatePickerIntent
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerContentProps>(), {
  intent: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')

const contentAttrs = computed(() => {
  const {
    ui: _ui,
    intent: _intent,
    ...rest
  } = attrs as Record<string, unknown> & {
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkDatePicker.Content
    v-bind="contentAttrs"
    :class="cn(datePickerContentCVA({ intent }), contentAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.Content>
</template>
