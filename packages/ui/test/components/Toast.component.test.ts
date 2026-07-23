import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import Toast from '~ui/app/components/Toast.vue'
import { useToast } from '~ui/app/composables/useToast'

describe('Toast', () => {
  it('teleports the toaster and shows created toasts', async () => {
    const Harness = defineComponent({
      setup() {
        const toaster = useToast()
        const show = () => {
          toaster.value?.create({
            closable: false,
            description: 'Toast body',
            title: 'Toast title',
            type: 'info',
          })
        }
        return () =>
          h('div', { 'data-toaster-ready': toaster.value ? '1' : '0' }, [
            h('button', { 'data-testid': 'fire-toast', onClick: show, type: 'button' }, 'show'),
            h(Toast),
          ])
      },
    })

    const wrapper = await mountSuspended(Harness)
    await flushPromises()

    await vi.waitFor(
      () => {
        expect(wrapper.attributes('data-toaster-ready')).toBe('1')
      },
      { timeout: 5000 },
    )

    await wrapper.get('[data-testid="fire-toast"]').trigger('click')
    await flushPromises()

    await vi.waitFor(
      () => {
        expect(document.body.textContent).toContain('Toast title')
        expect(document.body.textContent).toContain('Toast body')
      },
      { timeout: 5000 },
    )
  })
})
