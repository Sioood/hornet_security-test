import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import Alert from '~ui/app/components/Alert.vue'

describe('Alert', () => {
  it('renders title and description', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        description: 'A description for this alert',
        title: 'Important update',
      },
    })

    expect(wrapper.text()).toContain('Important update')
    expect(wrapper.text()).toContain('A description for this alert')
  })

  it('applies classes from type to root/content and shows default icon', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        title: 'Success',
        type: 'success',
      },
    })

    expect(wrapper.find('.alertRoot').classes().join(' ')).toMatch(/bg-success-surface-subtle/)
    expect(wrapper.find('.alertContent').classes().join(' ')).toMatch(/text-success-text/)
    expect(wrapper.find('.alertContentIcon').exists()).toBe(true)
  })

  it('renders action buttons and falls back action intent/size to alert values', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        actions: [{ text: 'Retry' }],
        intent: 'warning',
        size: 'md',
        title: 'Take action',
      },
    })

    const actionButton = wrapper.findAll('button').find((el) => el.text().includes('Retry'))
    expect(actionButton).toBeDefined()
    expect(actionButton?.classes().join(' ')).toMatch(/bg-warning-fill/)
  })

  it('hides alert when close button is clicked', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        actions: [{ text: 'Action' }],
        closable: true,
        title: 'Closable',
      },
    })

    expect(wrapper.find('.alertRoot').exists()).toBe(true)
    await wrapper.findAll('button')[0]?.trigger('click')
    expect(wrapper.find('.alertRoot').exists()).toBe(false)
  })

  it('calls action onClick when action button is clicked', async () => {
    const onClick = vi.fn()
    const wrapper = await mountSuspended(Alert, {
      props: {
        actions: [{ onClick, text: 'Run' }],
        title: 'Click action',
      },
    })

    const actionButton = wrapper.findAll('button').find((el) => el.text().includes('Run'))
    expect(actionButton).toBeDefined()
    await actionButton?.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies intent from type prop when both type and intent are set', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        intent: 'neutral',
        title: 'Type overrides',
        type: 'error',
      },
    })

    expect(wrapper.find('.alertRoot').classes().join(' ')).toMatch(/bg-error-surface-subtle/)
  })

  it('renders content slot', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: { title: 'With slot' },
      slots: {
        content: '<div data-testid="custom-content">Custom content</div>',
      },
    })

    expect(wrapper.find('[data-testid="custom-content"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom content')
  })

  it('renders with neutral type and shows info icon as fallback', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        title: 'Neutral info',
        type: 'neutral',
      },
    })

    expect(wrapper.find('.alertContentIcon').exists()).toBe(true)
    expect(wrapper.find('.alertRoot').classes().join(' ')).toMatch(/bg-neutral-surface-subtle/)
  })

  it('does not render icon when no type and no icon prop', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: { title: 'No icon' },
    })

    expect(wrapper.find('.alertContentIcon').exists()).toBe(false)
  })

  it('renders custom icon from prop', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        icon: 'tabler:bell',
        title: 'Custom icon',
      },
    })

    expect(wrapper.find('.alertContentIcon').exists()).toBe(true)
  })

  it('supports v-model:visible to control visibility', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        title: 'Toggleable',
        visible: false,
      },
    })

    expect(wrapper.find('.alertRoot').exists()).toBe(false)
  })
})
