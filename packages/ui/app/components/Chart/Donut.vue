<script setup lang="ts" generic="T">
import {
  type ColorAccessor,
  type DonutConfigInterface,
  type NumericAccessor,
  type StringAccessor,
} from '@unovis/ts'
import { VisDonut } from '@unovis/vue'
import { computed } from 'vue'

import {
  buildChartDonutVisBind,
  pickChartDonutVisProps,
  type ChartDonutVisPassthrough,
} from '@/utils/Components/Chart/donut'
import { resolveDonutLegendSeries } from '@/utils/Components/Chart/donut-legend'
import {
  buildDonutDefaultTooltip,
  buildDonutTooltipTriggers,
  type DonutTooltipTemplate,
} from '@/utils/Components/Chart/donut-tooltip'
import { buildChartTooltipVisBind } from '@/utils/Components/Chart/tooltip'
import {
  chartDonutThemeClasses,
  chartLegendCVA,
  chartLegendPlacementClasses,
} from '@/utils/Components/Chart/variants'

import type {
  ChartIntent,
  ChartLegendSeries,
  ChartShellProps,
  ChartSingleContainerProps,
  UIChartDonutSlots,
} from '@/utils/Components/Chart/context'

interface ChartDonutProps extends Omit<ChartShellProps, 'intent'>, ChartDonutVisPassthrough<T> {
  data?: T[]
  /** Required in app code; omitted only in Compodium preview (built-in demo fallback). */
  value?: NumericAccessor<T>
  label?: StringAccessor<T>
  series?: ChartLegendSeries[]
  intent?: ChartIntent | { data: ChartIntent }
  tooltipTemplate?: DonutTooltipTemplate<T>
  ui?: Partial<UIChartDonutSlots>
  /** Single container passthrough (margin, padding, sizing, …). `data` / `height` / `width` stay top-level. */
  container?: Omit<ChartSingleContainerProps<T>, 'data' | 'ui'>
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ChartDonutProps>(), {
  ariaLabel: undefined,
  container: undefined,
  data: () => [],
  height: 300,
  intent: () => ({ data: 'multicolor' }),
  label: undefined,
  legend: undefined,
  series: undefined,
  size: 'md',
  tooltip: undefined,
  tooltipTemplate: undefined,
  ui: () => ({}),
  value: undefined,
  valueFormatter: undefined,
  width: undefined,
})

const donutVisPassthrough = computed(() => pickChartDonutVisProps(props))

const valueAccessor = computed((): NumericAccessor<T> | undefined => props.value)

const isChartReady = computed(
  () => (props.data?.length ?? 0) > 0 && valueAccessor.value !== undefined,
)

const resolvedSeries = computed((): ChartLegendSeries[] =>
  resolveDonutLegendSeries({
    color: donutVisPassthrough.value.color,
    data: props.data ?? [],
    label: props.label,
    series: props.series,
  }),
)

const barColor = computed((): ColorAccessor<T> | undefined => {
  const passthroughColor = donutVisPassthrough.value.color
  if (passthroughColor !== undefined && passthroughColor !== null) {
    return passthroughColor
  }
  if (resolvedSeries.value.length === 0) {
    return undefined
  }
  return resolvedSeries.value.map(
    (seriesItem, index) => seriesItem.color ?? `var(--vis-color${index})`,
  )
})

const showLegendResolved = computed(() => props.legend?.show ?? false)

const legendPlacement = computed(() => props.legend?.placement ?? 'top-center')

const showTooltipResolved = computed(() => props.tooltip?.show ?? true)

const chartIntent = computed(
  (): ChartIntent => (typeof props.intent === 'object' ? props.intent.data : props.intent),
)

const themeClass = computed(() =>
  chartDonutThemeClasses({
    intent: chartIntent.value,
    size: props.size,
  }),
)

const layoutClasses = computed(() =>
  chartLegendPlacementClasses({
    intent: chartIntent.value,
    placement: legendPlacement.value,
    size: props.size,
  }),
)

const rootClass = computed(() => cn(layoutClasses.value.root, themeClass.value, props.ui?.root))

const legendUi = computed(() => props.legend?.ui)

const containerUiClass = computed(() => cn(props.ui?.chart))

const visDonutBind = computed(
  (): DonutConfigInterface<T> =>
    buildChartDonutVisBind({
      color: barColor.value,
      passthrough: donutVisPassthrough.value,
      value: valueAccessor.value!,
    }),
)

function formatValue(value: number, seriesItem: ChartLegendSeries): string {
  if (props.valueFormatter) {
    return props.valueFormatter(value, seriesItem)
  }
  return String(value)
}

const donutTooltipTemplate = computed((): DonutTooltipTemplate<T> => {
  if (props.tooltipTemplate) {
    return props.tooltipTemplate
  }
  return (datum, index, data) =>
    buildDonutDefaultTooltip({
      data,
      datum,
      formatValue,
      index,
      series: resolvedSeries.value,
      valueAccessor: valueAccessor.value!,
    })
})

const chartTooltipProps = computed(() => {
  const data = props.data ?? []
  const defaultTriggers = showTooltipResolved.value
    ? buildDonutTooltipTriggers(donutTooltipTemplate.value, data)
    : undefined

  return {
    show: showTooltipResolved.value,
    ui: props.tooltip?.ui,
    ...buildChartTooltipVisBind({
      ...props.tooltip,
      triggers: props.tooltip?.triggers ?? defaultTriggers,
    }),
  }
})

extendCompodiumMeta({
  data: [
    { label: 'Desktop', value: 42 },
    { label: 'Mobile', value: 35 },
    { label: 'Tablet', value: 23 },
  ],
  value: (d: { value: number }) => d.value,
})
</script>

<template>
  <div :class="rootClass">
    <UIChartLegend
      :series="resolvedSeries"
      :placement="legendPlacement"
      :size
      :show="showLegendResolved"
      :ui="legendUi"
    />

    <slot name="legend" :series="resolvedSeries" />

    <UIChartSingleContainer
      v-if="isChartReady"
      :data
      :height
      :width
      :aria-label
      :ui="{ root: containerUiClass }"
      v-bind="props.container"
    >
      <VisDonut v-bind="visDonutBind" />
      <UIChartTooltip v-bind="chartTooltipProps" />
    </UIChartSingleContainer>

    <div
      v-else
      class="flex items-center justify-center border border-neutral-border-subtle bg-neutral-surface-subtle px-4 text-center text-neutral-text-subtle"
      :class="chartLegendCVA({ size: props.size })"
      :style="{ minHeight: `${props.height}px` }"
    >
      Provide <code class="font-mono">data</code> and <code class="font-mono">value</code> to render
      the chart.
    </div>
  </div>
</template>
