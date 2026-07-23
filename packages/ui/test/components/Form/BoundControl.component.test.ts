import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import BoundControl from '~ui/app/components/Form/BoundControl.vue'

const DummyInput = defineComponent({
  props: {
    error: String,
    extra: String,
    invalid: Boolean,
    modelValue: { default: '', type: String },
    name: String,
  },
  emits: ['update:modelValue', 'blur'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'data-extra': props.extra,
        onBlur: () => emit('blur'),
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        value: props.modelValue,
      })
  },
})

describe('UIFormBoundControl', () => {
  it('merges config props, validation state, and field handlers', async () => {
    const handleChange = vi.fn()
    const handleBlur = vi.fn()

    const wrapper = await mountSuspended(BoundControl, {
      props: {
        config: {
          as: DummyInput,
          props: { extra: 'merged' },
        },
        fieldApi: {
          handleBlur,
          handleChange,
        },
        fieldName: 'title',
        state: {
          meta: { errors: ['bad'] },
          value: 'hi',
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('data-extra')).toBe('merged')
    expect(input.element.value).toBe('hi')

    await input.setValue('yo')
    expect(handleChange).toHaveBeenCalled()

    await input.trigger('blur')
    expect(handleBlur).toHaveBeenCalled()
  })
})
