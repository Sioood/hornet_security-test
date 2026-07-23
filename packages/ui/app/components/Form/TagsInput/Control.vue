<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

import { tagsInputChromeKey, type TagsInputSize } from '~/utils/Components/Form/TagsInput/context'
import { tagsInputControlCVA } from '~/utils/Components/Form/TagsInput/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputControlProps {
  size?: TagsInputSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<TagsInputControlProps>(), {
  size: undefined,
  ui: undefined,
})

const chrome = inject(tagsInputChromeKey, null)
const attrs = useAttrs()

const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const controlAttrs = computed(() => {
  const {
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    size?: TagsInputSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkTagsInput.Control
    v-bind="controlAttrs"
    :class="cn(tagsInputControlCVA({ size }), controlAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkTagsInput.Control>
</template>
