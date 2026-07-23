<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputItemProps {
  index: string | number
  value: string
  disabled?: boolean
  ui?: ClassValue
}

withDefaults(defineProps<TagsInputItemProps>(), {
  disabled: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const itemAttrs = computed(() => {
  const {
    index: _index,
    value: _value,
    disabled: _disabled,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    index?: string | number
    value?: string
    disabled?: boolean
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkTagsInput.Item
    :index="index"
    :value="value"
    :disabled="disabled"
    v-bind="itemAttrs"
    :class="cn(itemAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkTagsInput.Item>
</template>
