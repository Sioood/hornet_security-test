import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { z } from 'zod'

import { useSchemaForm } from '../../app/composables/useSchemaForm'

describe('useSchemaForm', () => {
  it('rejects invalid values on submit when validateSchemaOn includes submit', async () => {
    const schema = z.object({ email: z.string().min(1) })
    const onSubmit = vi.fn()

    let formRef: ReturnType<typeof useSchemaForm>['form'] | undefined

    const Consumer = defineComponent({
      setup() {
        const { form } = useSchemaForm({
          defaultValues: { email: '' },
          onSubmit,
          schema,
          validateSchemaOn: ['change', 'blur', 'submit'],
        })
        formRef = form
        return () => h('div')
      },
    })

    await mountSuspended(Consumer)
    await formRef!.handleSubmit()
    await flushPromises()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('returns a form instance that can submit valid values', async () => {
    const schema = z.object({ name: z.string().min(1) })
    const onSubmit = vi.fn()

    let formRef: ReturnType<typeof useSchemaForm>['form'] | undefined

    const Consumer = defineComponent({
      setup() {
        const { form } = useSchemaForm({
          defaultValues: { name: 'Alice' },
          onSubmit,
          schema,
          validateSchemaOn: ['submit'],
        })
        formRef = form
        return () => h('div', { 'data-ready': '1' })
      },
    })

    await mountSuspended(Consumer)
    await formRef!.handleSubmit()
    await flushPromises()

    expect(onSubmit).toHaveBeenCalledWith({ value: { name: 'Alice' } })
  })

  it('defaults validateSchemaOn to change — invalid values trigger onChange validation', async () => {
    const schema = z.object({ x: z.string().min(3) })
    const onSubmit = vi.fn()

    let formRef: ReturnType<typeof useSchemaForm>['form'] | undefined

    const Consumer = defineComponent({
      setup() {
        const { form } = useSchemaForm({
          defaultValues: { x: 'ab' },
          onSubmit,
          schema,
        })
        formRef = form
        return () => h('div')
      },
    })

    await mountSuspended(Consumer)

    formRef!.setFieldValue('x', 'a')
    await flushPromises()

    const { errors } = formRef!.state
    expect(errors.length).toBeGreaterThan(0)
  })
})
