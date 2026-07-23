import { useTooltip } from '@ark-ui/vue/tooltip'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import Tooltip from '~ui/app/components/Tooltip.vue'

describe('Tooltip', () => {
  it('renders content when controlled open is true', async () => {
    const wrapper = await mountSuspended(Tooltip, {
      props: {
        content: "I'm a tooltip",
        open: true,
      },
    })

    const content = wrapper.find('[data-part="content"]')
    expect(content.exists()).toBe(true)
    expect(content.attributes('data-state')).toBe('open')
    expect(content.text()).toContain("I'm a tooltip")
  })

  it('renders two triggers in shared tooltip slot', async () => {
    const wrapper = await mountSuspended(Tooltip, {
      props: {
        content: 'Shared tooltip',
      },
      slots: {
        triggers: `
          <template #default="{ trigger: Trigger }">
            <component :is="Trigger" value="first">First trigger</component>
            <component :is="Trigger" value="second">Second trigger</component>
          </template>
        `,
      },
    })

    const triggers = wrapper.findAll('[data-part="trigger"]')
    expect(triggers).toHaveLength(2)
  })

  it('renders dynamic slot content from controlled triggerValue', async () => {
    const wrapper = await mountSuspended(Tooltip, {
      props: {
        open: true,
        triggerValue: 'second',
      },
      slots: {
        content: `
          <template #default="{ triggerValue }">
            <span data-testid="dynamic-content">Active: {{ triggerValue }}</span>
          </template>
        `,
      },
    })

    const content = wrapper.find('[data-testid="dynamic-content"]')
    expect(content.exists()).toBe(true)
    expect(content.text()).toBe('Active: second')
  })

  it('passes triggerValue to triggers slot scope', async () => {
    const wrapper = await mountSuspended(Tooltip, {
      props: {
        triggerValue: 'third',
      },
      slots: {
        triggers: `
          <template #default="{ trigger: Trigger, triggerValue }">
            <span data-testid="trigger-value">{{ triggerValue }}</span>
            <component :is="Trigger" value="first">First trigger</component>
          </template>
        `,
      },
    })

    expect(wrapper.find('[data-testid="trigger-value"]').text()).toBe('third')
    expect(wrapper.findAll('[data-part="trigger"]')).toHaveLength(1)
  })

  it('uses RootProvider mode when value prop is provided', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TooltipProviderTest',
        components: { Tooltip },
        setup() {
          const tooltip = useTooltip({ openDelay: 500 })
          return { tooltip }
        },
        template: `
          <Tooltip :value="tooltip" content="Provider tooltip">
            <template #trigger>
              <button data-testid="trigger">Hover</button>
            </template>
          </Tooltip>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="trigger"]').exists()).toBe(true)
  })

  it('renders with followCursor prop enabled', async () => {
    const wrapper = await mountSuspended(Tooltip, {
      props: {
        content: 'Follow cursor tooltip',
        followCursor: true,
        open: true,
      },
    })

    const content = wrapper.find('[data-part="content"]')
    expect(content.exists()).toBe(true)
    expect(content.text()).toContain('Follow cursor tooltip')
  })

  it('handles pointermove event on trigger when followCursor is enabled', async () => {
    const wrapper = await mountSuspended(Tooltip, {
      props: {
        content: 'Follow cursor tooltip',
        followCursor: true,
        open: true,
      },
    })

    const trigger = wrapper.find('[data-part="trigger"]')
    expect(trigger.exists()).toBe(true)

    const pointerMoveEvent = new PointerEvent('pointermove', {
      clientX: 100,
      clientY: 200,
    })
    trigger.element.dispatchEvent(pointerMoveEvent)

    expect(wrapper.exists()).toBe(true)
  })

  it('renders custom trigger slot content', async () => {
    const wrapper = await mountSuspended(Tooltip, {
      props: {
        content: 'Custom trigger tooltip',
      },
      slots: {
        trigger: '<span data-testid="custom-trigger">Custom Trigger</span>',
      },
    })

    expect(wrapper.find('[data-testid="custom-trigger"]').text()).toBe('Custom Trigger')
  })

  it('renders with different intent variants', async () => {
    const intents = ['neutral', 'primary', 'secondary', 'accent'] as const

    for (const intent of intents) {
      const wrapper = await mountSuspended(Tooltip, {
        props: {
          content: `${intent} tooltip`,
          intent,
          open: true,
        },
      })

      const content = wrapper.find('[data-part="content"]')
      expect(content.exists()).toBe(true)
    }
  })

  it('renders with different size variants', async () => {
    const sizes = ['sm', 'md', 'lg'] as const

    for (const size of sizes) {
      const wrapper = await mountSuspended(Tooltip, {
        props: {
          content: `${size} tooltip`,
          open: true,
          size,
        },
      })

      const content = wrapper.find('[data-part="content"]')
      expect(content.exists()).toBe(true)
    }
  })
})
