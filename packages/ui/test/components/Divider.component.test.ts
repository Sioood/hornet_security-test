import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Divider from '~ui/app/components/Divider.vue'

describe('Divider', () => {
  it('renders a span with base divider classes', async () => {
    const wrapper = await mountSuspended(Divider)
    const el = wrapper.find('span')
    expect(el.exists()).toBe(true)
    const classes = el.classes().join(' ')
    expect(classes).toMatch(/bg-primary-border-subtle/)
    expect(classes).toMatch(/min-w-8/)
    expect(classes).toMatch(/w-full/)
  })

  it('applies intent, size, and orientation variants', async () => {
    const wrapper = await mountSuspended(Divider, {
      props: { intent: 'accent', orientation: 'vertical', size: 'lg' },
    })
    const classes = wrapper.find('span').classes().join(' ')
    expect(classes).toMatch(/bg-accent-border-subtle/)
    expect(classes).toMatch(/min-h-8/)
    expect(classes).toMatch(/h-full/)
  })

  it('merges custom class', async () => {
    const wrapper = await mountSuspended(Divider, {
      props: { class: 'my-divider' },
    })
    expect(wrapper.find('span').classes()).toContain('my-divider')
  })
})
