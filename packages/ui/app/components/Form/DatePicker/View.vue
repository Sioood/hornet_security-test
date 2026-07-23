<script setup lang="ts">
import {
  DatePicker as ArkDatePicker,
  type DatePickerViewProps as ArkDatePickerViewProps,
} from '@ark-ui/vue/date-picker'

import { datePickerViewCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerViewProps extends ArkDatePickerViewProps {
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerViewProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const viewProps = computed(() => pick(props, ['asChild', 'view']))

const viewAttrs = computed(() => {
  const { ui: _ui, view: _view, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.View
    v-bind="{ ...viewProps, ...viewAttrs }"
    :class="cn(datePickerViewCVA(), viewAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.View>
</template>
