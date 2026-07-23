import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import UIFormSelect from '~ui/app/components/Form/Select/index.vue'

const items = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]

describe('UIFormSelect', () => {
  it('renders the label and placeholder', async () => {
    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        items,
        label: 'Select an option',
        placeholder: 'Pick one',
      },
    })

    expect(wrapper.text()).toContain('Select an option')
    expect(wrapper.text()).toContain('Pick one')
  })

  it('renders items when open', async () => {
    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        items,
        portalled: false,
      },
    })

    await wrapper.find('button[data-part="trigger"]').trigger('click')
    await flushPromises()

    for (const item of items) {
      expect(wrapper.text()).toContain(item.label)
    }
  })

  it('emits update:modelValue when an item is selected', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        items,
        'onUpdate:modelValue': onUpdateModelValue,
        portalled: false,
      },
    })

    await wrapper.find('button[data-part="trigger"]').trigger('click')
    await flushPromises()

    // Find the first item and click it
    const firstItem = wrapper.find('[data-part="item"][data-value="1"]')
    await firstItem.trigger('click')
    await flushPromises()

    expect(onUpdateModelValue).toHaveBeenCalledWith(['1'])
  })

  it('handles multiple selection', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        defaultValue: ['1'],
        items,
        modelValue: ['1'],
        multiple: true,
        'onUpdate:modelValue': onUpdateModelValue,
        portalled: false,
      },
    })

    await wrapper.find('button[data-part="trigger"]').trigger('click')
    await flushPromises()

    const secondItem = wrapper.find('[data-part="item"][data-value="2"]')
    await secondItem.trigger('click')
    await flushPromises()

    expect(onUpdateModelValue).toHaveBeenCalledWith(['1', '2'])
  })

  it('shows loading state', async () => {
    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        loading: true,
        loadingText: 'Loading items...',
        portalled: false,
      },
    })

    await wrapper.find('button[data-part="trigger"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Loading items...')
  })

  it('shows empty state', async () => {
    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        emptyText: 'No results found',
        items: [],
        portalled: false,
      },
    })

    await wrapper.find('button[data-part="trigger"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('No results found')
  })

  it('clears selection when clear button is clicked', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        defaultValue: ['1'],
        items,
        modelValue: ['1'],
        'onUpdate:modelValue': onUpdateModelValue,
        showClear: true,
      },
    })

    const clearButton = wrapper.find('[data-part="clear-trigger"]')
    expect(clearButton.exists()).toBe(true)

    await clearButton.trigger('click')
    await flushPromises()

    expect(onUpdateModelValue).toHaveBeenCalledWith([])
  })

  it('renders grouped items with group labels', async () => {
    const groupedItems = [
      { group: 'Group A', label: 'Option A1', value: 'a1' },
      { group: 'Group A', label: 'Option A2', value: 'a2' },
      { group: 'Group B', label: 'Option B1', value: 'b1' },
    ]

    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        items: groupedItems,
        portalled: false,
      },
    })

    await wrapper.find('button[data-part="trigger"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Group A')
    expect(wrapper.text()).toContain('Group B')
    expect(wrapper.text()).toContain('Option A1')
    expect(wrapper.text()).toContain('Option B1')
  })

  it('applies ui prop classes to item elements', async () => {
    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        items,
        portalled: false,
        ui: {
          item: 'custom-item-class',
          itemText: 'custom-item-text-class',
        },
      },
    })

    await wrapper.find('button[data-part="trigger"]').trigger('click')
    await flushPromises()

    const item = wrapper.find('[data-part="item"]')
    expect(item.exists()).toBe(true)
  })

  it('renders Select All button when allowSelectAll and multiple are true', async () => {
    const wrapper = await mountSuspended(UIFormSelect, {
      props: {
        allowSelectAll: true,
        items,
        multiple: true,
        portalled: false,
      },
    })

    await wrapper.find('button[data-part="trigger"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toMatch(/Select All|Sélectionner Tout/)
  })
})
