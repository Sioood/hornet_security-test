import { Donut, type NumericAccessor, type TooltipConfigInterface } from '@unovis/ts'

import { resolveDonutNumericValue, sumDonutValues } from '@/utils/Components/Chart/donut-legend'

import type { ChartLegendSeries } from '@/utils/Components/Chart/context'

export type DonutTooltipTemplate<T> = (datum: T, index: number, data: T[]) => string | HTMLElement

function formatPercent(value: number, total: number): string {
  if (total <= 0) {
    return '0%'
  }
  return `${Math.round((value / total) * 100)}%`
}

export function buildDonutDefaultTooltip<T>(options: {
  datum: T
  index: number
  data: T[]
  series: ChartLegendSeries[]
  valueAccessor: NumericAccessor<T>
  formatValue: (value: number, seriesItem: ChartLegendSeries) => string
}): string {
  const { datum, index, data, series, valueAccessor, formatValue } = options
  const seriesItem = series[index] ?? {
    key: String(index),
    label: `Item ${index + 1}`,
  }
  const value = resolveDonutNumericValue(datum, index, valueAccessor)
  const total = sumDonutValues(data, valueAccessor)
  const color = seriesItem.color ?? `var(--vis-color${index})`
  const label = formatValue(value, seriesItem)
  const percent = formatPercent(value, total)

  return `<div class="max-w-[90vw] flex flex-col items-start gap-1"><span class="flex flex-wrap items-center gap-1"><span style="display:inline-block;width:0.625rem;height:0.625rem;background:${color}"></span><b>${seriesItem.label}</b>: ${label} (${percent})</span></div>`
}

export function buildDonutTooltipTriggers<T>(
  template: DonutTooltipTemplate<T>,
  data: T[],
): NonNullable<TooltipConfigInterface['triggers']> {
  return {
    [Donut.selectors.segment]: (datum: T, index: number) => template(datum, index, data),
  }
}
