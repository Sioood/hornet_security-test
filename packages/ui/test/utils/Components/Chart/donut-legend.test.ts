import { describe, expect, it } from 'vitest'

import {
  resolveDonutLegendSeries,
  resolveDonutNumericValue,
  sumDonutValues,
} from '~ui/app/utils/Components/Chart/donut-legend'

describe('resolveDonutLegendSeries', () => {
  it('returns explicit series when provided', () => {
    const series = [{ color: 'red', key: 'a', label: 'Alpha' }]
    expect(
      resolveDonutLegendSeries({
        data: [{ value: 1 }],
        series,
      }),
    ).toEqual(series)
  })

  it('auto-builds from label accessor', () => {
    expect(
      resolveDonutLegendSeries({
        data: [
          { id: 'desktop', label: 'Desktop', value: 42 },
          { id: 'mobile', label: 'Mobile', value: 35 },
        ],
        label: (d) => d.label,
      }),
    ).toEqual([
      { color: undefined, key: 'desktop', label: 'Desktop' },
      { color: undefined, key: 'mobile', label: 'Mobile' },
    ])
  })

  it('infers label from datum.label when no accessor', () => {
    expect(
      resolveDonutLegendSeries({
        data: [{ label: 'Streaming', value: 10 }],
      }),
    ).toEqual([{ color: undefined, key: 'Streaming', label: 'Streaming' }])
  })
})

describe('resolveDonutNumericValue', () => {
  it('reads numeric fields via accessor', () => {
    const value = (d: { value: number }) => d.value
    expect(resolveDonutNumericValue({ value: 12 }, 0, value)).toBe(12)
  })
})

describe('sumDonutValues', () => {
  it('sums all segment values', () => {
    const data = [{ value: 10 }, { value: 25 }, { value: 5 }]
    expect(sumDonutValues(data, (d) => d.value)).toBe(40)
  })
})
