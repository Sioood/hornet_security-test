<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectItemTextProps {
  ui?: ClassValue
}

withDefaults(defineProps<SelectItemTextProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const textAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkSelect.ItemText
    v-bind="textAttrs"
    :class="cn('flex-1 truncate', textAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkSelect.ItemText>
</template>
