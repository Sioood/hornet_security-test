<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import {
  comboboxChromeKey,
  type ComboboxIntent,
  type ComboboxSize,
} from '~/utils/Components/Form/Combobox/context'
import { comboboxTriggerCVA, comboboxIconSizeCVA } from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface ComboboxTriggerProps {
  intent?: ComboboxIntent
  size?: ComboboxSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<ComboboxTriggerProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(comboboxChromeKey, null)
const attrs = useAttrs()

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')
const iconClass = computed(() => cn(comboboxIconSizeCVA({ size: size.value })))

const triggerAttrs = computed(() => {
  const {
    intent: _intent,
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    intent?: ComboboxIntent
    size?: ComboboxSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkCombobox.Trigger
    v-bind="triggerAttrs"
    :class="cn(comboboxTriggerCVA({ intent, size }), triggerAttrs.class as ClassValue, ui)"
  >
    <slot>
      <Icon
        name="tabler:chevron-down"
        :class="cn(iconClass, 'transition-transform data-[state=open]:rotate-180')"
      />
    </slot>
  </ArkCombobox.Trigger>
</template>
