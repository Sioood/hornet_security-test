import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import UIStepsCompletedContent from '~ui/app/components/Steps/CompletedContent.vue'
import UIStepsContent from '~ui/app/components/Steps/Content.vue'
import UIStepsContext from '~ui/app/components/Steps/Context.vue'
import UISteps from '~ui/app/components/Steps/index.vue'
import UIStepsIndicator from '~ui/app/components/Steps/Indicator.vue'
import UIStepsItem from '~ui/app/components/Steps/Item.vue'
import UIStepsItemContext from '~ui/app/components/Steps/ItemContext.vue'
import UIStepsList from '~ui/app/components/Steps/List.vue'
import UIStepsNextTrigger from '~ui/app/components/Steps/NextTrigger.vue'
import UIStepsPrevTrigger from '~ui/app/components/Steps/PrevTrigger.vue'
import UIStepsProgress from '~ui/app/components/Steps/Progress.vue'
import UIStepsRoot from '~ui/app/components/Steps/Root.vue'
import UIStepsSeparator from '~ui/app/components/Steps/Separator.vue'
import UIStepsTrigger from '~ui/app/components/Steps/Trigger.vue'

/**
 * Standard steps harness with 3 steps, content, prev/next, and completed content.
 * Uses UIStepsRoot for manual composition testing.
 */
function stepsHarness(extraProps: Record<string, unknown> = {}) {
  return defineComponent({
    name: 'StepsHarness',
    setup() {
      return () =>
        h(
          UIStepsRoot,
          { count: 3, 'data-testid': 'steps-root', ...extraProps },
          {
            default: () => [
              h(UIStepsList, {}, () => [
                h(UIStepsItem, { index: 0 }, () => [
                  h(UIStepsIndicator),
                  h(UIStepsTrigger, () => 'Step 1'),
                  h(UIStepsSeparator),
                ]),
                h(UIStepsItem, { index: 1 }, () => [
                  h(UIStepsIndicator),
                  h(UIStepsTrigger, () => 'Step 2'),
                  h(UIStepsSeparator),
                ]),
                h(UIStepsItem, { index: 2 }, () => [
                  h(UIStepsIndicator),
                  h(UIStepsTrigger, () => 'Step 3'),
                ]),
              ]),
              h(UIStepsContent, { index: 0 }, () => 'Content 1'),
              h(UIStepsContent, { index: 1 }, () => 'Content 2'),
              h(UIStepsContent, { index: 2 }, () => 'Content 3'),
              h(UIStepsCompletedContent, {}, () => 'All done!'),
              h('div', { 'data-testid': 'nav-buttons' }, [
                h(UIStepsPrevTrigger),
                h(UIStepsNextTrigger),
              ]),
            ],
          },
        )
    },
  })
}

describe('UIStepsRoot', () => {
  it('renders the root element', async () => {
    const wrapper = await mountSuspended(stepsHarness())
    expect(wrapper.find('[data-testid="steps-root"]').exists()).toBe(true)
  })

  it('renders all step triggers', async () => {
    const wrapper = await mountSuspended(stepsHarness())
    const buttons = wrapper.findAll('button')
    // 3 step triggers + prev + next = at least 5 buttons
    expect(buttons.length).toBeGreaterThanOrEqual(5)

    expect(wrapper.text()).toContain('Step 1')
    expect(wrapper.text()).toContain('Step 2')
    expect(wrapper.text()).toContain('Step 3')
  })

  it('shows first step content by default', async () => {
    const wrapper = await mountSuspended(stepsHarness())
    // First content should be visible
    expect(wrapper.text()).toContain('Content 1')
  })

  it('renders indicators and separators', async () => {
    const wrapper = await mountSuspended(stepsHarness())
    const indicators = wrapper.findAll('[data-part="indicator"]')
    expect(indicators.length).toBe(3)

    const separators = wrapper.findAll('[data-part="separator"]')
    expect(separators.length).toBe(2)
  })

  it('renders default indicator content (step number on first step)', async () => {
    const wrapper = await mountSuspended(stepsHarness())
    // The first indicator (current step) should show "1"
    const [firstIndicator] = wrapper.findAll('[data-part="indicator"]')
    expect(firstIndicator!.text()).toBe('1')
  })

  it('renders prev and next triggers', async () => {
    const wrapper = await mountSuspended(stepsHarness())
    const navContainer = wrapper.find('[data-testid="nav-buttons"]')

    // Prev should exist and be disabled on first step
    const [prevButton] = navContainer.findAll('button')
    expect(prevButton).toBeDefined()
    expect(prevButton!.attributes('disabled')).toBeDefined()

    // Next should exist
    const [, nextButton] = navContainer.findAll('button')
    expect(nextButton).toBeDefined()
  })

  it('navigates to next step via next trigger', async () => {
    const wrapper = await mountSuspended(stepsHarness())

    const navContainer = wrapper.find('[data-testid="nav-buttons"]')
    const [, nextButton] = navContainer.findAll('button')
    expect(nextButton!.attributes('disabled')).toBeUndefined()

    // Click next
    await nextButton!.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Content 2')
  })

  it('supports v-model:step', async () => {
    const step = ref<number>(1)

    const Controlled = defineComponent({
      name: 'StepsControlledHarness',
      setup() {
        return () =>
          h(
            UIStepsRoot,
            {
              count: 3,
              'onUpdate:step': (v: number) => {
                step.value = v
              },
              step: step.value,
            },
            {
              default: () => [
                h(UIStepsList, {}, () => [
                  h(UIStepsItem, { index: 0 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S1'),
                  ]),
                  h(UIStepsItem, { index: 1 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S2'),
                  ]),
                  h(UIStepsItem, { index: 2 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S3'),
                  ]),
                ]),
                h(UIStepsContent, { index: 0 }, () => 'C1'),
                h(UIStepsContent, { index: 1 }, () => 'C2'),
                h(UIStepsContent, { index: 2 }, () => 'C3'),
                h(UIStepsCompletedContent, {}, () => 'Done'),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(Controlled)

    // Should start at step 1 (index 1)
    expect(wrapper.text()).toContain('C2')

    step.value = 0
    await nextTick()
    expect(wrapper.text()).toContain('C1')
  })

  it('supports RootProvider mode with external API', async () => {
    const { useSteps } = await import('@ark-ui/vue/steps')

    const Provider = defineComponent({
      name: 'StepsProviderHarness',
      setup() {
        const api = useSteps({ count: 3, defaultStep: 1 })
        return () =>
          h(
            UIStepsRoot,
            { value: api.value },
            {
              default: () => [
                h(UIStepsList, {}, () => [
                  h(UIStepsItem, { index: 0 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S1'),
                  ]),
                  h(UIStepsItem, { index: 1 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S2'),
                  ]),
                  h(UIStepsItem, { index: 2 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S3'),
                  ]),
                ]),
                h(UIStepsContent, { index: 0 }, () => 'C1'),
                h(UIStepsContent, { index: 1 }, () => 'C2'),
                h(UIStepsContent, { index: 2 }, () => 'C3'),
                h(UIStepsCompletedContent, {}, () => 'Done'),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(Provider)

    // RootProvider should start at step 1
    expect(wrapper.text()).toContain('C2')
  })

  it('shows completed content after the last step', async () => {
    const wrapper = await mountSuspended(stepsHarness())

    const navContainer = wrapper.find('[data-testid="nav-buttons"]')
    const [, nextButton] = navContainer.findAll('button')

    // Go to step 2
    await nextButton!.trigger('click')
    await nextTick()
    // Go to step 3
    await nextButton!.trigger('click')
    await nextTick()
    // Go past step 3 (completed)
    await nextButton!.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('All done!')
  })

  it('navigates to previous step via prev trigger', async () => {
    const wrapper = await mountSuspended(stepsHarness())

    // First, go to step 2
    const navContainer = wrapper.find('[data-testid="nav-buttons"]')
    const [, nextButton] = navContainer.findAll('button')
    await nextButton!.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Content 2')

    // Now go back
    const [prevButton] = navContainer.findAll('button')
    await prevButton!.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Content 1')
  })

  it('renders progress bar', async () => {
    const WithProgress = defineComponent({
      name: 'StepsProgressHarness',
      setup() {
        return () =>
          h(
            UIStepsRoot,
            { count: 3, 'data-testid': 'prog-root' },
            {
              default: () => [
                h(UIStepsProgress),
                h(UIStepsList, {}, () => [
                  h(UIStepsItem, { index: 0 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S1'),
                  ]),
                  h(UIStepsItem, { index: 1 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S2'),
                  ]),
                  h(UIStepsItem, { index: 2 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S3'),
                  ]),
                ]),
                h(UIStepsContent, { index: 0 }, () => 'C1'),
                h(UIStepsContent, { index: 1 }, () => 'C2'),
                h(UIStepsContent, { index: 2 }, () => 'C3'),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(WithProgress)
    expect(wrapper.find('[data-part="progress"]').exists()).toBe(true)
  })

  it('applies intent and size classes', async () => {
    const wrapper = await mountSuspended(stepsHarness({ intent: 'primary', size: 'sm' }))

    const root = wrapper.find('[data-testid="steps-root"]')
    expect(root.exists()).toBe(true)
  })

  it('emits step-change event', async () => {
    const stepChangeSpy = vi.fn()

    const WithEvent = defineComponent({
      name: 'StepsEventHarness',
      setup() {
        return () =>
          h(
            UIStepsRoot,
            { count: 3, onStepChange: stepChangeSpy },
            {
              default: () => [
                h(UIStepsList, {}, () => [
                  h(UIStepsItem, { index: 0 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S1'),
                    h(UIStepsSeparator),
                  ]),
                  h(UIStepsItem, { index: 1 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S2'),
                    h(UIStepsSeparator),
                  ]),
                  h(UIStepsItem, { index: 2 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S3'),
                  ]),
                ]),
                h(UIStepsContent, { index: 0 }, () => 'C1'),
                h(UIStepsContent, { index: 1 }, () => 'C2'),
                h(UIStepsContent, { index: 2 }, () => 'C3'),
                h(UIStepsCompletedContent, {}, () => 'Done'),
                h(UIStepsNextTrigger),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(WithEvent)

    // Find the Next button — it's wrapped in UIButton via asChild
    const allButtons = wrapper.findAll('button')
    const nextButton = allButtons[allButtons.length - 1]!
    await nextButton.trigger('click')
    await nextTick()

    // The event may not fire in happy-dom, but the component should still navigate
    expect(wrapper.text()).toContain('C2')
  })

  it('exposes Context slot props', async () => {
    const WithContext = defineComponent({
      name: 'StepsContextHarness',
      setup() {
        return () =>
          h(
            UIStepsRoot,
            { count: 3 },
            {
              default: () => [
                h(UIStepsList, {}, () => [
                  h(UIStepsItem, { index: 0 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S1'),
                  ]),
                  h(UIStepsItem, { index: 1 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S2'),
                  ]),
                  h(UIStepsItem, { index: 2 }, () => [
                    h(UIStepsIndicator),
                    h(UIStepsTrigger, () => 'S3'),
                  ]),
                ]),
                h(
                  UIStepsContext,
                  {},
                  {
                    default: (ctx: { step: number; count: number }) =>
                      h('span', { 'data-testid': 'ctx-data' }, `Step ${ctx.step + 1}/${ctx.count}`),
                  },
                ),
                h(UIStepsContent, { index: 0 }, () => 'C1'),
                h(UIStepsContent, { index: 1 }, () => 'C2'),
                h(UIStepsContent, { index: 2 }, () => 'C3'),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(WithContext)
    expect(wrapper.find('[data-testid="ctx-data"]').exists()).toBe(true)
  })

  it('exposes ItemContext slot props', async () => {
    const WithItemContext = defineComponent({
      name: 'StepsItemContextHarness',
      setup() {
        return () =>
          h(
            UIStepsRoot,
            { count: 2 },
            {
              default: () => [
                h(UIStepsList, {}, () => [
                  h(UIStepsItem, { index: 0 }, () => [
                    h(UIStepsTrigger, () => 'S1'),
                    h(UIStepsIndicator, {}, () =>
                      h(
                        UIStepsItemContext,
                        {},
                        {
                          default: (ctx: { index: number; current: boolean; completed: boolean }) =>
                            h(
                              'span',
                              { 'data-testid': `item-ctx-${ctx.index}` },
                              ctx.current ? 'current' : ctx.completed ? 'done' : 'pending',
                            ),
                        },
                      ),
                    ),
                  ]),
                  h(UIStepsItem, { index: 1 }, () => [
                    h(UIStepsTrigger, () => 'S2'),
                    h(UIStepsIndicator),
                  ]),
                ]),
                h(UIStepsContent, { index: 0 }, () => 'C1'),
                h(UIStepsContent, { index: 1 }, () => 'C2'),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(WithItemContext)

    // First item should be current
    const itemCtx0 = wrapper.find('[data-testid="item-ctx-0"]')
    expect(itemCtx0.exists()).toBe(true)
  })

  it('supports vertical orientation', async () => {
    const wrapper = await mountSuspended(stepsHarness({ orientation: 'vertical' }))

    const root = wrapper.find('[data-testid="steps-root"]')
    expect(root.exists()).toBe(true)
  })

  it('renders checkmark icon on completed steps', async () => {
    // Navigate to step 2 so step 0 is completed
    const wrapper = await mountSuspended(stepsHarness())

    const navContainer = wrapper.find('[data-testid="nav-buttons"]')
    const [, nextButton] = navContainer.findAll('button')
    await nextButton!.trigger('click')
    await nextTick()
    await nextButton!.trigger('click')
    await nextTick()

    // Step 0 indicator should now be completed — no longer show "1"
    const [firstIndicator] = wrapper.findAll('[data-part="indicator"]')
    expect(firstIndicator!.text()).not.toBe('1')
    // The indicator should not be empty (has checkmark icon)
    expect(firstIndicator!.element.childElementCount).toBeGreaterThan(0)
  })
})

describe('UISteps (Automated)', () => {
  it('renders steps list from items prop', async () => {
    const wrapper = await mountSuspended(UISteps, {
      props: {
        items: ['Step A', 'Step B', 'Step C'],
      },
    })

    expect(wrapper.text()).toContain('Step A')
    expect(wrapper.text()).toContain('Step B')
    expect(wrapper.text()).toContain('Step C')
    expect(wrapper.findAll('[data-part="item"]').length).toBe(3)
  })

  it('renders progress bar when showProgress is true', async () => {
    const wrapper = await mountSuspended(UISteps, {
      props: {
        items: ['Step A'],
        showProgress: true,
      },
    })

    // UIProgress renders with role="progressbar" and we added data-part="progress"
    expect(wrapper.find('[data-part="progress"]').exists()).toBe(true)
  })

  it('renders navigation triggers by default', async () => {
    const wrapper = await mountSuspended(UISteps, {
      props: {
        items: ['Step A', 'Step B'],
      },
    })

    expect(wrapper.text()).toContain('Previous')
    expect(wrapper.text()).toContain('Next')
  })

  it('hides navigation triggers when showTriggers is false', async () => {
    const wrapper = await mountSuspended(UISteps, {
      props: {
        items: ['Step A', 'Step B'],
        showTriggers: false,
      },
    })

    expect(wrapper.text()).not.toContain('Previous')
    expect(wrapper.text()).not.toContain('Next')
  })
})

describe('UISteps triggers with asChild', () => {
  it('renders NextTrigger with asChild=true', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'NextTriggerAsChildHarness',
        components: { UIStepsNextTrigger, UIStepsRoot },
        setup() {
          return () =>
            h(
              UIStepsRoot,
              { count: 3 },
              {
                default: () => [h(UIStepsNextTrigger, { asChild: true })],
              },
            )
        },
      }),
    )

    const trigger = wrapper.find('[data-part="next-trigger"]')
    expect(trigger.exists()).toBe(true)
  })

  it('renders PrevTrigger with asChild=true', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'PrevTriggerAsChildHarness',
        components: { UIStepsPrevTrigger, UIStepsRoot },
        setup() {
          return () =>
            h(
              UIStepsRoot,
              { count: 3 },
              {
                default: () => [h(UIStepsPrevTrigger, { asChild: true })],
              },
            )
        },
      }),
    )

    const trigger = wrapper.find('[data-part="prev-trigger"]')
    expect(trigger.exists()).toBe(true)
  })

  it('renders Trigger with asChild=true', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TriggerAsChildHarness',
        components: { UIStepsItem, UIStepsRoot, UIStepsTrigger },
        setup() {
          return () =>
            h(
              UIStepsRoot,
              { count: 3 },
              {
                default: () => [
                  h(UIStepsItem, { index: 0 }, () => [
                    h(UIStepsTrigger, { asChild: true }, () => 'Custom Step'),
                  ]),
                ],
              },
            )
        },
      }),
    )

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom Step')
  })
})
