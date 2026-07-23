import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import UIFormTagsInput from '~ui/app/components/Form/TagsInput/index.vue'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid' },
]

describe('UIFormTagsInput', () => {
  it('renders label and placeholder', async () => {
    const wrapper = await mountSuspended(UIFormTagsInput, {
      props: {
        label: 'Tags',
        placeholder: 'Add tag…',
      },
    })

    expect(wrapper.text()).toContain('Tags')
    expect(wrapper.find('input[data-part="input"]').attributes('placeholder')).toBe('Add tag…')
  })

  it('renders existing tags as chips', async () => {
    const wrapper = await mountSuspended(UIFormTagsInput, {
      props: {
        modelValue: ['react', 'vue'],
      },
    })

    expect(wrapper.text()).toContain('react')
    expect(wrapper.text()).toContain('vue')
  })

  it('emits update:modelValue when a tag is removed', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = await mountSuspended(UIFormTagsInput, {
      props: {
        modelValue: ['react', 'vue'],
        'onUpdate:modelValue': onUpdateModelValue,
      },
    })

    const reactChip = wrapper
      .findAll('.group')
      .find((node) => node.text().includes('react') && node.text().includes('vue') === false)

    expect(reactChip).toBeDefined()
    await reactChip?.find('.cursor-pointer')?.trigger('click')
    await flushPromises()

    expect(onUpdateModelValue).toHaveBeenCalledWith(['vue'])
  })

  it('shows combobox suggestions when items are provided', async () => {
    const wrapper = await mountSuspended(UIFormTagsInput, {
      props: {
        inputValue: 'vu',
        items,
        portalled: false,
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.text()).not.toContain('React')
  })

  it('adds a tag on Enter when input matches label case-insensitively', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = await mountSuspended(UIFormTagsInput, {
      props: {
        inputValue: 'react',
        items,
        'onUpdate:modelValue': onUpdateModelValue,
        portalled: false,
      },
    })

    const input = wrapper.find('input[data-part="input"]')
    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(onUpdateModelValue).toHaveBeenCalledWith(['react'])
  })

  it('adds a tag from combobox selection', async () => {
    const wrapper = await mountSuspended(UIFormTagsInput, {
      props: {
        items,
        portalled: false,
      },
    })

    const input = wrapper.find('input[data-part="input"]')
    await input.setValue('react')
    await flushPromises()

    const item = wrapper.find('[data-part="item"][data-value="react"]')
    expect(item.exists()).toBe(true)
    await item.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('React')
  })

  it('clears all tags via clear trigger', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = await mountSuspended(UIFormTagsInput, {
      props: {
        modelValue: ['react'],
        'onUpdate:modelValue': onUpdateModelValue,
        showClear: true,
      },
    })

    const clearTrigger = wrapper.find('[data-part="clear-trigger"]')
    expect(clearTrigger.exists()).toBe(true)

    await clearTrigger.trigger('click')
    await flushPromises()

    expect(onUpdateModelValue).toHaveBeenCalledWith([])
  })
})
