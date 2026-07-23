import { cva } from 'class-variance-authority'
import { describe, expect, it } from 'vitest'

import { cn } from '../../app/utils/cn'

const padded = cva('block', {
  defaultVariants: { size: 'sm' },
  variants: {
    size: {
      md: 'p-4',
      sm: 'p-2',
    },
  },
})

describe('cn', () => {
  it('merges conflicting Tailwind utilities with last argument winning', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('merges CVA output with overrides', () => {
    const base = padded({ size: 'sm' })
    expect(cn(base, 'p-4')).toBe('block p-4')
  })

  it('normalizes Vue class values', () => {
    expect(cn(['foo', 'bar'], { baz: true, qux: false })).toBe('foo bar baz')
  })

  it('returns empty string when no classes', () => {
    expect(cn()).toBe('')
  })

  it('handles undefined and null inputs gracefully', () => {
    expect(cn(undefined, null, 'valid')).toBe('valid')
  })

  it('handles empty string inputs', () => {
    expect(cn('', 'foo', '')).toBe('foo')
  })

  it('merges responsive variants correctly', () => {
    expect(cn('md:p-2', 'md:p-4')).toBe('md:p-4')
  })

  it('preserves non-conflicting classes from different categories', () => {
    expect(cn('text-red-500', 'bg-blue-500', 'p-4')).toBe('text-red-500 bg-blue-500 p-4')
  })

  it('handles deeply nested Vue array class values', () => {
    expect(cn([['a', 'b'], ['c']])).toBe('a b c')
  })
})
