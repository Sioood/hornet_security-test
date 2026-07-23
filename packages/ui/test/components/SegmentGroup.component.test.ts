import { useSegmentGroup } from '@ark-ui/vue/segment-group'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import UISegmentGroup from '~ui/app/components/SegmentGroup/index.vue'

describe('UISegmentGroup', () => {
  it('renders the correct number of items from options prop', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
        ],
      },
    })

    const items = wrapper.findAll('[data-part="item"]')
    expect(items).toHaveLength(3)
  })

  it('renders item labels correctly', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        options: [
          { label: 'React', value: 'react' },
          { label: 'Vue', value: 'vue' },
        ],
      },
    })

    expect(wrapper.text()).toContain('React')
    expect(wrapper.text()).toContain('Vue')
  })

  it('sets the initial modelValue as selected', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        modelValue: 'b',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })

    const items = wrapper.findAll('[data-part="item"]')
    expect(items[1]!.attributes('data-state')).toBe('checked')
  })

  it('renders the indicator element', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        modelValue: 'a',
        options: [{ label: 'A', value: 'a' }],
      },
    })

    const indicator = wrapper.find('[data-part="indicator"]')
    expect(indicator.exists()).toBe(true)
  })

  it('applies pill variant classes to root and indicator', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        intent: 'primary',
        options: [{ label: 'A', value: 'a' }],
        variant: 'pill',
      },
    })

    expect(wrapper.html()).toContain('border-primary-border')
    expect(wrapper.html()).toContain('bg-primary-fill-subtle')
    expect(wrapper.html()).not.toContain('border-b')
  })

  it('applies line variant classes to root', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        intent: 'neutral',
        options: [{ label: 'A', value: 'a' }],
        variant: 'line',
      },
    })

    expect(wrapper.html()).toContain('border-b')
    expect(wrapper.html()).toContain('border-neutral-border-subtle')
  })

  it('applies intent classes to root', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        intent: 'accent',
        options: [{ label: 'A', value: 'a' }],
      },
    })

    expect(wrapper.html()).toContain('border-accent-border-subtle')
    expect(wrapper.html()).toContain('bg-accent-fill')
  })

  it('applies size classes to root', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        options: [{ label: 'A', value: 'a' }],
        size: 'lg',
      },
    })

    expect(wrapper.html()).toContain('gap-1.5')
    expect(wrapper.html()).toContain('p-1.5')
  })

  it('renders without crashing when group is disabled', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        disabled: true,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })

    const items = wrapper.findAll('[data-part="item"]')
    expect(items).toHaveLength(2)
  })

  it('renders items with disabled option', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { disabled: true, label: 'B', value: 'b' },
        ],
      },
    })

    const items = wrapper.findAll('[data-part="item"]')
    expect(items).toHaveLength(2)
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
  })

  it('uses value prop as fallback for label', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        options: [{ value: 'fallback-label' }],
      },
    })

    expect(wrapper.text()).toContain('fallback-label')
  })

  it('uses RootProvider mode when value prop is provided', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'SegmentGroupProviderTest',
        components: { UISegmentGroup },
        setup() {
          const segmentGroup = useSegmentGroup()
          return { segmentGroup }
        },
        template: `
          <UISegmentGroup :value="segmentGroup" :options="[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]" />
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
    const items = wrapper.findAll('[data-part="item"]')
    expect(items).toHaveLength(2)
  })

  it('forwards asChild in RootProvider mode', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'SegmentGroupProviderAsChildTest',
        components: { UISegmentGroup },
        setup() {
          const segmentGroup = useSegmentGroup()
          return { segmentGroup }
        },
        template: `
          <UISegmentGroup :value="segmentGroup" as-child :options="[
            { value: 'a', label: 'A' },
          ]" />
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('hides item-control so labels stay centered', async () => {
    const wrapper = await mountSuspended(UISegmentGroup, {
      props: {
        options: [{ label: 'A', value: 'a' }],
      },
    })

    const control = wrapper.find('[data-part="item-control"]')
    expect(control.exists()).toBe(true)
    expect(control.classes()).toContain('hidden')
  })

  it('updates v-model when segment selection changes internally', async () => {
    const model = ref('a')

    const Controlled = defineComponent({
      name: 'SegmentGroupVModelUpdateTest',
      components: { UISegmentGroup },
      setup() {
        return { model }
      },
      template: `
        <UISegmentGroup v-model="model" :options="[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]" />
      `,
    })

    const wrapper = await mountSuspended(Controlled)

    const items = wrapper.findAll('[data-part="item"]')
    expect(items[0]!.attributes('data-state')).toBe('checked')

    const inputs = wrapper.findAll('input[type="radio"]')
    expect(inputs).toHaveLength(2)

    await inputs[1]!.trigger('click')
    await nextTick()
    await nextTick()

    expect(model.value).toBe('b')
    expect(items[1]!.attributes('data-state')).toBe('checked')
  })
})
