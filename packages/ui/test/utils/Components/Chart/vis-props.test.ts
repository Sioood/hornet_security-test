import { describe, expect, test } from 'vitest'

import { pickChartDonutVisProps } from '@/utils/Components/Chart/donut'

describe('pickChartDonutVisProps', () => {
  test('forwards Unovis keys from declared props (including arcWidth 0)', () => {
    const passthrough = pickChartDonutVisProps({
      arcWidth: 0,
      centralLabel: '100%',
      cornerRadius: 4,
      padAngle: 0.02,
    })

    expect(passthrough).toEqual({
      arcWidth: 0,
      centralLabel: '100%',
      cornerRadius: 4,
      padAngle: 0.02,
    })
  })
})
