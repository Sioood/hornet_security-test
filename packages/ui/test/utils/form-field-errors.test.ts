import { describe, expect, it } from 'vitest'

import { formatFieldErrors } from '../../app/utils/form-field-errors'

describe('formatFieldErrors', () => {
  it('joins string errors', () => {
    expect(formatFieldErrors(['a', 'b'])).toBe('a, b')
  })

  it('extracts message from objects', () => {
    expect(formatFieldErrors([{ message: 'x' }, { message: 'y' }])).toBe('x, y')
  })

  it('flattens nested arrays', () => {
    expect(formatFieldErrors([['a', ['b']]])).toBe('a, b')
  })

  it('returns empty string for empty input', () => {
    expect(formatFieldErrors([])).toBe('')
  })

  it('dedupes identical messages (e.g. form onChange + onBlur)', () => {
    expect(formatFieldErrors(['Too short', 'Too short'])).toBe('Too short')
    expect(formatFieldErrors([{ message: 'x' }, { message: 'x' }, { message: 'y' }])).toBe('x, y')
  })

  it('skips nullish entries in the error list', () => {
    expect(formatFieldErrors([null, undefined, 'ok'])).toBe('ok')
  })

  it('ignores objects whose message is not a string', () => {
    expect(formatFieldErrors([{ message: 123 }, { message: 'ok' }])).toBe('ok')
  })
})
