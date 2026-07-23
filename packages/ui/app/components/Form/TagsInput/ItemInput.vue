<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

import { tagsInputChromeKey, type TagsInputIntent } from '~/utils/Components/Form/TagsInput/context'
import { tagsInputItemInputCVA } from '~/utils/Components/Form/TagsInput/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputItemInputProps {
  intent?: TagsInputIntent
  ui?: ClassValue
}

const props = withDefaults(defineProps<TagsInputItemInputProps>(), {
  intent: undefined,
  ui: undefined,
})

const chrome = inject(tagsInputChromeKey, null)
const attrs = useAttrs()

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')

const itemInputAttrs = computed(() => {
  const {
    intent: _intent,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    intent?: TagsInputIntent
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkTagsInput.ItemInput
    v-bind="itemInputAttrs"
    :class="cn(tagsInputItemInputCVA({ intent }), itemInputAttrs.class as ClassValue, ui)"
  />
</template>
