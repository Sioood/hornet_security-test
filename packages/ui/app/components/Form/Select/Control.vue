<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import { selectControlCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectControlProps {
  ui?: ClassValue
}

withDefaults(defineProps<SelectControlProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const controlAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkSelect.Control
    v-bind="controlAttrs"
    :class="cn(selectControlCVA(), controlAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkSelect.Control>
</template>
