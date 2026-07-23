import { describe, expect, it } from 'vitest'

import { getMessagesWithNamespace, prefixKeys } from '../../../i18n/utils/namespace'

describe('prefixKeys', () => {
  it('adds namespace prefix to all keys', () => {
    const result = prefixKeys('myNs', { baz: 'qux', foo: 'bar' })
    expect(result).toEqual({
      'myNs:baz': 'qux',
      'myNs:foo': 'bar',
    })
  })

  it('handles empty object', () => {
    const result = prefixKeys('ns', {})
    expect(result).toEqual({})
  })

  it('preserves values unchanged', () => {
    const result = prefixKeys('a', { key: 'value with spaces' })
    expect(result['a:key']).toBe('value with spaces')
  })
})

describe('getMessagesWithNamespace', () => {
  it('merges translations without prefix', async () => {
    const messages = await getMessagesWithNamespace({
      translations: async () => ({ hello: 'Hello', world: 'World' }),
    })
    expect(messages).toEqual({ hello: 'Hello', world: 'World' })
  })

  it('adds namespace prefix to non-translations', async () => {
    const messages = await getMessagesWithNamespace({
      myNs: async () => ({ foo: 'bar' }),
    })
    expect(messages).toEqual({ 'myNs:foo': 'bar' })
  })

  it('merges multiple namespaces correctly', async () => {
    const messages = await getMessagesWithNamespace({
      layout: async () => ({ header: 'Top' }),
      translations: async () => ({ global: 'value' }),
      ui: async () => ({ button: 'Click' }),
    })
    expect(messages).toEqual({
      global: 'value',
      'layout:header': 'Top',
      'ui:button': 'Click',
    })
  })

  it('handles default export wrapper', async () => {
    const messages = await getMessagesWithNamespace({
      myNs: async () => ({ default: { key: 'value' } }),
    })
    expect(messages).toEqual({ 'myNs:key': 'value' })
  })

  it('throws on invalid default export', async () => {
    await expect(
      getMessagesWithNamespace({
        badNs: async () =>
          ({ default: 'not an object' }) as unknown as { default: Record<string, string> },
      }),
    ).rejects.toThrow('invalid default export')
  })

  it('handles empty namespace messages', async () => {
    const messages = await getMessagesWithNamespace({
      emptyNs: async () => ({}),
    })
    expect(messages).toEqual({})
  })
})
