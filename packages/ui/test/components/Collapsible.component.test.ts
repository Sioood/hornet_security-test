import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Collapsible from '~ui/app/components/Collapsible.vue'

describe('Collapsible', () => {
  it('shows heading fallback and panel content', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      props: { heading: 'Details' },
      slots: { default: 'Panel body' },
    })

    expect(wrapper.text()).toContain('Details')
    expect(wrapper.text()).toContain('Panel body')
  })

  it('uses title slot over heading prop', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      props: { heading: 'Ignored' },
      slots: {
        default: 'Content',
        title: 'Custom title',
      },
    })

    expect(wrapper.text()).toContain('Custom title')
    expect(wrapper.text()).not.toContain('Ignored')
  })
})
