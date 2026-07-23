<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputHiddenInputProps {
  ui?: ClassValue
}

withDefaults(defineProps<TagsInputHiddenInputProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const hiddenInputAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkTagsInput.HiddenInput
    v-bind="hiddenInputAttrs"
    :class="cn(hiddenInputAttrs.class as ClassValue, ui)"
  />
</template>
