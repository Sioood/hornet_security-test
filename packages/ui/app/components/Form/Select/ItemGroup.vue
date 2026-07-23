<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectItemGroupProps {
  ui?: ClassValue
}

withDefaults(defineProps<SelectItemGroupProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const groupAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkSelect.ItemGroup v-bind="groupAttrs" :class="cn(groupAttrs.class as ClassValue, ui)">
    <slot />
  </ArkSelect.ItemGroup>
</template>
