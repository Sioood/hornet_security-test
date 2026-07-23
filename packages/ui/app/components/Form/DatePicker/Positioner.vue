<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import { useFloatingLayerPositionerRef } from '~/composables/useLayerZIndexRef'
import { datePickerPositionerCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerPositionerProps {
  ui?: ClassValue
}

withDefaults(defineProps<DatePickerPositionerProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const positionerRef = useFloatingLayerPositionerRef()

const positionerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkDatePicker.Positioner
    :ref="positionerRef"
    v-bind="positionerAttrs"
    :class="cn(datePickerPositionerCVA(), positionerAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkDatePicker.Positioner>
</template>
