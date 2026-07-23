<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputItemTextProps {
  ui?: ClassValue
}

withDefaults(defineProps<TagsInputItemTextProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const textAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkTagsInput.ItemText v-bind="textAttrs" :class="cn(textAttrs.class as ClassValue, ui)">
    <slot />
  </ArkTagsInput.ItemText>
</template>
