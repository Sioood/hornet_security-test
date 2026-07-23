import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Input from '~ui/app/components/Form/Input.vue'

describe('UIFormInput', () => {
  it('renders a text input with label and placeholder', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Name',
        name: 'name',
        placeholder: 'Jane',
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Jane')
    expect(wrapper.text()).toContain('Name')
  })

  it('toggles password field visibility', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Password',
        name: 'password',
        type: 'password',
      },
    })

    expect(wrapper.find('input').attributes('type')).toBe('password')

    const toggle = wrapper.find('button[aria-label="Show password"]')
    expect(toggle.exists()).toBe(true)
    await toggle.trigger('click')

    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('shows clear button when clearable is true and has value', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        clearable: true,
        label: 'Search',
        modelValue: 'test value',
        name: 'search',
      },
    })

    const buttons = wrapper.findAll('button')
    const clearButton = buttons.find((b) => b.text().trim() === '')
    expect(clearButton).toBeDefined()
  })

  it('hides clear button when clearable is true but value is empty', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        clearable: true,
        label: 'Search',
        modelValue: '',
        name: 'search',
      },
    })

    const buttons = wrapper.findAll('button')
    const iconButtons = buttons.filter((b) => b.find('svg').exists())
    expect(iconButtons.length).toBe(0)
  })

  it('renders clearable input with disabled state', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        clearable: true,
        disabled: true,
        label: 'Search',
        modelValue: 'test',
        name: 'search',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('renders clearable input with readOnly state', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        clearable: true,
        label: 'Search',
        modelValue: 'test',
        name: 'search',
        readOnly: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('readonly')).toBeDefined()
  })
})
