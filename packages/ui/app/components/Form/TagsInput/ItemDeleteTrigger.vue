<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputItemDeleteTriggerProps {
  ui?: ClassValue
}

withDefaults(defineProps<TagsInputItemDeleteTriggerProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const deleteAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkTagsInput.ItemDeleteTrigger
    v-bind="deleteAttrs"
    :class="cn(deleteAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkTagsInput.ItemDeleteTrigger>
</template>
