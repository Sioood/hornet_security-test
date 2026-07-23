<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerTableRowProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerTableRowProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const rowAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.TableRow v-bind="rowAttrs" :class="cn(rowAttrs.class as ClassValue, ui)">
    <slot />
  </ArkDatePicker.TableRow>
</template>
