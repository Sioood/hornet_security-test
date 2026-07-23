<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerSize,
} from '~/utils/Components/Form/DatePicker/context'
import {
  datePickerClearTriggerCVA,
  datePickerIconSizeCVA,
} from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerClearTriggerProps {
  size?: DatePickerSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerClearTriggerProps>(), {
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const size = computed(() => props.size ?? chrome?.size.value ?? 'md')
const iconClass = computed(() => datePickerIconSizeCVA({ size: size.value }))

const clearAttrs = computed(() => {
  const { ui: _ui, size: _size, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.ClearTrigger
    v-bind="clearAttrs"
    :class="cn(datePickerClearTriggerCVA({ size }), clearAttrs.class as ClassValue, ui)"
    @click.prevent
  >
    <slot>
      <Icon name="tabler:x" :class="iconClass" />
    </slot>
  </ArkDatePicker.ClearTrigger>
</template>
