import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Checkbox from '~ui/app/components/Form/Checkbox.vue'

describe('UIFormCheckbox', () => {
  it('renders label and hidden input with name', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        label: 'Accept terms',
        name: 'terms',
      },
    })

    expect(wrapper.text()).toContain('Accept terms')
    const hidden = wrapper.find('input[type="checkbox"]')
    expect(hidden.exists()).toBe(true)
    expect(hidden.attributes('name')).toBe('terms')
  })

  it('reflects checked state from modelValue', async () => {
    const wrapperChecked = await mountSuspended(Checkbox, {
      props: {
        label: 'Opt in',
        modelValue: true,
        name: 'opt',
      },
    })

    expect(
      wrapperChecked.find('[data-scope="checkbox"][data-part="root"]').attributes('data-state'),
    ).toBe('checked')

    const wrapperUnchecked = await mountSuspended(Checkbox, {
      props: {
        label: 'Opt out',
        modelValue: false,
        name: 'opt2',
      },
    })

    expect(
      wrapperUnchecked.find('[data-scope="checkbox"][data-part="root"]').attributes('data-state'),
    ).toBe('unchecked')
  })

  it('emits update:modelValue when toggled', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        label: 'Subscribe',
        modelValue: false,
        name: 'sub',
        'onUpdate:modelValue': onUpdateModelValue,
      },
    })

    await wrapper.find('input[type="checkbox"]').trigger('click')
    await flushPromises()

    expect(onUpdateModelValue).toHaveBeenCalledWith(true)
  })

  it('shows required indicator when required', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        label: 'Required box',
        name: 'req',
        required: true,
      },
    })

    expect(wrapper.text()).toContain('*')
  })

  it('applies invalid styling when error prop is provided', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        error: 'This must be checked',
        label: 'Error checkbox',
        name: 'err',
      },
    })

    const root = wrapper.find('[data-scope="checkbox"][data-part="root"]')
    expect(root.attributes('data-invalid')).toBe('')
  })

  it('emits blur event when hidden input loses focus', async () => {
    const onBlur = vi.fn()
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        label: 'Blur test',
        name: 'blur',
        onBlur,
      },
    })

    const hiddenInput = wrapper.find('input[type="checkbox"]')
    await hiddenInput.trigger('blur')

    expect(onBlur).toHaveBeenCalled()
  })

  it('renders only control when inGroup is true', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        inGroup: true,
        label: 'Group item',
        name: 'group',
      },
    })

    expect(wrapper.find('[data-scope="field"]').exists()).toBe(false)
    expect(wrapper.find('[data-scope="checkbox"]').exists()).toBe(true)
  })

  it('forwards aria-label to the checkbox root', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        'aria-label': 'Select row',
        controlOnly: true,
      },
    })

    expect(wrapper.find('[data-scope="checkbox"][data-part="root"]').attributes('aria-label')).toBe(
      'Select row',
    )
  })

  it('binds v-model when controlOnly is true', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        controlOnly: true,
        modelValue: false,
        'onUpdate:modelValue': onUpdateModelValue,
      },
    })

    await wrapper.find('input[type="checkbox"]').trigger('click')
    await flushPromises()

    expect(onUpdateModelValue).toHaveBeenCalledWith(true)
  })
})
