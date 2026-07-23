import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import QRCode from '~ui/app/components/QRCode.vue'

/** Satisfy Ark download-trigger prop types in tests (defaults match the component). */
const downloadDefaults = {
  fileName: 'qr-code.png',
  mimeType: 'image/png',
} as const

describe('QRCode', () => {
  it('renders root and SVG frame with layout classes', async () => {
    const wrapper = await mountSuspended(QRCode, {
      props: { ...downloadDefaults, ui: { frame: 'qrCodeFrame', root: 'qrCodeRoot' } },
    })

    const root = wrapper.find('.qrCodeRoot')
    expect(root.exists()).toBe(true)
    expect(root.classes().join(' ')).toMatch(/text-neutral-surface/)

    const frame = wrapper.find('.qrCodeFrame')
    expect(frame.exists()).toBe(true)
    expect(frame.element.tagName.toLowerCase()).toBe('svg')
    expect(frame.classes().join(' ')).toMatch(/bg-neutral-fill-subtle/)
  })

  it('applies intent variants on root and frame', async () => {
    const wrapper = await mountSuspended(QRCode, {
      props: {
        ...downloadDefaults,
        intent: 'primary',
        ui: { frame: 'qrCodeFrame', root: 'qrCodeRoot' },
      },
    })

    expect(wrapper.find('.qrCodeRoot').classes().join(' ')).toMatch(/text-primary-surface/)
    expect(wrapper.find('.qrCodeFrame').classes().join(' ')).toMatch(/bg-primary-fill-subtle/)
  })

  it('renders a QR pattern path inside the frame', async () => {
    const wrapper = await mountSuspended(QRCode, {
      props: {
        ...downloadDefaults,
        modelValue: 'https://example.com/test',
        ui: { frame: 'qrCodeFrame', root: 'qrCodeRoot' },
      },
    })

    const path = wrapper.find('.qrCodeFrame path')
    expect(path.exists()).toBe(true)
    expect(path.attributes('d')).toMatch(/^M/)
  })

  it('does not render a download control when downloadable is false', async () => {
    const wrapper = await mountSuspended(QRCode, {
      props: { ...downloadDefaults, downloadable: false },
    })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders a download button when downloadable is true', async () => {
    const wrapper = await mountSuspended(QRCode, {
      props: { ...downloadDefaults, downloadable: true },
    })

    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.text().length).toBeGreaterThan(0)
  })

  it('merges ui slot classes', async () => {
    const wrapper = await mountSuspended(QRCode, {
      props: {
        ...downloadDefaults,
        ui: {
          frame: 'custom-qr-frame',
          root: 'custom-qr-root',
        },
      },
    })

    expect(wrapper.find('.custom-qr-root').exists()).toBe(true)
    expect(wrapper.find('.custom-qr-frame').exists()).toBe(true)
  })
})
