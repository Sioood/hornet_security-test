import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import UIFormCombobox from '~ui/app/components/Form/Combobox/index.vue'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid' },
]

describe('UIFormCombobox', () => {
  it('renders label and placeholder', async () => {
    const wrapper = await mountSuspended(UIFormCombobox, {
      props: {
        items,
        label: 'Framework',
        placeholder: 'Search…',
      },
    })

    expect(wrapper.text()).toContain('Framework')
    expect(wrapper.find('input[data-part="input"]').attributes('placeholder')).toBe('Search…')
  })

  it('filters and shows items when typing', async () => {
    const wrapper = await mountSuspended(UIFormCombobox, {
      props: {
        inputValue: 'vu',
        items,
        open: true,
        portalled: false,
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.text()).not.toContain('React')
    expect(wrapper.text()).not.toContain('Solid')
  })

  it('selects an item on Enter when input matches label or value', async () => {
    const wrapper = await mountSuspended(UIFormCombobox, {
      props: {
        inputValue: 'react',
        items,
        open: true,
        portalled: false,
      },
    })

    const input = wrapper.find('input[data-part="input"]')
    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['react']])
  })

  it('selects the only filtered option on Enter without an exact match', async () => {
    const wrapper = await mountSuspended(UIFormCombobox, {
      props: {
        inputValue: 'vu',
        items,
        open: true,
        portalled: false,
      },
    })

    const input = wrapper.find('input[data-part="input"]')
    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['vue']])
  })

  it('clears the input when clear trigger is clicked', async () => {
    const wrapper = await mountSuspended(UIFormCombobox, {
      props: {
        items,
        modelValue: ['react'],
        showClear: true,
      },
    })

    const clearTrigger = wrapper.find('[data-part="clear-trigger"]')
    expect(clearTrigger.exists()).toBe(true)
    await clearTrigger.trigger('click')
    await flushPromises()

    expect(wrapper.find('input[data-part="input"]').exists()).toBe(true)
  })

  it('renders chips in multiple mode', async () => {
    const wrapper = await mountSuspended(UIFormCombobox, {
      props: {
        items,
        modelValue: ['react', 'vue'],
        multiple: true,
      },
    })

    expect(wrapper.text()).toContain('React')
    expect(wrapper.text()).toContain('Vue')
  })

  it('shows loading state', async () => {
    const wrapper = await mountSuspended(UIFormCombobox, {
      props: {
        items: [],
        loading: true,
        loadingText: 'Loading items…',
        portalled: false,
      },
    })

    await wrapper.find('input[data-part="input"]').setValue('a')
    await flushPromises()

    expect(wrapper.text()).toContain('Loading items…')
  })

  it('shows empty state', async () => {
    const wrapper = await mountSuspended(UIFormCombobox, {
      props: {
        emptyText: 'No results found',
        items: [],
        portalled: false,
      },
    })

    await wrapper.find('input[data-part="input"]').setValue('xyz')
    await flushPromises()

    expect(wrapper.text()).toContain('No results found')
  })
})
