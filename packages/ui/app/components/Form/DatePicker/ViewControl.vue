<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import { datePickerViewControlCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerViewControlProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerViewControlProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const viewControlAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.ViewControl
    v-bind="viewControlAttrs"
    :class="cn(datePickerViewControlCVA(), viewControlAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.ViewControl>
</template>
