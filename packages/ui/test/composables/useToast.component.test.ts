import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { useToast } from '../../app/composables/useToast'

describe('useToast', () => {
  it('returns the same ref for repeated calls', async () => {
    const User = defineComponent({
      setup() {
        const a = useToast()
        const b = useToast()
        return () => h('span', { 'data-same': String(a === b) })
      },
    })
    const wrapper = await mountSuspended(User)
    expect(wrapper.attributes('data-same')).toBe('true')
  })

  it('creates a toaster instance on the client after tick', async () => {
    const User = defineComponent({
      setup() {
        const toaster = useToast()
        return () => h('span', { 'data-has': toaster.value ? '1' : '0' })
      },
    })
    const wrapper = await mountSuspended(User)
    await flushPromises()
    await vi.waitFor(
      () => {
        expect(wrapper.attributes('data-has')).toBe('1')
      },
      { timeout: 5000 },
    )
  })
})
