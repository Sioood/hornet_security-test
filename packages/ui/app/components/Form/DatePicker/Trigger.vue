<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
  type DatePickerSize,
} from '~/utils/Components/Form/DatePicker/context'
import {
  datePickerIconSizeCVA,
  datePickerTriggerCVA,
} from '~/utils/Components/Form/DatePicker/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface DatePickerTriggerProps {
  asChild?: boolean
  intent?: DatePickerIntent
  size?: DatePickerSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<DatePickerTriggerProps>(), {
  asChild: undefined,
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(datePickerChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')
const iconClass = computed(() => datePickerIconSizeCVA({ size: size.value }))

const triggerProps = computed(() => pick(props, ['asChild']))

const triggerAttrs = computed(() => {
  const {
    ui: _ui,
    intent: _intent,
    size: _size,
    asChild: _asChild,
    ...rest
  } = attrs as Record<string, unknown> & {
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkDatePicker.Trigger
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    :class="
      triggerProps.asChild
        ? cn(triggerAttrs.class as ClassValue, ui)
        : cn(datePickerTriggerCVA({ intent, size }), triggerAttrs.class as ClassValue, ui)
    "
  >
    <slot>
      <Icon v-if="!triggerProps.asChild" name="tabler:calendar" :class="iconClass" />
    </slot>
  </ArkDatePicker.Trigger>
</template>
