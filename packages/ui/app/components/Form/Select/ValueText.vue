<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectValueTextProps {
  placeholder?: string
  ui?: ClassValue
}

withDefaults(defineProps<SelectValueTextProps>(), {
  placeholder: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const valueTextAttrs = computed(() => {
  const {
    placeholder: _placeholder,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    placeholder?: string
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkSelect.ValueText
    v-bind="valueTextAttrs"
    :placeholder
    :class="cn('flex-1 truncate text-left', valueTextAttrs.class as ClassValue, ui)"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </ArkSelect.ValueText>
</template>
