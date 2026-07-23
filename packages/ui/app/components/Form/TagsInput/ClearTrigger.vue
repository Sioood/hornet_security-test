<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

import { tagsInputChromeKey, type TagsInputSize } from '~/utils/Components/Form/TagsInput/context'
import {
  tagsInputClearTriggerCVA,
  tagsInputComboboxIconSizeCVA,
} from '~/utils/Components/Form/TagsInput/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputClearTriggerProps {
  size?: TagsInputSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<TagsInputClearTriggerProps>(), {
  size: undefined,
  ui: undefined,
})

const chrome = inject(tagsInputChromeKey, null)
const attrs = useAttrs()

const size = computed(() => props.size ?? chrome?.size.value ?? 'md')
const iconClass = computed(() => cn(tagsInputComboboxIconSizeCVA({ size: size.value })))

const clearAttrs = computed(() => {
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
  <ArkTagsInput.ClearTrigger
    v-bind="clearAttrs"
    :class="cn(tagsInputClearTriggerCVA({ size }), clearAttrs.class as ClassValue, ui)"
  >
    <slot>
      <Icon name="tabler:x" :class="iconClass" />
    </slot>
  </ArkTagsInput.ClearTrigger>
</template>
