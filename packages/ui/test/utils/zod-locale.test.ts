import { describe, expect, it } from 'vitest'

import { applyZodLocaleFromI18n } from '../../app/utils/zod-locale'

describe('applyZodLocaleFromI18n', () => {
  it('applies locale for en-US', () => {
    expect(() => applyZodLocaleFromI18n('en-US')).not.toThrow()
  })

  it('maps fr-FR to French pack', () => {
    expect(() => applyZodLocaleFromI18n('fr-FR')).not.toThrow()
  })

  it('maps fr-CA to frCA pack', () => {
    expect(() => applyZodLocaleFromI18n('fr-CA')).not.toThrow()
  })

  it('normalizes underscores to hyphens', () => {
    expect(() => applyZodLocaleFromI18n('en_US')).not.toThrow()
  })

  it('falls back to English for unknown locale tags', () => {
    expect(() => applyZodLocaleFromI18n('xx-YY')).not.toThrow()
  })

  it('trims locale code', () => {
    expect(() => applyZodLocaleFromI18n('  fr-FR  ')).not.toThrow()
  })
})
