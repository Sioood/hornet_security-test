<script setup lang="ts">
import { ratingStarIconCVA } from '~/utils/Components/Form/Rating/variants'

import type { ClassValue } from 'vue'
import type { RatingIntent, RatingSize } from '~/utils/Components/Form/Rating/context'

defineOptions({ inheritAttrs: false })

export interface RatingStarIndicatorProps {
  half?: boolean
  highlighted?: boolean
  intent?: RatingIntent
  size?: RatingSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<RatingStarIndicatorProps>(), {
  half: false,
  highlighted: false,
  intent: 'primary',
  size: 'md',
  ui: undefined,
})

const state = computed<'empty' | 'full' | 'half'>(() => {
  if (!props.highlighted) return 'empty'
  if (props.half) return 'half'
  return 'full'
})

const iconName = computed(() => {
  if (state.value === 'empty') return 'tabler:star'
  if (state.value === 'half') return 'tabler:star-half-filled'
  return 'tabler:star-filled'
})
</script>

<template>
  <Icon
    :name="iconName"
    :class="cn(ratingStarIconCVA({ intent, size, state }), ui)"
    aria-hidden="true"
  />
</template>
