<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerTableHeadProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerTableHeadProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const headAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.TableHead v-bind="headAttrs" :class="cn(headAttrs.class as ClassValue, ui)">
    <slot />
  </ArkDatePicker.TableHead>
</template>
