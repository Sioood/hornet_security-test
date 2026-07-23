<script setup lang="ts">
import { computed } from 'vue'

import { parseChartLegendPlacement } from '@/utils/Components/Chart/legend-placement'
import { chartLegendCVA } from '@/utils/Components/Chart/variants'

import type {
  ChartLegendPlacement,
  ChartSize,
  ChartLegendSeries,
  UIChartLegendSlots,
} from '@/utils/Components/Chart/context'

export type {
  ChartLegendPlacement,
  ChartLegendSeries,
  UIChartLegendSlots,
} from '@/utils/Components/Chart/context'

export interface ChartLegendComponentProps {
  series: ChartLegendSeries[]
  placement?: ChartLegendPlacement
  size?: ChartSize
  show?: boolean
  ui?: Partial<UIChartLegendSlots>
}

const props = withDefaults(defineProps<ChartLegendComponentProps>(), {
  placement: 'top-center',
  show: true,
  size: 'md',
  ui: undefined,
})

const placementKey = computed((): ChartLegendPlacement => {
  const { side, align } = parseChartLegendPlacement(props.placement)
  return align === 'center' ? side : `${side}-${align}`
})

const legendClass = computed(() =>
  cn(chartLegendCVA({ legendPlacement: placementKey.value, size: props.size }), props.ui?.root),
)

function legendSwatchStyle(color: string | undefined, index: number): { backgroundColor: string } {
  return { backgroundColor: color ?? `var(--vis-color${index})` }
}
</script>

<template>
  <div
    v-if="props.show && props.series.length > 0"
    :class="legendClass"
    role="list"
    aria-label="Chart legend"
  >
    <span
      v-for="(seriesItem, index) in props.series"
      :key="seriesItem.key"
      role="listitem"
      :class="cn('inline-flex items-center gap-1.5 text-neutral-text', props.ui?.item)"
    >
      <span
        :class="cn('size-2.5 shrink-0', props.ui?.swatch)"
        :style="legendSwatchStyle(seriesItem.color, index)"
        aria-hidden="true"
      />
      <slot name="label" :series-item="seriesItem" :index="index">
        {{ seriesItem.label }}
      </slot>
    </span>
  </div>
</template>
