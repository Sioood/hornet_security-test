<script setup lang="ts">
import {
  tagsInputChromeKey,
  type TagsInputIntent,
  type TagsInputSize,
} from '~/utils/Components/Form/TagsInput/context'
import { tagsInputItemsCVA } from '~/utils/Components/Form/TagsInput/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputItemsProps {
  intent?: TagsInputIntent
  size?: TagsInputSize
  resolveLabel?: (value: string) => string
  ui?: {
    root?: ClassValue
    tag?: ClassValue
    tagRemove?: ClassValue
  }
}

const props = withDefaults(defineProps<TagsInputItemsProps>(), {
  intent: undefined,
  resolveLabel: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(tagsInputChromeKey, null)

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TagsInputSize>(() => props.size ?? chrome?.size.value ?? 'md')

function labelFor(value: string) {
  return props.resolveLabel?.(value) ?? value
}
</script>

<template>
  <UIFormTagsInputContext v-slot="tagsInput">
    <div :class="cn(tagsInputItemsCVA(), ui?.root)">
      <UIChip
        v-for="(value, index) in tagsInput.value"
        :key="`${value}-${index}`"
        :label="labelFor(value)"
        :intent
        :size
        action-icon="tabler:x"
        :on-icon-action="true"
        :disabled="tagsInput.disabled"
        :ui="{
          root: cn('shrink-0', ui?.tag),
          actionIcon: ui?.tagRemove,
        }"
        :on-click="
          () => tagsInput.setValue(tagsInput.value.filter((_, itemIndex) => itemIndex !== index))
        "
      />
    </div>
  </UIFormTagsInputContext>
</template>
