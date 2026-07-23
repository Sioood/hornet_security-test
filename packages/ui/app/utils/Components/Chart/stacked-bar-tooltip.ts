import { StackedBar, type NumericAccessor, type TooltipConfigInterface } from '@unovis/ts'

import type { ChartLegendSeries } from '@/utils/Components/Chart/context'

// oxlint-disable-next-line max-params
export type StackedBarCrosshairTemplate<T extends Record<string, unknown>> = (
  datum: T,
  x: number | Date,
  data: T[],
  leftNearestDatumIndex?: number,
) => string | HTMLElement

function resolveStackedBarXLabel<T extends Record<string, unknown>>(
  datum: T,
  xAccessor: NumericAccessor<T>,
  index = 0,
): string | number {
  if (typeof xAccessor === 'function') {
    return xAccessor(datum, index) ?? ''
  }
  return xAccessor ?? ''
}

export function buildStackedBarDefaultTooltip<T extends Record<string, unknown>>(options: {
  datum: T
  xAccessor: NumericAccessor<T>
  series: ChartLegendSeries[]
  formatValue: (value: number, seriesItem: ChartLegendSeries) => string
}): string {
  const { datum, xAccessor, series, formatValue } = options
  const xLabel = resolveStackedBarXLabel(datum, xAccessor)
  const activeSeries = series
    .filter((seriesItem) => {
      const raw = datum[seriesItem.key]
      const value = typeof raw === 'number' ? raw : Number(raw) || 0
      return value > 0
    })
    .toReversed()

  const rows = activeSeries
    .map((seriesItem) => {
      const raw = datum[seriesItem.key]
      const value = typeof raw === 'number' ? raw : Number(raw) || 0
      const seriesIndex = series.indexOf(seriesItem)
      const color = seriesItem.color ?? `var(--vis-color${seriesIndex})`
      const label = formatValue(value, seriesItem)
      return `<span class="flex flex-wrap items-center gap-1"><span style="display:inline-block;width:0.625rem;height:0.625rem;background:${color}"></span>${seriesItem.label}: ${label}</span>`
    })
    .join(' ')

  return `<div class="max-w-[90vw] flex flex-col items-start gap-1"><b>${xLabel} ${rows ? `: ${rows}` : ''}</b></div>`
}

/** Unovis crosshair is vertical (X-snapped) only; use bar-row tooltip triggers when horizontal. */
export function buildHorizontalStackedBarTooltipTriggers<T extends Record<string, unknown>>(
  template: StackedBarCrosshairTemplate<T>,
  options: { data: T[]; xAccessor: NumericAccessor<T> },
): NonNullable<TooltipConfigInterface['triggers']> {
  return {
    [StackedBar.selectors.barGroup]: (datum: T, index: number) => {
      const xLabel = resolveStackedBarXLabel(datum, options.xAccessor, index)
      const xValue = typeof xLabel === 'number' ? xLabel : Number(xLabel)
      const x = Number.isFinite(xValue) ? xValue : xLabel
      return template(datum, x, options.data, index)
    },
  }
}
