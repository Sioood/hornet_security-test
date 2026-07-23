import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Field from '~ui/app/components/Form/Field.vue'

describe('UIFormField', () => {
  it('shows label, required indicator, and helper text', async () => {
    const wrapper = await mountSuspended(Field, {
      props: {
        helperText: 'We never share your email',
        invalid: false,
        label: 'Email',
        required: true,
      },
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('*')
    expect(wrapper.text()).toContain('We never share your email')
  })

  it('shows error message when invalid', async () => {
    const wrapper = await mountSuspended(Field, {
      props: {
        error: 'Required',
        invalid: true,
        label: 'Email',
      },
      slots: {
        default: '<input />',
      },
    })

    expect(wrapper.text()).toContain('Required')
  })

  it('fieldset mode orders legend, helper, control, then error', async () => {
    const wrapper = await mountSuspended(Field, {
      props: {
        asFieldset: true,
        error: 'Pick at least one',
        helperText: 'Choose your preferred frameworks',
        invalid: true,
        label: 'Select frameworks',
      },
      slots: {
        default: '<div class="group">Group</div>',
      },
    })

    const html = wrapper.html()
    const legendIdx = html.indexOf('Select frameworks')
    const helperIdx = html.indexOf('Choose your preferred frameworks')
    const groupIdx = html.indexOf('Group')
    const errIdx = html.indexOf('Pick at least one')

    expect(legendIdx).toBeGreaterThan(-1)
    expect(helperIdx).toBeGreaterThan(-1)
    expect(legendIdx).toBeLessThan(helperIdx)
    expect(helperIdx).toBeLessThan(groupIdx)
    expect(groupIdx).toBeLessThan(errIdx)
  })
})
