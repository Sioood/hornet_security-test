<script setup lang="ts">
import {
  DatePicker as ArkDatePicker,
  type DatePickerValueTextBaseProps,
} from '@ark-ui/vue/date-picker'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerValueTextProps extends DatePickerValueTextBaseProps {
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerValueTextProps>(), {
  separator: ', ',
  ui: undefined,
})

const attrs = useAttrs()

const valueTextProps = computed(() => pick(props, ['asChild', 'placeholder', 'separator']))

const valueTextAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.ValueText
    v-bind="{ ...valueTextProps, ...valueTextAttrs }"
    :class="cn('txt-base', valueTextAttrs.class as ClassValue, ui)"
  />
</template>
