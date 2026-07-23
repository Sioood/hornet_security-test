import { describe, expect, it } from 'vitest'

import { buttonCVA as button, toggleCVA } from '../../app/utils/Components/Button/variants'

describe('buttonVariants', () => {
  it('returns base classes', () => {
    const result = button({ disabled: false, intent: 'primary', size: 'md', variant: 'default' })
    expect(result).toContain('inline-flex')
    expect(result).toContain('justify-center')
  })

  it('applies ghost variant base classes', () => {
    const result = button({ intent: 'primary', variant: 'ghost' })
    expect(result).toContain('border-transparent')
  })

  it('applies size classes', () => {
    const sm = button({ size: 'sm' })
    expect(sm).toContain('txt-caption')
    expect(sm).toContain('px-2')

    const md = button({ size: 'md' })
    expect(md).toContain('txt-base')
    expect(md).toContain('px-4')

    const lg = button({ size: 'lg' })
    expect(lg).toContain('txt-h6')
    expect(lg).toContain('px-5')
  })

  it('applies disabled state classes', () => {
    const disabled = button({ disabled: true })
    expect(disabled).toContain('cursor-not-allowed')

    const enabled = button({ disabled: false })
    expect(enabled).toContain('cursor-pointer')
  })

  it('generates compound variant for default + primary intent', () => {
    const result = button({ intent: 'primary', variant: 'default' })
    expect(result).toContain('bg-primary-fill')
    expect(result).toContain('border-primary-border')
    expect(result).toContain('text-primary-on-fill')
    expect(result).toContain('disabled:opacity-40')
  })

  it('generates compound variant for subtle + error intent', () => {
    const result = button({ intent: 'error', variant: 'subtle' })
    expect(result).toContain('bg-error-fill-subtle')
    expect(result).toContain('border-error-border-subtle')
    expect(result).toContain('text-error-text-subtle')
  })

  it('generates compound variant for ghost + accent intent', () => {
    const result = button({ intent: 'accent', variant: 'ghost' })
    expect(result).toContain('bg-transparent')
    expect(result).toContain('text-accent-text-subtle')
  })
})

describe('toggleCVA', () => {
  it('applies pressed state classes for default + primary', () => {
    const result = toggleCVA({ intent: 'primary', variant: 'default' })
    expect(result).toContain('data-[state=on]:bg-primary-fill-active')
    expect(result).toContain('data-[state=on]:border-primary-border-active')
  })

  it('applies pressed state classes for ghost + success', () => {
    const result = toggleCVA({ intent: 'success', variant: 'ghost' })
    expect(result).toContain('data-[state=on]:bg-success-fill-subtle-active')
  })
})
