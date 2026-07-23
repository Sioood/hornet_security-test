import { describe, expect, it, vi } from 'vitest'

import { applyServerFieldErrors } from '../../app/utils/apply-server-field-errors'

const getUpdater = (spy: ReturnType<typeof vi.fn>, callIndex = 0) => {
  const call = spy.mock.calls[callIndex]
  if (!call) throw new Error('expected setFieldMeta call')
  return call[1] as (p: unknown) => Record<string, unknown>
}

describe('applyServerFieldErrors', () => {
  it('calls setFieldMeta with string message', () => {
    const setFieldMeta = vi.fn((_, updater) => updater({}))
    applyServerFieldErrors({ setFieldMeta }, { email: 'Invalid' })
    expect(setFieldMeta).toHaveBeenCalledWith('email', expect.any(Function))
    expect(getUpdater(setFieldMeta)({})).toEqual({ errors: ['Invalid'] })
  })

  it('supports string arrays', () => {
    const setFieldMeta = vi.fn((_, updater) => updater({}))
    applyServerFieldErrors({ setFieldMeta }, { email: ['a', 'b'] })
    expect(getUpdater(setFieldMeta)({})).toEqual({ errors: ['a', 'b'] })
  })

  it('skips undefined entries', () => {
    const setFieldMeta = vi.fn()
    applyServerFieldErrors({ setFieldMeta }, { email: undefined })
    expect(setFieldMeta).not.toHaveBeenCalled()
  })

  it('preserves existing meta properties when applying errors', () => {
    const setFieldMeta = vi.fn()
    applyServerFieldErrors({ setFieldMeta }, { name: 'Required' })
    const updater = getUpdater(setFieldMeta)
    const result = updater({ isDirty: false, isTouched: true })
    expect(result).toEqual({ errors: ['Required'], isDirty: false, isTouched: true })
  })

  it('handles multiple fields in one call', () => {
    const setFieldMeta = vi.fn()
    applyServerFieldErrors({ setFieldMeta }, { email: 'Bad email', password: 'Too short' })
    expect(setFieldMeta).toHaveBeenCalledTimes(2)
    expect(setFieldMeta).toHaveBeenCalledWith('email', expect.any(Function))
    expect(setFieldMeta).toHaveBeenCalledWith('password', expect.any(Function))
  })

  it('skips empty arrays', () => {
    const setFieldMeta = vi.fn()
    applyServerFieldErrors({ setFieldMeta }, { email: [] })
    expect(setFieldMeta).not.toHaveBeenCalled()
  })

  it('filters out empty strings from arrays', () => {
    const setFieldMeta = vi.fn()
    applyServerFieldErrors({ setFieldMeta }, { email: ['', 'Valid error', ''] })
    const updater = getUpdater(setFieldMeta)
    expect(updater({})).toEqual({ errors: ['Valid error'] })
  })

  it('handles prev being null or non-object gracefully', () => {
    const setFieldMeta = vi.fn()
    applyServerFieldErrors({ setFieldMeta }, { name: 'Err' })
    const updater = getUpdater(setFieldMeta)
    expect(updater(null)).toEqual({ errors: ['Err'] })
    expect(updater(undefined)).toEqual({ errors: ['Err'] })
  })
})
