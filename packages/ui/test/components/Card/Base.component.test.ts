import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import CardBase from '../../../app/components/Card/Base.vue'

describe('Card/Base', () => {
  it('renders default slot content', async () => {
    const wrapper = await mountSuspended(CardBase, {
      slots: { default: 'Card inner' },
    })
    expect(wrapper.text()).toContain('Card inner')
  })

  it('applies default variant and primary intent surface classes', async () => {
    const wrapper = await mountSuspended(CardBase)
    const classes = wrapper.find('.join-item').classes().join(' ')
    expect(classes).toMatch(/bg-primary-surface/)
    expect(classes).toMatch(/border-primary-border/)
  })

  it('applies subtle neutral compound classes', async () => {
    const wrapper = await mountSuspended(CardBase, {
      props: { intent: 'neutral', variant: 'subtle' },
    })
    const classes = wrapper.find('.join-item').classes().join(' ')
    expect(classes).toMatch(/bg-neutral-surface-subtle/)
    expect(classes).toMatch(/border-neutral-border-subtle/)
  })

  it('applies size padding', async () => {
    const wrapper = await mountSuspended(CardBase, {
      props: { size: 'lg' },
    })
    expect(wrapper.find('.join-item').classes().join(' ')).toMatch(/p-4/)
  })

  it('merges custom class', async () => {
    const wrapper = await mountSuspended(CardBase, {
      props: { class: 'rounded-xl' },
    })
    expect(wrapper.find('div').classes()).toContain('rounded-xl')
  })
})
