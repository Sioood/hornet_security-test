<script setup lang="ts" generic="T extends Record<string, unknown> = Record<string, unknown>">
import { VisCrosshair } from '@unovis/vue'
import { computed } from 'vue'

import { buildChartCrosshairVisBind } from '@/utils/Components/Chart/crosshair'

import type { ChartCrosshairProps } from '@/utils/Components/Chart/context'

export type { ChartCrosshairProps, UIChartCrosshairSlots } from '@/utils/Components/Chart/context'

const props = withDefaults(defineProps<ChartCrosshairProps<T>>(), {
  show: true,
  ui: undefined,
})

const visCrosshairBind = computed(() => buildChartCrosshairVisBind(props))
</script>

<template>
  <VisCrosshair v-if="props.show" v-bind="visCrosshairBind" :class="cn(props.ui?.root)" />
</template>
