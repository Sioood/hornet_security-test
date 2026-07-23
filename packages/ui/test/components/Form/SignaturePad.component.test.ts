import { useSignaturePad } from '@ark-ui/vue/signature-pad'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'

import UIFormSignaturePad from '~ui/app/components/Form/SignaturePad.vue'

function getShellElement(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  const control = wrapper.find('[data-part="control"]')
  expect(control.exists()).toBe(true)
  const shell = control.element.parentElement
  expect(shell).toBeInstanceOf(HTMLElement)
  return shell as HTMLElement
}

function shellClassName(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  return getShellElement(wrapper).className
}

function findHiddenInput(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  const input = wrapper.find('input[hidden]')
  expect(input.exists()).toBe(true)
  return input
}

describe('UIFormSignaturePad', () => {
  it('renders label and field chrome', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { helperText: 'Sign above the line', label: 'Signature' },
    })

    expect(wrapper.text()).toContain('Signature')
    expect(wrapper.text()).toContain('Sign above the line')
  })

  it('renders error text when invalid with error message', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { error: 'Signature is required', invalid: true, label: 'Signature' },
    })

    expect(wrapper.text()).toContain('Signature is required')
  })

  it('renders signature pad anatomy parts', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { label: 'Signature' },
    })

    expect(wrapper.find('[data-part="control"]').exists()).toBe(true)
    expect(wrapper.find('[data-part="segment"]').exists()).toBe(true)
    expect(wrapper.find('[data-part="guide"]').exists()).toBe(true)
    expect(wrapper.find('input[hidden]').exists()).toBe(true)
  })

  it('applies default variant shell classes (fill-subtle + intent border)', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { intent: 'primary', label: 'Signature' },
    })

    const classes = shellClassName(wrapper)
    expect(classes).toMatch(/bg-primary-fill-subtle/)
    expect(classes).toMatch(/border-primary-border/)
    expect(classes).not.toMatch(/bg-transparent/)
  })

  it('applies subtle variant shell classes (transparent background)', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { intent: 'primary', label: 'Signature', variant: 'subtle' },
    })

    const classes = shellClassName(wrapper)
    expect(classes).toMatch(/bg-transparent/)
    expect(classes).toMatch(/border-primary-border/)
    expect(classes).not.toMatch(/bg-primary-fill-subtle/)
  })

  it('applies size classes on the drawing segment', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { label: 'Signature', size: 'lg' },
    })

    const segment = wrapper.find('[data-part="segment"]')
    expect(segment.classes().join(' ')).toMatch(/min-h-48/)
  })

  it('applies intent stroke color on the segment', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { intent: 'accent', label: 'Signature' },
    })

    const segment = wrapper.find('[data-part="segment"]')
    expect(segment.classes().join(' ')).toMatch(/text-accent-text/)
  })

  it('applies intent-colored guide line', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { intent: 'secondary', label: 'Signature' },
    })

    const guide = wrapper.find('[data-part="guide"]')
    expect(guide.classes().join(' ')).toMatch(/border-secondary-border/)
  })

  it('applies invalid border on the shell', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { error: 'Required', invalid: true, label: 'Signature' },
    })

    expect(shellClassName(wrapper)).toMatch(/border-error-border/)
  })

  it('renders clear trigger when clearable', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { clearable: true, label: 'Signature' },
    })

    expect(wrapper.find('button[aria-label="Clear signature"]').exists()).toBe(true)
  })

  it('hides clear trigger when clearable is false', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { clearable: false, label: 'Signature' },
    })

    expect(wrapper.find('button[aria-label="Clear signature"]').exists()).toBe(false)
  })

  it('disables clear trigger when disabled', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { disabled: true, label: 'Signature' },
    })

    const clear = wrapper.find('button[aria-label="Clear signature"]')
    expect(clear.exists()).toBe(true)
    expect(clear.attributes('disabled')).toBeDefined()
  })

  it('disables clear trigger when readOnly', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { label: 'Signature', readOnly: true },
    })

    const clear = wrapper.find('button[aria-label="Clear signature"]')
    expect(clear.exists()).toBe(true)
    expect(clear.attributes('disabled')).toBeDefined()
  })

  it('serializes paths in the hidden input', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { label: 'Signature', name: 'signature' },
    })

    expect(findHiddenInput(wrapper).element.value).toBe('[]')
  })

  it('supports controlled v-model', async () => {
    const path = 'M0 0 L10 10'

    const Parent = defineComponent({
      components: { UIFormSignaturePad },
      setup() {
        const paths = ref<string[]>([path])
        return { paths }
      },
      template: '<UIFormSignaturePad v-model="paths" label="Signature" name="signature" />',
    })

    const wrapper = await mountSuspended(Parent)
    expect(findHiddenInput(wrapper).element.value).toBe(JSON.stringify([path]))
  })

  it('merges ui.shell class overrides', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { label: 'Signature', ui: { shell: 'test-shell-override' } },
    })

    expect(getShellElement(wrapper).classList.contains('test-shell-override')).toBe(true)
  })

  it('uses RootProvider mode when value prop is provided', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'SignaturePadProviderTest',
        components: { UIFormSignaturePad },
        setup() {
          const signaturePad = useSignaturePad()
          return { signaturePad }
        },
        template: `
          <UIFormSignaturePad :value="signaturePad" label="Signature" data-testid="provider-root" />
        `,
      }),
    )

    expect(wrapper.find('[data-testid="provider-root"]').exists()).toBe(true)
    expect(wrapper.find('[data-part="control"]').exists()).toBe(true)
  })

  it('renders required indicator when required', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { label: 'Signature', required: true },
    })

    expect(wrapper.text()).toContain('*')
  })

  it('marks control as disabled when disabled prop is set', async () => {
    const wrapper = await mountSuspended(UIFormSignaturePad, {
      props: { disabled: true, label: 'Signature' },
    })

    const control = wrapper.find('[data-part="control"]')
    expect(control.attributes('data-disabled')).toBeDefined()
    expect(shellClassName(wrapper)).toMatch(/cursor-not-allowed/)
  })
})
