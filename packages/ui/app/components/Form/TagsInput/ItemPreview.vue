<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

import { tagsInputItemPreviewCVA } from '~/utils/Components/Form/TagsInput/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputItemPreviewProps {
  ui?: ClassValue
}

withDefaults(defineProps<TagsInputItemPreviewProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const previewAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkTagsInput.ItemPreview
    v-bind="previewAttrs"
    :class="cn(tagsInputItemPreviewCVA(), previewAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkTagsInput.ItemPreview>
</template>
