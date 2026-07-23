import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ToggleGroup from '~ui/app/components/Toggle/Group.vue'

describe('Toggle/Group', () => {
  it('renders options fallback labels', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: {
        options: [
          { icon: 'tabler:layout-grid', title: 'Grid', value: 'grid' },
          { title: 'List', value: 'list' },
        ],
      },
    })

    expect(wrapper.text()).toContain('Grid')
    expect(wrapper.text()).toContain('List')
  })

  it('supports item slot customization', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: {
        modelValue: ['a'],
        options: [{ title: 'A', value: 'a' }],
      },
      slots: {
        item: `
          <template #item="{ option, pressed }">
            <span data-testid="item-slot">{{ option.title }}:{{ pressed ? 'on' : 'off' }}</span>
          </template>
        `,
      },
    })

    expect(wrapper.find('[data-testid="item-slot"]').text()).toBe('A:on')
  })

  it('passes icon and title to item slot props', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: {
        options: [{ icon: 'tabler:layout-grid', title: 'Grid', value: 'grid' }],
      },
      slots: {
        item: `
          <template #item="{ option }">
            <span data-testid="slot-props">{{ option.title }}|{{ option.icon }}</span>
          </template>
        `,
      },
    })

    expect(wrapper.find('[data-testid="slot-props"]').text()).toBe('Grid|tabler:layout-grid')
  })

  it('emits single selected value by default', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: {
        modelValue: [],
        options: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')

    const events = wrapper.emitted('update:modelValue') ?? []
    expect(events.length).toBeGreaterThan(0)
    expect(events.at(-1)?.[0]).toEqual(['center'])
  })

  it('emits multiple selected values when multiple is true', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: {
        modelValue: [],
        multiple: true,
        options: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')

    const events = wrapper.emitted('update:modelValue') ?? []
    expect(events.length).toBeGreaterThan(0)
    expect(events.at(-1)?.[0]).toEqual(['left', 'center'])
  })

  it('renders icons for all icon-only options', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: {
        activeBackground: true,
        iconOnly: true,
        modelValue: ['private'],
        options: [
          { icon: 'tabler:world', value: 'public' },
          { icon: 'tabler:users', value: 'followers' },
          { icon: 'tabler:lock', value: 'private' },
        ],
      },
    })

    expect(wrapper.findAll('button')).toHaveLength(3)
    expect(wrapper.findAll('button svg').length).toBeGreaterThanOrEqual(3)
  })

  it('reflects controlled model-value updates from parent', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: {
        activeBackground: true,
        iconOnly: true,
        modelValue: ['public'],
        options: [
          { icon: 'tabler:world', value: 'public' },
          { icon: 'tabler:lock', value: 'private' },
        ],
      },
    })

    expect(wrapper.find('[data-state="on"]').exists()).toBe(true)

    await wrapper.setProps({ modelValue: ['private'] })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('[data-state="on"]')).toHaveLength(1)
  })

  it('does not emit selection for disabled option', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: {
        options: [{ disabled: true, title: 'Left', value: 'left' }],
      },
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
