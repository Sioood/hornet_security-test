import { Donut } from '@unovis/ts'
import { describe, expect, it } from 'vitest'

import {
  buildDonutDefaultTooltip,
  buildDonutTooltipTriggers,
} from '~ui/app/utils/Components/Chart/donut-tooltip'

describe('buildDonutDefaultTooltip', () => {
  it('includes label, value, and percent', () => {
    const html = buildDonutDefaultTooltip({
      data: [
        { label: 'A', value: 25 },
        { label: 'B', value: 75 },
      ],
      datum: { label: 'A', value: 25 },
      formatValue: (value) => String(value),
      index: 0,
      series: [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B' },
      ],
      valueAccessor: (d: { value: number }) => d.value,
    })

    expect(html).toContain('A')
    expect(html).toContain('25')
    expect(html).toContain('25%')
  })
})

describe('buildDonutTooltipTriggers', () => {
  it('uses Donut segment selector', () => {
    const triggers = buildDonutTooltipTriggers(
      (datum: { label: string }) => datum.label,
      [{ label: 'Test', value: 1 }],
    )

    expect(Object.keys(triggers)).toEqual([Donut.selectors.segment])
  })
})
