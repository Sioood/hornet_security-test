<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectHiddenSelectProps {
  ui?: ClassValue
}

withDefaults(defineProps<SelectHiddenSelectProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const hiddenSelectAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkSelect.HiddenSelect
    v-bind="hiddenSelectAttrs"
    :class="cn(hiddenSelectAttrs.class as ClassValue, ui)"
  />
</template>
