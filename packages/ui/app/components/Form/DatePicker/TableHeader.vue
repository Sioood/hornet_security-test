<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerTableHeaderCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerTableHeaderProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerTableHeaderProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed<DatePickerIntent>(() => chrome?.intent.value ?? 'primary')

const headerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.TableHeader
    v-bind="headerAttrs"
    :class="cn(datePickerTableHeaderCVA({ intent }), headerAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.TableHeader>
</template>
