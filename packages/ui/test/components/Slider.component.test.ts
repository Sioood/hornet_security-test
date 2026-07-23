import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import UISlider from '~ui/app/components/Form/Slider/index.vue'

function sliderHarness(sliderProps: Record<string, unknown> = {}) {
  return defineComponent({
    name: 'SliderHarness',
    setup() {
      return () =>
        h(UISlider, {
          ...sliderProps,
          'data-testid': 'slider-root',
          label: 'Test Slider',
        })
    },
  })
}

describe('UISlider', () => {
  it('renders with default props', async () => {
    const wrapper = await mountSuspended(sliderHarness({ defaultValue: [50] }))

    expect(wrapper.find('[data-testid="slider-root"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Slider')
  })

  it('renders label and value text', async () => {
    const wrapper = await mountSuspended(sliderHarness({ defaultValue: [40] }))

    expect(wrapper.text()).toContain('Test Slider')
    // ValueText should show the value
    expect(wrapper.text()).toContain('40')
  })

  it('renders with marks', async () => {
    const wrapper = await mountSuspended(
      sliderHarness({ defaultValue: [50], marks: [0, 25, 50, 75, 100] }),
    )

    // Should have markers
    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('25')
    expect(wrapper.text()).toContain('50')
    expect(wrapper.text()).toContain('75')
    expect(wrapper.text()).toContain('100')
  })

  it('renders range slider with two thumbs', async () => {
    const wrapper = await mountSuspended(sliderHarness({ defaultValue: [25, 75] }))

    const root = wrapper.find('[data-testid="slider-root"]')
    expect(root.exists()).toBe(true)
  })

  it('supports v-model for controlled value', async () => {
    const model = ref<number[]>([50])

    const Controlled = defineComponent({
      name: 'ControlledSliderHarness',
      setup() {
        return () =>
          h(UISlider, {
            'data-testid': 'ctl-slider',
            label: 'Controlled',
            modelValue: model.value,
            'onUpdate:modelValue': (v: number[]) => {
              model.value = v
            },
          })
      },
    })

    const wrapper = await mountSuspended(Controlled)
    expect(wrapper.find('[data-testid="ctl-slider"]').exists()).toBe(true)
    expect(model.value).toEqual([50])
  })

  it('renders with disabled prop', async () => {
    const wrapper = await mountSuspended(sliderHarness({ defaultValue: [50], disabled: true }))

    const root = wrapper.find('[data-testid="slider-root"]')
    expect(root.exists()).toBe(true)
  })

  it('renders with readOnly prop', async () => {
    const wrapper = await mountSuspended(sliderHarness({ defaultValue: [50], readOnly: true }))

    const root = wrapper.find('[data-testid="slider-root"]')
    expect(root.exists()).toBe(true)
  })

  it('renders vertical orientation', async () => {
    const wrapper = await mountSuspended(
      sliderHarness({ defaultValue: [50], orientation: 'vertical' }),
    )

    const root = wrapper.find('[data-testid="slider-root"]')
    expect(root.exists()).toBe(true)
  })

  it('renders with min/max', async () => {
    const wrapper = await mountSuspended(sliderHarness({ defaultValue: [5], max: 10, min: -10 }))

    expect(wrapper.text()).toContain('Test Slider')
  })

  it('renders with custom formatValue', async () => {
    const wrapper = await mountSuspended(
      sliderHarness({
        defaultValue: [50],
        formatValue: (v: number) => `$${v}`,
      }),
    )

    expect(wrapper.text()).toContain('$50')
  })

  it('renders with intent variants', async () => {
    for (const intent of ['neutral', 'primary', 'secondary', 'accent'] as const) {
      const wrapper = await mountSuspended(sliderHarness({ defaultValue: [50], intent }))
      expect(wrapper.find('[data-testid="slider-root"]').exists()).toBe(true)
    }
  })

  it('renders with size variants', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const wrapper = await mountSuspended(sliderHarness({ defaultValue: [50], size }))
      expect(wrapper.find('[data-testid="slider-root"]').exists()).toBe(true)
    }
  })

  it('renders with thumbCollisionBehavior', async () => {
    for (const behavior of ['none', 'push', 'swap'] as const) {
      const wrapper = await mountSuspended(
        sliderHarness({ defaultValue: [25, 60], thumbCollisionBehavior: behavior }),
      )
      expect(wrapper.find('[data-testid="slider-root"]').exists()).toBe(true)
    }
  })

  it('renders with minStepsBetweenThumbs', async () => {
    const wrapper = await mountSuspended(
      sliderHarness({ defaultValue: [25, 60], minStepsBetweenThumbs: 5 }),
    )

    expect(wrapper.find('[data-testid="slider-root"]').exists()).toBe(true)
  })

  it('renders without label when label is undefined', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'NoLabelSliderHarness',
        setup() {
          return () =>
            h(UISlider, {
              'data-testid': 'no-label-slider',
              defaultValue: [50],
            })
        },
      }),
    )

    expect(wrapper.find('[data-testid="no-label-slider"]').exists()).toBe(true)
  })
})
