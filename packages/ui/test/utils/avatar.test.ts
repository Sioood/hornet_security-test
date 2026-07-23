import { describe, expect, it } from 'vitest'

import {
  getAnonymousAvatarFallbackText,
  getAvatarSeedFromName,
  getDiceBearNotionistsUrl,
  getInitialsFromName,
} from '../../app/utils/avatar'

describe('avatar utils', () => {
  it('builds DiceBear notionists svg url with encoded seed', () => {
    expect(getDiceBearNotionistsUrl('Ada Lovelace')).toBe(
      'https://api.dicebear.com/9.x/notionists/svg?seed=Ada%20Lovelace',
    )
  })

  it('initials from first and last word', () => {
    expect(getInitialsFromName('Ada Lovelace')).toBe('AL')
    expect(getInitialsFromName('Madonna')).toBe('M')
    expect(getInitialsFromName('  a   b   c  ')).toBe('AC')
  })

  it('empty name yields empty initials and seed', () => {
    expect(getInitialsFromName('')).toBe('')
    expect(getInitialsFromName(undefined)).toBe('')
    expect(getAvatarSeedFromName('  ')).toBe('')
  })

  it('anonymous fallback is ??', () => {
    expect(getAnonymousAvatarFallbackText()).toBe('??')
  })
})
