<script setup lang="ts" generic="T extends Record<string, unknown> = Record<string, unknown>">
import { VisAxis } from '@unovis/vue'
import { computed } from 'vue'

import { buildChartAxisVisBind } from '@/utils/Components/Chart/axis'

import type { ChartAxisProps, ChartAxisType } from '@/utils/Components/Chart/context'
import type { AxisConfigInterface } from '@unovis/ts'

export type {
  ChartAxisProps,
  ChartAxisType,
  UIChartAxisSlots,
} from '@/utils/Components/Chart/context'

export interface ChartAxisComponentProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends ChartAxisProps<T> {
  type: ChartAxisType
}

const props = withDefaults(defineProps<ChartAxisComponentProps<T>>(), {
  show: true,
  ui: undefined,
})

const visAxisBind = computed((): AxisConfigInterface<T> => buildChartAxisVisBind(props, props.type))
</script>

<template>
  <VisAxis v-if="props.show" v-bind="visAxisBind" :class="cn(props.ui?.root)" />
</template>
