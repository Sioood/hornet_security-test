<script setup lang="ts">
import {
  comboboxChromeKey,
  type ComboboxIntent,
  type ComboboxItem,
  type ComboboxSize,
} from '~/utils/Components/Form/Combobox/context'
import { comboboxSelectedItemsCVA } from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface ComboboxSelectedItemsProps {
  intent?: ComboboxIntent
  size?: ComboboxSize
  items?: ComboboxItem[]
  ui?: {
    root?: ClassValue
    tag?: ClassValue
    tagRemove?: ClassValue
  }
}

const props = withDefaults(defineProps<ComboboxSelectedItemsProps>(), {
  intent: undefined,
  items: () => [],
  size: undefined,
  ui: undefined,
})

const chrome = inject(comboboxChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<ComboboxSize>(() => chrome?.size.value ?? props.size ?? 'md')

function resolveLabel(value: string) {
  return props.items.find((item) => item.value === value)?.label ?? value
}
</script>

<template>
  <UIFormComboboxContext v-slot="combobox">
    <div :class="cn(comboboxSelectedItemsCVA(), ui?.root)">
      <UIChip
        v-for="(value, index) in combobox.value"
        :key="`${value}-${index}`"
        :label="resolveLabel(value)"
        :intent
        :size
        action-icon="tabler:x"
        :on-icon-action="true"
        :ui="{
          root: ui?.tag,
          actionIcon: ui?.tagRemove,
        }"
        :on-click="
          () => combobox.setValue(combobox.value.filter((_, itemIndex) => itemIndex !== index))
        "
      />
    </div>
  </UIFormComboboxContext>
</template>
