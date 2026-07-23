<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import { comboboxIconSizeCVA } from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'
import type { ComboboxSize } from '~/utils/Components/Form/Combobox/context'

defineOptions({ inheritAttrs: false })

export interface ComboboxItemIndicatorProps {
  size?: ComboboxSize
  ui?: ClassValue
}

withDefaults(defineProps<ComboboxItemIndicatorProps>(), {
  size: 'md',
  ui: undefined,
})

const attrs = useAttrs()

const indicatorAttrs = computed(() => {
  const {
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    size?: ComboboxSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkCombobox.ItemIndicator
    v-bind="indicatorAttrs"
    :class="cn('data-[state=unchecked]:invisible', indicatorAttrs.class as ClassValue, ui)"
  >
    <slot>
      <Icon name="tabler:check" :class="comboboxIconSizeCVA({ size })" />
    </slot>
  </ArkCombobox.ItemIndicator>
</template>
