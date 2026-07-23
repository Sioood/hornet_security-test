<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from '@ark-ui/vue/rating-group'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface RatingHiddenInputProps {
  ui?: ClassValue
}

const props = withDefaults(defineProps<RatingHiddenInputProps>(), {
  ui: undefined,
})

const attrs = useAttrs()

const inputAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkRatingGroup.HiddenInput
    v-bind="inputAttrs"
    :class="cn(inputAttrs.class as ClassValue, props.ui)"
  />
</template>
