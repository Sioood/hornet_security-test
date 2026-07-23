import type { ChartLegendSeries } from '@/utils/Components/Chart/context'
import type { ColorAccessor, NumericAccessor, StringAccessor } from '@unovis/ts'

function resolveAccessorString<T>(
  accessor: StringAccessor<T> | undefined,
  datum: T,
  index: number,
): string | undefined {
  if (accessor === undefined) {
    return undefined
  }
  if (typeof accessor === 'function') {
    const result = accessor(datum, index)
    return result ?? undefined
  }
  return accessor
}

function inferDatumLabel<T>(datum: T, index: number): string {
  if (typeof datum === 'object' && datum !== null) {
    const record = datum as Record<string, unknown>
    if (typeof record.label === 'string') {
      return record.label
    }
    if (typeof record.name === 'string') {
      return record.name
    }
  }
  return `Item ${index + 1}`
}

function resolveSeriesKey<T>(datum: T, index: number, label: string): string {
  if (typeof datum === 'object' && datum !== null) {
    const record = datum as Record<string, unknown>
    if (typeof record.key === 'string') {
      return record.key
    }
    if (typeof record.id === 'string' || typeof record.id === 'number') {
      return String(record.id)
    }
  }
  return label || String(index)
}

export function resolveDonutLegendSeries<T>(options: {
  data: T[]
  label?: StringAccessor<T>
  series?: ChartLegendSeries[]
  color?: ColorAccessor<T>
}): ChartLegendSeries[] {
  const { data, label, series, color } = options
  if (series?.length) {
    return series
  }

  return data.map((datum, index) => {
    const resolvedLabel =
      resolveAccessorString(label, datum, index) ?? inferDatumLabel(datum, index)
    const key = resolveSeriesKey(datum, index, resolvedLabel)
    let segmentColor: string | undefined
    if (typeof color === 'function') {
      segmentColor = color(datum, index) ?? undefined
    } else if (typeof color === 'string') {
      segmentColor = color
    } else if (Array.isArray(color)) {
      segmentColor = color[index]
    }
    return {
      color: segmentColor,
      key,
      label: resolvedLabel,
    }
  })
}

export function resolveDonutNumericValue<T>(
  datum: T,
  index: number,
  valueAccessor: NumericAccessor<T>,
): number {
  if (typeof valueAccessor === 'function') {
    const raw = valueAccessor(datum, index)
    return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0
  }
  if (typeof valueAccessor === 'number' && Number.isFinite(valueAccessor)) {
    return valueAccessor
  }
  return 0
}

export function sumDonutValues<T>(data: T[], valueAccessor: NumericAccessor<T>): number {
  let total = 0
  for (let index = 0; index < data.length; index++) {
    total += resolveDonutNumericValue(data[index]!, index, valueAccessor)
  }
  return total
}
