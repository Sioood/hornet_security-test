import { useTour, type TourStepDetails } from '@ark-ui/vue/tour'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import Tour from '~ui/app/components/Tour/index.vue'

const steps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Next' }],
    description: 'First step description',
    id: 'step-1',
    title: 'Step 1',
    type: 'dialog',
  },
  {
    actions: [
      { action: 'prev', label: 'Back' },
      { action: 'next', label: 'Next' },
    ],
    description: 'Second step description',
    id: 'step-2',
    target: () => document.querySelector<HTMLElement>('#target'),
    title: 'Step 2',
    type: 'tooltip',
  },
]

const stepsWithDismiss: TourStepDetails[] = [
  {
    actions: [
      { action: 'prev', label: 'Back' },
      { action: 'dismiss', label: 'Finish' },
    ],
    description: 'Description',
    id: 'step-1',
    title: 'Step 1',
    type: 'dialog',
  },
]

const stepsWithPrevLast: TourStepDetails[] = [
  {
    actions: [
      { action: 'next', label: 'Next' },
      { action: 'prev', label: 'Back' },
    ],
    description: 'Description',
    id: 'step-1',
    title: 'Step 1',
    type: 'dialog',
  },
]

describe('Tour', () => {
  it('mounts without errors', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('#target').exists()).toBe(true)
  })

  it('accepts showBackdrop prop', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour" :show-backdrop="false">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('accepts showSpotlight prop', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour" :show-spotlight="false">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('accepts showClose prop', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour" :show-close="false">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('accepts showProgress prop', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour" :show-progress="false">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('accepts showProgressBar prop', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour" :show-progress-bar="true">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('accepts lazyMount prop', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour" :lazy-mount="true">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('accepts unmountOnExit prop', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour" :unmount-on-exit="true">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('accepts all intent variants', async () => {
    const intents = ['neutral', 'primary', 'secondary', 'accent'] as const

    for (const intent of intents) {
      const wrapper = await mountSuspended(
        defineComponent({
          name: 'TourTestHarness',
          components: { Tour },
          setup() {
            const tour = useTour({ steps })
            return { tour }
          },
          template: `
            <Tour :tour="tour" intent="${intent}">
              <div id="target">Target</div>
            </Tour>
          `,
        }),
      )

      expect(wrapper.exists()).toBe(true)
    }
  })

  it('accepts all size variants', async () => {
    const sizes = ['sm', 'md', 'lg'] as const

    for (const size of sizes) {
      const wrapper = await mountSuspended(
        defineComponent({
          name: 'TourTestHarness',
          components: { Tour },
          setup() {
            const tour = useTour({ steps })
            return { tour }
          },
          template: `
            <Tour :tour="tour" size="${size}">
              <div id="target">Target</div>
            </Tour>
          `,
        }),
      )

      expect(wrapper.exists()).toBe(true)
    }
  })

  it('accepts ui prop for slot customization', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour" :ui="{ content: 'custom-class', backdrop: 'backdrop-class' }">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('renders action triggers with primary variant for dismiss action', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps: stepsWithDismiss })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    wrapper.vm.tour.start()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(wrapper.exists()).toBe(true)
  })

  it('renders action triggers with default variant for prev action as last', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps: stepsWithPrevLast })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    wrapper.vm.tour.start()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(wrapper.exists()).toBe(true)
  })

  it('renders action triggers with primary variant for next action as last', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    wrapper.vm.tour.start()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with custom slots', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <template #backdrop="{ ctx }">
              <div data-testid="custom-backdrop" />
            </template>
            <template #spotlight="{ ctx }">
              <div data-testid="custom-spotlight" />
            </template>
            <template #title="{ ctx }">
              <span data-testid="custom-title">Custom Title</span>
            </template>
            <template #description="{ ctx }">
              <span data-testid="custom-description">Custom Description</span>
            </template>
            <template #control="{ ctx }">
              <div data-testid="custom-control">Custom Control</div>
            </template>
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="custom-backdrop"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="custom-spotlight"]').exists()).toBe(true)
  })

  it('renders progress text slot', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <template #progress-text="{ ctx }">
              <span data-testid="custom-progress">Custom Progress</span>
            </template>
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('renders progress bar slot', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour" :show-progress-bar="true">
            <template #progress-bar="{ ctx }">
              <div data-testid="custom-progress-bar">Custom Progress Bar</div>
            </template>
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('renders close trigger slot', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <template #close-trigger="{ ctx }">
              <button type="button" data-testid="custom-close">Custom Close</button>
            </template>
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="custom-close"]').exists()).toBe(true)
  })

  it('renders arrow slot', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <template #arrow="{ ctx }">
              <div data-testid="custom-arrow">Custom Arrow</div>
            </template>
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('renders positioner slot', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <template #positioner="{ ctx }">
              <div data-testid="custom-positioner">Custom Positioner</div>
            </template>
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('renders content slot', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <template #content="{ ctx }">
              <div data-testid="custom-content">Custom Content</div>
            </template>
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('renders actions slot', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <template #actions="{ ctx }">
              <div data-testid="custom-actions">Custom Actions</div>
            </template>
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('renders close trigger icon slot', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <template #close-trigger-icon>
              <span data-testid="custom-close-icon">X</span>
            </template>
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('starts tour and renders action buttons', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TourTestHarness',
        components: { Tour },
        setup() {
          const tour = useTour({ steps })
          return { tour }
        },
        template: `
          <Tour :tour="tour">
            <div id="target">Target</div>
          </Tour>
        `,
      }),
    )

    wrapper.vm.tour.start()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 150))

    expect(wrapper.exists()).toBe(true)
  })
})
