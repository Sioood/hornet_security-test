<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

import {
  tagsInputChromeKey,
  type TagsInputIntent,
  type TagsInputSize,
} from '~/utils/Components/Form/TagsInput/context'
import { tagsInputInputCVA } from '~/utils/Components/Form/TagsInput/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputInputProps {
  intent?: TagsInputIntent
  size?: TagsInputSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<TagsInputInputProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(tagsInputChromeKey, null)
const attrs = useAttrs()

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const inputAttrs = computed(() => {
  const {
    intent: _intent,
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    intent?: TagsInputIntent
    size?: TagsInputSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkTagsInput.Input
    v-bind="inputAttrs"
    :class="cn(tagsInputInputCVA({ intent, size }), inputAttrs.class as ClassValue, ui)"
  />
</template>
