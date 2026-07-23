import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Link from '~ui/app/components/Link.vue'

describe('Link', () => {
  it('renders default slot in custom mode without vue-router', async () => {
    const wrapper = await mountSuspended(Link, {
      props: { custom: true, to: '/' },
      slots: { default: 'Home' },
    })

    expect(wrapper.text()).toContain('Home')
  })

  it('marks external http URLs for target and rel', async () => {
    const wrapper = await mountSuspended(Link, {
      props: { to: 'https://example.com/page' },
      slots: { default: 'External' },
    })

    const anchor = wrapper.find('a')
    expect(anchor.attributes('target')).toBe('_blank')
    expect(anchor.attributes('rel')).toContain('noopener')
  })
})
