import { describe, expect, it } from 'vitest'

import { layoutRowKeys } from '~ui/app/utils/Components/Form/schema'

describe('layoutRowKeys', () => {
  it('wraps a single string key', () => {
    expect(layoutRowKeys('email')).toEqual(['email'])
  })

  it('copies array keys', () => {
    expect(layoutRowKeys(['a', 'b'])).toEqual(['a', 'b'])
  })

  it('copies readonly tuple keys without mutating the source', () => {
    const row = ['x', 'y'] as const
    const out = layoutRowKeys(row)
    expect(out).toEqual(['x', 'y'])
    expect(out).not.toBe(row as unknown as string[])
  })
})
