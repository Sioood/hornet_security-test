<script setup lang="ts" generic="T = unknown">
import { VisSingleContainer } from '@unovis/vue'
import { computed } from 'vue'

import { buildChartSingleContainerVisBind } from '@/utils/Components/Chart/single-container'

import type { ChartSingleContainerProps } from '@/utils/Components/Chart/context'

export type {
  ChartSingleContainerProps,
  UIChartSingleContainerSlots,
} from '@/utils/Components/Chart/context'

const props = withDefaults(defineProps<ChartSingleContainerProps<T>>(), {
  data: undefined,
  ui: undefined,
})

const visSingleContainerBind = computed(() => buildChartSingleContainerVisBind(props))
</script>

<template>
  <VisSingleContainer
    :data="props.data"
    v-bind="visSingleContainerBind"
    :class="cn(props.ui?.root)"
  >
    <slot />
  </VisSingleContainer>
</template>
