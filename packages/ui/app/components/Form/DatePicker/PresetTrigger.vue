<script setup lang="ts">
import {
  DatePicker as ArkDatePicker,
  type DatePickerPresetTriggerBaseProps,
} from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerPresetTriggerCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerPresetTriggerProps extends DatePickerPresetTriggerBaseProps {
  intent?: DatePickerIntent
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerPresetTriggerProps>(), {
  intent: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')

const presetProps = computed(() => pick(props, ['asChild', 'value']))

const presetAttrs = computed(() => {
  const {
    ui: _ui,
    intent: _intent,
    value: _value,
    ...rest
  } = attrs as Record<string, unknown> & {
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkDatePicker.PresetTrigger
    v-bind="{ ...presetProps, ...presetAttrs }"
    :class="cn(datePickerPresetTriggerCVA({ intent }), presetAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.PresetTrigger>
</template>
