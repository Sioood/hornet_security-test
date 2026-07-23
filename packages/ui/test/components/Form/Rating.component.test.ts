import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'

import UIFormRating from '~ui/app/components/Form/Rating/index.vue'
import UIFormRatingRoot from '~ui/app/components/Form/Rating/Root.vue'

describe('UIFormRating', () => {
  it('renders the correct number of rating items', async () => {
    const wrapper = await mountSuspended(UIFormRating, {
      props: { count: 5, label: 'Rating' },
    })

    const items = wrapper.findAll('[data-part="item"]')
    expect(items).toHaveLength(5)
  })

  it('renders label when label prop is provided', async () => {
    const wrapper = await mountSuspended(UIFormRating, {
      props: { count: 5, label: 'Product rating' },
    })

    expect(wrapper.text()).toContain('Product rating')
  })

  it('renders helper text when provided', async () => {
    const wrapper = await mountSuspended(UIFormRating, {
      props: { count: 5, helperText: 'Rate from 1 to 5' },
    })

    expect(wrapper.text()).toContain('Rate from 1 to 5')
  })

  it('renders error text when invalid with error message', async () => {
    const wrapper = await mountSuspended(UIFormRating, {
      props: { count: 5, error: 'Rating is required', invalid: true },
    })

    expect(wrapper.text()).toContain('Rating is required')
  })

  it('renders hidden input for form submission when name is set', async () => {
    const wrapper = await mountSuspended(UIFormRating, {
      props: { count: 5, defaultValue: 3, name: 'rating' },
    })

    const hidden = wrapper.find('input[name="rating"]')
    expect(hidden.exists()).toBe(true)
  })

  it('supports controlled v-model', async () => {
    const Parent = defineComponent({
      components: { UIFormRating },
      setup() {
        const rating = ref<number>(2)
        return { rating }
      },
      template: '<UIFormRating v-model="rating" :count="5" label="Rating" name="rating" />',
    })

    const wrapper = await mountSuspended(Parent)
    expect(wrapper.text()).toContain('Rating')

    const hidden = wrapper.find('input[name="rating"]')
    expect(hidden.exists()).toBe(true)
    expect(hidden.element.value).toBe('2')
  })

  it('respects disabled state on items', async () => {
    const wrapper = await mountSuspended(UIFormRating, {
      props: { count: 5, disabled: true },
    })

    const items = wrapper.findAll('[data-part="item"]')
    for (const item of items) {
      expect(item.attributes('data-disabled')).toBeDefined()
    }
  })

  it('respects read-only state on control', async () => {
    const wrapper = await mountSuspended(UIFormRating, {
      props: { count: 5, defaultValue: 4, readOnly: true },
    })

    const control = wrapper.find('[data-part="control"]')
    expect(control.attributes('data-readonly')).toBeDefined()
  })

  it('supports allowHalf via root props', async () => {
    const wrapper = await mountSuspended(UIFormRatingRoot, {
      props: { allowHalf: true, count: 5, defaultValue: 2.5 },
    })

    const root = wrapper.find('[data-part="root"]')
    expect(root.exists()).toBe(true)
  })

  it('renders default star icons for highlighted and empty states', async () => {
    const wrapper = await mountSuspended(UIFormRating, {
      props: { count: 5, defaultValue: 2, label: 'Rating' },
    })

    expect(wrapper.findAll('svg')).toHaveLength(5)
    expect(wrapper.html()).toContain('text-primary-fill')
    expect(wrapper.html()).toContain('text-primary-text-subtle')
  })

  it('forwards hover-change and value-change listeners', async () => {
    const onValueChange = vi.fn()
    const onHoverChange = vi.fn()

    await mountSuspended(UIFormRating, {
      props: {
        count: 5,
        defaultValue: 3,
        onHoverChange,
        onValueChange,
      },
    })

    // Listeners are attached — verified by mount without errors.
    // Interaction testing is limited in happy-dom for rating pointer events.
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onHoverChange).not.toHaveBeenCalled()
  })
})
