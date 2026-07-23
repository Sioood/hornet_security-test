<script setup lang="ts" generic="T extends Record<string, unknown>">
import {
  Orientation,
  Position,
  type ColorAccessor,
  type NumericAccessor,
  type StackedBarConfigInterface,
} from '@unovis/ts'
import { VisStackedBar } from '@unovis/vue'
import { computed } from 'vue'

import { buildChartCrosshairVisBind } from '@/utils/Components/Chart/crosshair'
import {
  buildChartStackedBarVisBind,
  pickChartStackedBarVisProps,
  type ChartStackedBarVisPassthrough,
} from '@/utils/Components/Chart/stacked-bar'
import {
  buildHorizontalStackedBarTooltipTriggers,
  buildStackedBarDefaultTooltip,
  type StackedBarCrosshairTemplate,
} from '@/utils/Components/Chart/stacked-bar-tooltip'
import { buildChartTooltipVisBind } from '@/utils/Components/Chart/tooltip'
import {
  chartLegendPlacementClasses,
  chartLegendCVA,
  chartThemeClasses,
} from '@/utils/Components/Chart/variants'

import type {
  ChartAxesConfig,
  ChartAxisProps,
  ChartCrosshairProps,
  ChartLegendSeries,
  ChartShellProps,
  ChartXYContainerProps,
  UIChartStackedBarSlots,
} from '@/utils/Components/Chart/context'

interface ChartStackedBarProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends ChartShellProps, ChartStackedBarVisPassthrough<T> {
  data?: T[]
  /** Required in app code; omitted only in Compodium preview (built-in demo fallback). */
  x?: NumericAccessor<T>
  y?: NumericAccessor<T>[]
  series?: ChartLegendSeries[]
  axis?: ChartAxesConfig<T>
  crosshair?: ChartCrosshairProps<T>
  ui?: Partial<UIChartStackedBarSlots>
  /** XY container passthrough (margin, domain, scale, …). `data` / `height` / `width` stay top-level. */
  container?: Omit<ChartXYContainerProps<T>, 'data' | 'ui'>
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ChartStackedBarProps<T>>(), {
  ariaLabel: undefined,
  axis: () => ({
    variant: 'dashed',
    x: { gridLine: true, show: true },
    y: { gridLine: true, show: true },
  }),
  container: undefined,
  crosshair: undefined,
  data: () => [],
  height: 450,
  intent: () => ({ axis: 'neutral', data: 'multicolor' }),
  legend: undefined,
  series: undefined,
  size: 'md',
  tooltip: undefined,
  ui: () => ({}),
  valueFormatter: undefined,
  width: undefined,
  x: undefined,
  y: undefined,
})

const stackedBarVisPassthrough = computed(() => pickChartStackedBarVisProps(props))

const axisXConfig = computed(
  (): ChartAxisProps<T> => ({
    show: true,
    ...props.axis?.x,
  }),
)

const axisYConfig = computed(
  (): ChartAxisProps<T> => ({
    show: true,
    ...props.axis?.y,
  }),
)

const resolvedSeries = computed((): ChartLegendSeries[] => {
  if (props.series?.length) {
    return props.series
  }
  return []
})

const xAccessor = computed((): NumericAccessor<T> | undefined => {
  if (props.x !== undefined) {
    return props.x
  }
  return undefined
})

const yAccessors = computed((): NumericAccessor<T>[] => {
  if (props.y?.length) {
    return props.y
  }
  return resolvedSeries.value.map((seriesItem) => (datum: T) => {
    const raw = datum[seriesItem.key]
    return typeof raw === 'number' ? raw : Number(raw) || 0
  })
})

const isChartReady = computed(
  () =>
    props.data?.length > 0 &&
    yAccessors.value.length > 0 &&
    xAccessor.value !== undefined &&
    xAccessor.value !== null,
)

const barColor = computed((): ColorAccessor<T> | string[] | undefined => {
  const passthroughColor = stackedBarVisPassthrough.value.color
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

const showCrosshairResolved = computed(() => props.crosshair?.show ?? true)

const showTooltipResolved = computed(() => props.tooltip?.show ?? true)

const themeClass = computed(() =>
  chartThemeClasses({
    axisVariant: props.axis?.variant,
    intent: typeof props.intent === 'object' ? props.intent.axis : props.intent,
    size: props.size,
  }),
)

const layoutClasses = computed(() =>
  chartLegendPlacementClasses({
    intent: typeof props.intent === 'object' ? props.intent.data : props.intent,
    placement: legendPlacement.value,
    size: props.size,
  }),
)

const rootClass = computed(() => cn(layoutClasses.value.root, themeClass.value, props.ui?.root))

const legendUi = computed(() => props.legend?.ui)

const containerUiClass = computed(() => cn(props.ui?.chart))

const stackedBarOrientation = computed(
  () => stackedBarVisPassthrough.value.orientation ?? Orientation.Vertical,
)

const isHorizontalStackedBar = computed(
  () => stackedBarOrientation.value === Orientation.Horizontal,
)

const showCrosshairOnChart = computed(
  () => showCrosshairResolved.value && !isHorizontalStackedBar.value,
)

const visStackedBarBind = computed(
  (): StackedBarConfigInterface<T> =>
    buildChartStackedBarVisBind({
      color: barColor.value,
      passthrough: {
        ...stackedBarVisPassthrough.value,
        orientation: stackedBarOrientation.value,
      },
      x: xAccessor.value!,
      y: yAccessors.value,
    }),
)

function formatValue(value: number, seriesItem: ChartLegendSeries): string {
  if (props.valueFormatter) {
    return props.valueFormatter(value, seriesItem)
  }
  return String(value)
}

const stackedBarTooltipTemplate = computed((): StackedBarCrosshairTemplate<T> => {
  if (props.crosshair?.template) {
    return props.crosshair.template
  }
  return (datum) =>
    buildStackedBarDefaultTooltip({
      datum,
      formatValue,
      series: resolvedSeries.value,
      xAccessor: xAccessor.value!,
    })
})

const chartCrosshairProps = computed(() => ({
  show: showCrosshairOnChart.value,
  ui: props.crosshair?.ui,
  ...buildChartCrosshairVisBind({
    ...props.crosshair,
    // Required when yStacked is set: Unovis treats any configured accessor as explicit and
    // skips XYContainer fallback x (see Crosshair.accessors getter + hasConfig).
    template: props.crosshair?.template ?? stackedBarTooltipTemplate.value,
    x: props.crosshair?.x ?? xAccessor.value,
    yStacked: props.crosshair?.yStacked ?? yAccessors.value,
  }),
}))

const chartTooltipProps = computed(() => {
  const horizontalTriggers =
    isHorizontalStackedBar.value && showTooltipResolved.value
      ? buildHorizontalStackedBarTooltipTriggers(stackedBarTooltipTemplate.value, {
          data: props.data ?? [],
          xAccessor: xAccessor.value!,
        })
      : undefined

  return {
    show: showTooltipResolved.value,
    ui: props.tooltip?.ui,
    ...buildChartTooltipVisBind({
      ...props.tooltip,
      followCursor: props.tooltip?.followCursor ?? isHorizontalStackedBar.value,
      horizontalPlacement: props.tooltip?.horizontalPlacement ?? Position.Center,
      triggers: props.tooltip?.triggers ?? horizontalTriggers,
      verticalShift: props.tooltip?.verticalShift ?? props.height,
    }),
  }
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

    <UIChartXYContainer
      v-if="isChartReady"
      :data
      :height
      :width
      :aria-label
      :ui="{ root: containerUiClass }"
      v-bind="props.container"
    >
      <VisStackedBar :orientation="stackedBarOrientation" v-bind="visStackedBarBind" />
      <UIChartCrosshair v-bind="chartCrosshairProps" />
      <UIChartTooltip v-bind="chartTooltipProps" />
      <UIChartAxis type="x" v-bind="axisXConfig" />
      <UIChartAxis type="y" v-bind="axisYConfig" />
    </UIChartXYContainer>

    <div
      v-else
      class="flex items-center justify-center border border-neutral-border-subtle bg-neutral-surface-subtle px-4 text-center text-neutral-text-subtle"
      :class="chartLegendCVA({ size: props.size })"
      :style="{ minHeight: `${props.height}px` }"
    >
      Provide <code class="font-mono">data</code>, <code class="font-mono">x</code>, and
      <code class="font-mono">series</code> or <code class="font-mono">y</code> to render the chart.
    </div>
  </div>
</template>
