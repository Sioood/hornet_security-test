import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import UIProgressCircular from '~ui/app/components/Progress/Circular.vue'
import UIProgress from '~ui/app/components/Progress/index.vue'

describe('UIProgress', () => {
  it('renders the label', async () => {
    const wrapper = await mountSuspended(UIProgress, {
      props: { label: 'Loading' },
    })

    expect(wrapper.text()).toContain('Loading')
  })

  it('renders the value text', async () => {
    const wrapper = await mountSuspended(UIProgress, {
      props: { modelValue: 50 },
    })

    expect(wrapper.text()).toMatch(/50\s*%/)
  })

  it('sets data-state="indeterminate" when modelValue is undefined', async () => {
    const wrapper = await mountSuspended(UIProgress)

    const root = wrapper.find('[data-part="root"]')
    expect(root.attributes('data-state')).toBe('indeterminate')
  })

  it('applies intent classes', async () => {
    const intents = ['primary', 'secondary', 'accent'] as const
    for (const intent of intents) {
      const wrapper = await mountSuspended(UIProgress, {
        props: { intent },
      })
      const label = wrapper.find('[data-part="label"]')
      expect(label.classes().some((c) => c.includes(intent))).toBe(true)
    }
  })
})

describe('UIProgressCircular', () => {
  it('renders the label', async () => {
    const wrapper = await mountSuspended(UIProgressCircular, {
      props: { label: 'Processing' },
    })

    expect(wrapper.text()).toContain('Processing')
  })

  it('renders the value text', async () => {
    const wrapper = await mountSuspended(UIProgressCircular, {
      props: { modelValue: 75 },
    })

    expect(wrapper.text()).toMatch(/75\s*%/)
  })

  it('sets data-state="indeterminate" when modelValue is undefined', async () => {
    const wrapper = await mountSuspended(UIProgressCircular, {
      props: { modelValue: undefined },
    })

    const root = wrapper.find('[data-part="root"]')
    expect(root.attributes('data-state')).toBe('indeterminate')
  })

  it('applies intent classes', async () => {
    const intents = ['primary', 'secondary', 'accent'] as const
    for (const intent of intents) {
      const wrapper = await mountSuspended(UIProgressCircular, {
        props: { intent },
      })
      const root = wrapper.find('[data-part="root"]')
      expect(root.classes().some((c) => c.includes(intent))).toBe(true)
    }
  })
})
