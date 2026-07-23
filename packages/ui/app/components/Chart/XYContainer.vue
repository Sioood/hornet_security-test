<script setup lang="ts" generic="T extends Record<string, unknown> = Record<string, unknown>">
import { VisXYContainer } from '@unovis/vue'
import { computed } from 'vue'

import { buildChartXYContainerVisBind } from '@/utils/Components/Chart/xy-container'

import type { ChartXYContainerProps } from '@/utils/Components/Chart/context'

export type {
  ChartXYContainerProps,
  UIChartXYContainerSlots,
} from '@/utils/Components/Chart/context'

const props = withDefaults(defineProps<ChartXYContainerProps<T>>(), {
  data: undefined,
  ui: undefined,
})

const visXYContainerBind = computed(() => buildChartXYContainerVisBind(props))
</script>

<template>
  <VisXYContainer :data="props.data" v-bind="visXYContainerBind" :class="cn(props.ui?.root)">
    <slot />
  </VisXYContainer>
</template>
