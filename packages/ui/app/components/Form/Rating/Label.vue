<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from '@ark-ui/vue/rating-group'

import {
  ratingChromeKey,
  type RatingIntent,
  type RatingSize,
} from '~/utils/Components/Form/Rating/context'
import { ratingLabelCVA } from '~/utils/Components/Form/Rating/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface RatingLabelProps {
  intent?: RatingIntent
  size?: RatingSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<RatingLabelProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(ratingChromeKey, null)
const attrs = useAttrs()

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const labelAttrs = computed(() => {
  const {
    intent: _intent,
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    intent?: RatingIntent
    size?: RatingSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkRatingGroup.Label
    v-bind="labelAttrs"
    :class="cn(ratingLabelCVA({ intent, size }), labelAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkRatingGroup.Label>
</template>
