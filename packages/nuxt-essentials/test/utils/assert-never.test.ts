import { describe, expect, it } from 'vitest'

import { assertNever } from '../../app/utils/assert-never'

describe('assertNever', () => {
  it('throws with JSON representation of the value', () => {
    expect(() => assertNever('unexpected' as never)).toThrow(
      'Unhandled discriminated union member: "unexpected"',
    )
  })

  it('throws with custom message when provided', () => {
    expect(() => assertNever(42 as never, 'Custom error')).toThrow('Custom error')
  })

  it('provides compile-time exhaustiveness for discriminated unions', () => {
    type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; side: number }

    function area(shape: Shape): number {
      switch (shape.kind) {
        case 'circle':
          return Math.PI * shape.radius ** 2
        case 'square':
          return shape.side ** 2
        default:
          assertNever(shape)
      }
    }

    expect(area({ kind: 'circle', radius: 1 })).toBeCloseTo(Math.PI)
    expect(area({ kind: 'square', side: 2 })).toBe(4)
  })
})
