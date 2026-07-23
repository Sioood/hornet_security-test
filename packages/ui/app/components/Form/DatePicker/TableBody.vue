<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerTableBodyProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerTableBodyProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const bodyAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.TableBody v-bind="bodyAttrs" :class="cn(bodyAttrs.class as ClassValue, ui)">
    <slot />
  </ArkDatePicker.TableBody>
</template>
