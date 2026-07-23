<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import { buttonCVA } from '~/utils/Components/Button/variants'
import {
  selectChromeKey,
  type SelectIntent,
  type SelectSize,
} from '~/utils/Components/Form/Select/context'
import { selectTriggerCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectTriggerProps {
  intent?: SelectIntent
  size?: SelectSize
  disabled?: boolean
  ui?: ClassValue
}

const props = withDefaults(defineProps<SelectTriggerProps>(), {
  disabled: undefined,
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(selectChromeKey, null)
const attrs = useAttrs()

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const triggerAttrs = computed(() => {
  const {
    disabled: _disabled,
    intent: _intent,
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    disabled?: boolean
    intent?: SelectIntent
    size?: SelectSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkSelect.Trigger
    v-bind="triggerAttrs"
    :class="
      cn(
        buttonCVA({
          variant: 'subtle',
          intent,
          size,
          disabled,
        }),
        selectTriggerCVA({ intent, size }),
        triggerAttrs.class as ClassValue,
        ui,
      )
    "
  >
    <slot />
  </ArkSelect.Trigger>
</template>
