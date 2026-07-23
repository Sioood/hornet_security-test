import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Toggle from '~ui/app/components/Toggle/index.vue'

function visibleSwapText(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  const swapState = wrapper.find('[data-swap]').attributes('data-swap')
  const type = swapState === 'on' ? 'on' : 'off'

  return wrapper.find(`[data-type="${type}"]`).text()
}

describe('Toggle', () => {
  it('shows the off slot when not pressed', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { pressed: false },
      slots: {
        off: 'Off',
        on: 'On',
      },
    })

    expect(visibleSwapText(wrapper)).toBe('Off')
  })

  it('shows the on slot when pressed', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { pressed: true },
      slots: {
        off: 'Off',
        on: 'On',
      },
    })

    expect(visibleSwapText(wrapper)).toBe('On')
  })

  it('emits update:pressed when clicked', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { pressed: false },
      slots: { off: 'Off', on: 'On' },
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:pressed')?.[0]?.[0]).toBe(true)
  })

  it('does not emit when disabled', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { disabled: true, pressed: false },
      slots: { off: 'Off', on: 'On' },
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:pressed')).toBeUndefined()
  })

  it('applies variant and intent classes to root button', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { intent: 'accent', pressed: false, variant: 'subtle' },
      slots: { off: 'Off', on: 'On' },
    })

    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toMatch(/bg-accent-fill-subtle/)
  })

  it('applies iconOnly compact padding when set', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { iconOnly: true, pressed: false },
      slots: { off: 'Off', on: 'On' },
    })

    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('px-1.5')
  })

  it('applies activeBackground pressed-on styles when pressed and activeBackground is true', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { activeBackground: true, intent: 'primary', pressed: true, variant: 'default' },
      slots: { off: 'Off', on: 'On' },
    })

    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toMatch(/data-\[state=on\]/)
  })

  it('does not emit update:pressed on click in group-item mode', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { groupItem: true, pressed: false },
      slots: { off: 'Off', on: 'On' },
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:pressed')).toBeUndefined()
  })

  it('shows on slot in group-item mode when pressed is true', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { groupItem: true, pressed: true },
      slots: { off: 'Off', on: 'On' },
    })

    expect(visibleSwapText(wrapper)).toBe('On')
  })

  it('renders as a button element with type button', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { pressed: false },
      slots: { off: 'Off', on: 'On' },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')
  })
})
