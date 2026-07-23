import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'

import UIFormPinInput from '~ui/app/components/Form/PinInput.vue'

describe('UIFormPinInput', () => {
  it('renders the correct number of visible inputs', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 5 },
    })

    // Ark's PinInput.Input renders actual <input> elements.
    // The HiddenInput is type="hidden" so it's excluded.
    const inputs = wrapper.findAll('input[data-part="input"]')
    expect(inputs).toHaveLength(5)
  })

  it('sets the initial modelValue as filled slots', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, modelValue: '42' },
    })

    const inputs = wrapper.findAll('input')
    // The first visible inputs with actual values
    const visibleInputs = inputs.filter((el) => el.element.type !== 'hidden')
    expect(visibleInputs[0]!.element.value).toBe('4')
    expect(visibleInputs[1]!.element.value).toBe('2')
    expect(visibleInputs[2]!.element.value).toBe('')
    expect(visibleInputs[3]!.element.value).toBe('')
  })

  it('supports numeric type', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, type: 'numeric' },
    })

    const inputs = wrapper.findAll('input')
    const visibleInputs = inputs.filter((el) => el.element.type !== 'hidden')
    expect(visibleInputs[0]!.element.getAttribute('inputmode')).toBe('numeric')
  })

  it('supports alphanumeric type', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, type: 'alphanumeric' },
    })

    const inputs = wrapper.findAll('input')
    const visibleInputs = inputs.filter((el) => el.element.type !== 'hidden')
    expect(visibleInputs[0]!.element.getAttribute('inputmode')).toBe('text')
  })

  it('renders label when label prop is provided', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, label: 'Verification' },
    })

    expect(wrapper.text()).toContain('Verification')
  })

  it('renders helper text when provided', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, helperText: 'Enter the code' },
    })

    expect(wrapper.text()).toContain('Enter the code')
  })

  it('renders error text when invalid with error message', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, error: 'Invalid code', invalid: true },
    })

    expect(wrapper.text()).toContain('Invalid code')
  })

  it('disables inputs when disabled', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, disabled: true },
    })

    const inputs = wrapper.findAll('input')
    const visibleInputs = inputs.filter((el) => el.element.type !== 'hidden')
    expect(visibleInputs[0]!.element.disabled).toBe(true)
  })

  it('marks inputs as readonly when readOnly', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, readOnly: true },
    })

    const inputs = wrapper.findAll('input')
    const visibleInputs = inputs.filter((el) => el.element.type !== 'hidden')
    expect(visibleInputs[0]!.element.readOnly).toBe(true)
  })

  it('renders the required indicator when required', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, label: 'Code', required: true },
    })

    expect(wrapper.text()).toContain('*')
  })

  it('renders with explicit intent prop', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, intent: 'accent' },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('renders with explicit size prop', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, size: 'lg' },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('supports mask prop', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, mask: true },
    })

    const inputs = wrapper.findAll('input')
    const visibleInputs = inputs.filter((el) => el.element.type !== 'hidden')
    expect(visibleInputs[0]!.element.getAttribute('type')).toBe('password')
  })

  it('supports otp prop', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      props: { count: 4, otp: true },
    })

    const inputs = wrapper.findAll('input')
    const visibleInputs = inputs.filter((el) => el.element.type !== 'hidden')
    expect(visibleInputs[0]!.element.getAttribute('autocomplete')).toBe('one-time-code')
  })

  it('renders a visible input that is focusable', async () => {
    const wrapper = await mountSuspended(UIFormPinInput, {
      attachTo: document.body,
      props: { count: 4 },
    })

    const inputs = wrapper.findAll('input[data-part="input"]')
    expect(inputs).toHaveLength(4)
    expect(inputs[0]!.exists()).toBe(true)
    // Not disabled and not readonly → focusable
    expect(inputs[0]!.element.disabled).toBe(false)
    expect(inputs[0]!.element.readOnly).toBe(false)
  })

  it('exposes getControlElement via ref', async () => {
    const componentRef = ref<InstanceType<typeof UIFormPinInput> | null>(null)

    const wrapper = await mountSuspended(
      defineComponent({
        name: 'PinInputRefTest',
        components: { UIFormPinInput },
        setup() {
          return { componentRef }
        },
        template: `
          <UIFormPinInput ref="componentRef" :count="4" />
        `,
      }),
    )

    const vm = wrapper.vm as unknown as {
      componentRef: { getControlElement: () => HTMLInputElement | null }
    }
    const el = vm.componentRef.getControlElement()
    expect(el).toBeInstanceOf(HTMLInputElement)
  })

  it('exposes focus method via ref', async () => {
    const componentRef = ref<InstanceType<typeof UIFormPinInput> | null>(null)

    const wrapper = await mountSuspended(
      defineComponent({
        name: 'PinInputFocusTest',
        components: { UIFormPinInput },
        setup() {
          return { componentRef }
        },
        template: `
          <UIFormPinInput ref="componentRef" :count="4" />
        `,
      }),
      { attachTo: document.body },
    )

    const vm = wrapper.vm as unknown as {
      componentRef: { focus: () => void; getControlElement: () => HTMLInputElement | null }
    }
    const el = vm.componentRef.getControlElement()
    expect(el).toBeInstanceOf(HTMLInputElement)

    vm.componentRef.focus()
    await wrapper.vm.$nextTick()

    expect(document.activeElement?.tagName).toBe('INPUT')
  })
})
