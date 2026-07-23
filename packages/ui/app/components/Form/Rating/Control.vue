<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from '@ark-ui/vue/rating-group'

import { ratingChromeKey, type RatingSize } from '~/utils/Components/Form/Rating/context'
import { ratingControlCVA } from '~/utils/Components/Form/Rating/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface RatingControlProps {
  size?: RatingSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<RatingControlProps>(), {
  size: undefined,
  ui: undefined,
})

const chrome = inject(ratingChromeKey, null)
const attrs = useAttrs()

const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const controlAttrs = computed(() => {
  const {
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    size?: RatingSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkRatingGroup.Control
    v-bind="controlAttrs"
    :class="cn(ratingControlCVA({ size }), controlAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkRatingGroup.Control>
</template>
