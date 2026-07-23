<script setup lang="ts">
import { Position } from '@unovis/ts'
import { VisTooltip } from '@unovis/vue'
import { computed } from 'vue'

import { buildChartTooltipVisBind } from '@/utils/Components/Chart/tooltip'

import type { ChartTooltipProps } from '@/utils/Components/Chart/context'

export type { ChartTooltipProps, UIChartTooltipSlots } from '@/utils/Components/Chart/context'

const props = withDefaults(defineProps<ChartTooltipProps>(), {
  horizontalPlacement: Position.Center,
  show: true,
  ui: undefined,
})

const visTooltipBind = computed(() => buildChartTooltipVisBind(props))
</script>

<template>
  <VisTooltip v-if="props.show" v-bind="visTooltipBind" :class="cn(props.ui?.root)" />
</template>
