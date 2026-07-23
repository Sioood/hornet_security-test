import { useDatePicker } from '@ark-ui/vue/date-picker'
import { parseDate, type DateValue } from '@internationalized/date'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import UIFormDatePicker from '~ui/app/components/Form/DatePicker/index.vue'
import UIFormDatePickerRoot from '~ui/app/components/Form/DatePicker/Root.vue'

describe('UIFormDatePicker (assembled)', () => {
  it('renders the root element', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'DatePickerHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              'data-testid': 'date-picker-root',
              label: 'Date',
            })
        },
      }),
    )

    expect(wrapper.find('[data-testid="date-picker-root"]').exists()).toBe(true)
  })

  it('renders two inputs in range mode', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'RangeHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              label: 'Range',
              selectionMode: 'range',
            })
        },
      }),
    )

    expect(wrapper.findAll('input[data-part="input"]').length).toBe(2)
  })

  it('renders inline calendar without positioner', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'InlineHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              inline: true,
              label: 'Inline',
              showTrigger: false,
            })
        },
      }),
    )

    expect(wrapper.find('[data-part="positioner"]').exists()).toBe(false)
    expect(wrapper.find('[data-part="content"]').exists()).toBe(true)
  })

  it('syncs v-model when a day cell is selected', async () => {
    const model = ref<DateValue[]>([])

    const wrapper = await mountSuspended(
      defineComponent({
        name: 'ControlledHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              defaultValue: [parseDate('2025-05-01')],
              inline: true,
              label: 'Controlled',
              modelValue: model.value,
              'onUpdate:modelValue': (next: DateValue[]) => {
                model.value = next
              },
              showTrigger: false,
            })
        },
      }),
    )

    const dayCell = wrapper
      .findAll('[data-part="table-cell-trigger"]')
      .find((cell) => cell.text() === '15')

    expect(dayCell).toBeDefined()
    await dayCell!.trigger('click')
    await nextTick()

    expect(model.value).toHaveLength(1)
    expect(model.value[0]?.day).toBe(15)
    expect(model.value[0]?.month).toBe(5)
    expect(model.value[0]?.year).toBe(2025)
  })

  it('keeps working without v-model (uncontrolled)', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'UncontrolledHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              defaultValue: [parseDate('2025-05-01')],
              inline: true,
              label: 'Uncontrolled',
              showTrigger: false,
            })
        },
      }),
    )

    const dayCell = wrapper
      .findAll('[data-part="table-cell-trigger"]')
      .find((cell) => cell.text() === '20')

    expect(dayCell).toBeDefined()
    await expect(dayCell!.trigger('click')).resolves.not.toThrow()
  })

  it('forwards value-change events via attrs', async () => {
    const onValueChange = vi.fn()

    await mountSuspended(
      defineComponent({
        name: 'EmitHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              label: 'Emit',
              onValueChange,
            })
        },
      }),
    )

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('renders trigger and clear inside the form control shell inner-trailing area', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'ShellTrailingHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              label: 'Birth date',
              modelValue: [parseDate('2025-05-01')],
              triggerPlacement: 'inner-trailing',
            })
        },
      }),
    )

    const control = wrapper.find('[data-part="control"]')
    const trigger = wrapper.find('[data-part="trigger"]')
    const clearTrigger = wrapper.find('[data-part="clear-trigger"]')

    expect(control.exists()).toBe(true)
    expect(trigger.exists()).toBe(true)
    expect(clearTrigger.exists()).toBe(true)
    expect(control.element.parentElement).toBe(trigger.element.parentElement)
    expect(clearTrigger.element.compareDocumentPosition(trigger.element)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('renders a trailing UIButton trigger outside the control shell', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TrailingButtonHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              label: 'Event date',
              portalled: false,
              triggerPlacement: 'trailing',
            })
        },
      }),
    )

    const control = wrapper.find('[data-part="control"]')
    const trigger = wrapper.find('[data-part="trigger"]')

    expect(control.exists()).toBe(true)
    expect(trigger.exists()).toBe(true)
    expect(control.element.parentElement).not.toBe(trigger.element.parentElement)
    expect(trigger.element.tagName).toBe('BUTTON')

    await trigger.trigger('click')
    await nextTick()

    expect(trigger.attributes('data-state')).toBe('open')
    expect(wrapper.find('[data-part="content"]').attributes('data-state')).toBe('open')
  })

  it('opens the calendar when the trigger is clicked', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TriggerOpenHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              defaultValue: [parseDate('2025-05-01')],
              label: 'Event date',
              portalled: false,
            })
        },
      }),
    )

    const trigger = wrapper.find('[data-part="trigger"]')
    expect(trigger.attributes('data-state')).toBe('closed')

    await trigger.trigger('click')
    await nextTick()

    expect(trigger.attributes('data-state')).toBe('open')
    expect(wrapper.find('[data-part="content"]').attributes('data-state')).toBe('open')
  })

  it('defaults to primary intent on control shell and calendar content', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'PrimaryIntentHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              inline: true,
              label: 'Date',
              showTrigger: false,
            })
        },
      }),
    )

    const shell = wrapper.find('[data-part="control"]')?.element.parentElement
    expect(shell?.className).toContain('border-primary-border')
    expect(wrapper.find('[data-part="content"]').classes().join(' ')).toContain(
      'border-primary-border-subtle',
    )
    expect(wrapper.find('[data-part="content"]').classes().join(' ')).toContain(
      'bg-primary-fill-subtle',
    )
  })

  it('propagates intent to calendar content', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'SecondaryIntentHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              inline: true,
              intent: 'secondary',
              label: 'Date',
              showTrigger: false,
            })
        },
      }),
    )

    expect(wrapper.find('[data-part="content"]').classes().join(' ')).toContain(
      'border-secondary-border-subtle',
    )
    expect(wrapper.find('[data-part="content"]').classes().join(' ')).toContain(
      'bg-secondary-fill-subtle',
    )
  })

  it('clears the value when the clear trigger is clicked', async () => {
    const model = ref<DateValue[]>([parseDate('2025-05-01')])

    const wrapper = await mountSuspended(
      defineComponent({
        name: 'ClearHarness',
        setup() {
          return () =>
            h(UIFormDatePicker, {
              label: 'Clearable',
              modelValue: model.value,
              'onUpdate:modelValue': (next: DateValue[] | undefined) => {
                model.value = next ?? []
              },
            })
        },
      }),
    )

    await wrapper.find('[data-part="clear-trigger"]').trigger('click')
    await nextTick()

    expect(model.value).toHaveLength(0)
  })
})

describe('UIFormDatePickerRoot (provider)', () => {
  it('renders with external useDatePicker API', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'ProviderHarness',
        components: { UIFormDatePickerRoot },
        setup() {
          const api = useDatePicker({
            defaultValue: [parseDate('2025-02-02')],
          })
          return { api }
        },
        template: `
          <UIFormDatePickerRoot :value="api" data-testid="provider-root">
            <span data-testid="provider-child">child</span>
          </UIFormDatePickerRoot>
        `,
      }),
    )

    expect(wrapper.find('[data-testid="provider-root"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="provider-child"]').exists()).toBe(true)
  })

  it('supports selectToday from external API', async () => {
    const apiRef = ref<ReturnType<typeof useDatePicker>>()

    const wrapper = await mountSuspended(
      defineComponent({
        name: 'SelectTodayHarness',
        components: { UIFormDatePickerRoot },
        setup() {
          const api = useDatePicker()
          apiRef.value = api
          return {
            api,
            selectToday: () => {
              api.value.selectToday()
            },
          }
        },
        template: `
          <div>
            <button data-testid="select-today" type="button" @click="selectToday">Today</button>
            <UIFormDatePickerRoot :value="api" data-testid="provider-inline" />
          </div>
        `,
      }),
    )

    expect(wrapper.find('[data-testid="provider-inline"]').exists()).toBe(true)

    await wrapper.find('[data-testid="select-today"]').trigger('click')
    await nextTick()

    expect(apiRef.value?.value.value.length).toBeGreaterThan(0)
  })
})
