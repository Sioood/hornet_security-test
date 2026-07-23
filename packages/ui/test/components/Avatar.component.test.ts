import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Avatar from '~ui/app/components/Avatar/index.vue'

describe('UIAvatar', () => {
  it('renders root with CVA classes', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { name: 'Ada Lovelace', ui: { root: 'avatar-root-test' } },
    })
    const root = wrapper.find('.avatar-root-test')
    expect(root.exists()).toBe(true)
    expect(root.attributes('data-part')).toBe('root')
  })

  it('shows initials in fallback', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { lettersOnly: true, name: 'Ada Lovelace' },
    })
    const fallback = wrapper.find('[data-part="fallback"]')
    expect(fallback.exists()).toBe(true)
    expect(fallback.text()).toContain('AL')
  })

  it('anonymous lettersOnly shows ??', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { lettersOnly: true },
    })
    expect(wrapper.find('[data-part="fallback"]').text()).toContain('??')
  })

  it('renders fallback with initials', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { name: 'Test User' },
    })
    const fallback = wrapper.find('[data-part="fallback"]')
    expect(fallback.exists()).toBe(true)
    expect(fallback.text()).toContain('TU')
  })

  it('lettersOnly hides image', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { lettersOnly: true, name: 'Ada' },
    })
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('merges ui slot classes', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { name: 'Ada', ui: { fallback: 'custom-fallback', root: 'custom-root' } },
    })
    expect(wrapper.find('.custom-root').exists()).toBe(true)
    expect(wrapper.find('.custom-fallback').exists()).toBe(true)
  })

  it('applies intent and size variants', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { intent: 'primary', name: 'Ada', size: 'lg' },
    })
    expect(wrapper.find('[data-part="root"]').exists()).toBe(true)
  })
})
