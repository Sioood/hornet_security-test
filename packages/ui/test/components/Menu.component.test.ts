import { mountSuspended } from '@nuxt/test-utils/runtime'
import { DOMWrapper, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Menu from '~ui/app/components/Menu/index.vue'

describe('Menu', () => {
  it('closes menu after item select when open is uncontrolled', async () => {
    const wrapper = await mountSuspended(Menu, {
      props: {
        items: [{ label: 'Go', value: 'go' }],
      },
    })

    await wrapper.find('[data-part="trigger"]').trigger('click')
    await flushPromises()
    expect(document.body.querySelector('[data-part="content"][data-state="open"]')).not.toBeNull()

    const itemEl = document.body.querySelector('[data-part="item"][data-value="go"]')
    expect(itemEl).not.toBeNull()
    await new DOMWrapper(itemEl as HTMLElement).trigger('click')
    await flushPromises()

    expect(document.body.querySelector('[data-part="content"][data-state="open"]')).toBeNull()
    wrapper.unmount()
    await flushPromises()
  })

  it('keeps menu open when checkbox item has closeOnSelect false', async () => {
    const wrapper = await mountSuspended(Menu, {
      props: {
        items: [
          {
            checked: false,
            closeOnSelect: false,
            label: 'Option',
            type: 'checkbox',
            value: 'opt',
          },
        ],
        open: true,
      },
    })

    const checkboxEl = document.body.querySelector('[data-part="item"][data-value="opt"]')
    expect(checkboxEl).not.toBeNull()
    await new DOMWrapper(checkboxEl as HTMLElement).trigger('click')
    await flushPromises()

    expect(document.body.querySelector('[data-part="content"][data-state="open"]')).not.toBeNull()
    wrapper.unmount()
    await flushPromises()
  })

  it('closes menu after item select when using v-model:open', async () => {
    const open = ref(true)

    const Harness = defineComponent({
      setup() {
        return () =>
          h(Menu, {
            items: [{ label: 'Go', value: 'go' }],
            'onUpdate:open': (value: boolean) => {
              open.value = value
            },
            open: open.value,
          })
      },
    })

    const wrapper = await mountSuspended(Harness)
    await flushPromises()
    expect(document.body.querySelector('[data-part="content"][data-state="open"]')).not.toBeNull()

    const itemEl = document.body.querySelector('[data-part="item"][data-value="go"]')
    expect(itemEl).not.toBeNull()
    await new DOMWrapper(itemEl as HTMLElement).trigger('click')
    await flushPromises()

    expect(open.value).toBe(false)
    expect(document.body.querySelector('[data-part="content"][data-state="open"]')).toBeNull()
    wrapper.unmount()
    await flushPromises()
  })

  it('renders configured items when controlled open is true', async () => {
    await mountSuspended(Menu, {
      props: {
        items: [
          { label: 'Edit', type: 'item', value: 'edit' },
          { type: 'separator' },
          { label: 'Delete', type: 'item', value: 'delete' },
        ],
        open: true,
      },
    })

    const content = document.body.querySelector('[data-part="content"]')
    expect(content).not.toBeNull()
    expect(content?.textContent).toContain('Edit')
    expect(content?.textContent).toContain('Delete')
    expect(document.body.querySelector('[data-part="separator"]')).not.toBeNull()
  })

  it('renders links through item as-child mode', async () => {
    await mountSuspended(Menu, {
      props: {
        items: [
          {
            label: 'Documentation',
            target: '_blank',
            to: 'https://ark-ui.com',
            type: 'item',
            value: 'docs',
          },
        ],
        open: true,
      },
    })

    const link = document.body.querySelector('a[href="https://ark-ui.com"]')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.className).toMatch(/px-2/)
  })

  it('renders checkbox entry labels', async () => {
    const wrapper = await mountSuspended(Menu, {
      props: {
        items: [{ checked: false, label: 'Toolbar', type: 'checkbox', value: 'toolbar' }],
        open: true,
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(document.body.textContent).toContain('Toolbar')
  })

  it('renders group entries and forwards ui classes to entries', async () => {
    await mountSuspended(Menu, {
      props: {
        items: [
          {
            items: [
              { label: 'Duplicate', type: 'item', value: 'duplicate' },
              { type: 'separator' },
              { label: 'Move', type: 'item', value: 'move' },
            ],
            label: 'Manage',
            type: 'group',
          },
        ],
        open: true,
        ui: {
          item: 'test-item-class',
          itemGroup: 'test-group-class',
          itemGroupLabel: 'test-group-label-class',
          separator: 'test-separator-class',
        },
      },
    })

    expect(document.body.querySelector('.test-group-class')).not.toBeNull()
    expect(document.body.querySelector('.test-group-label-class')?.textContent).toContain('Manage')
    expect(document.body.querySelector('.test-item-class')).not.toBeNull()
    expect(document.body.querySelector('.test-separator-class')).not.toBeNull()
  })

  it('renders mixed group entry types including submenu and radio', async () => {
    await mountSuspended(Menu, {
      props: {
        items: [
          {
            items: [
              { checked: true, label: 'Audit log', type: 'checkbox', value: 'audit' },
              {
                items: [
                  { label: 'Safe', value: 'safe' },
                  { label: 'Fast', value: 'fast' },
                ],
                label: 'Mode',
                type: 'radio-group',
                value: 'safe',
              },
              {
                items: [{ label: 'Deep action', type: 'item', value: 'deep' }],
                label: 'More',
                type: 'submenu',
              },
            ],
            label: 'Advanced',
            type: 'group',
          },
        ],
        open: true,
      },
    })

    expect(document.body.textContent).toContain('Advanced')
    expect(document.body.textContent).toContain('Audit log')
    expect(document.body.textContent).toContain('Mode')
    expect(document.body.textContent).toContain('More')
  })

  it('renders default trigger indicator by default', async () => {
    const wrapper = await mountSuspended(Menu)

    expect(wrapper.find('[data-part="indicator"]').exists()).toBe(true)
  })

  it('does not render trigger indicator when showIndicator is false', async () => {
    await mountSuspended(Menu, {
      props: {
        showIndicator: false,
      },
    })

    expect(document.body.querySelector('[data-part="indicator"]')).toBeNull()
  })

  it('supports multiple triggers and nested content slots', async () => {
    const wrapper = await mountSuspended(Menu, {
      props: {
        open: true,
      },
      slots: {
        content: `
          <template #default="{ root: Root, triggerItem: TriggerItem, item: Item }">
            <component :is="Item" value="base">Base</component>
            <component :is="Root">
              <component :is="TriggerItem">More</component>
            </component>
          </template>
        `,
        triggers: `
          <template #default="{ trigger: Trigger }">
            <component :is="Trigger" value="one">One</component>
            <component :is="Trigger" value="two">Two</component>
          </template>
        `,
      },
    })

    expect(wrapper.findAll('[data-part="trigger"]')).toHaveLength(2)
    expect(document.body.querySelector('[data-part="trigger-item"]')).not.toBeNull()
  })

  it('applies intent variant classes to trigger', async () => {
    const wrapper = await mountSuspended(Menu, {
      props: {
        intent: 'primary',
      },
    })

    const trigger = wrapper.find('[data-part="trigger"]')
    expect(trigger.classes().join(' ')).toMatch(/primary/)
  })

  it('shows arrow when showArrow is true', async () => {
    await mountSuspended(Menu, {
      props: {
        items: [{ label: 'A', type: 'item', value: 'a' }],
        open: true,
        showArrow: true,
      },
    })

    expect(document.body.querySelector('[data-part="arrow"]')).not.toBeNull()
  })

  it('renders context trigger text when contextTriggerText is set', async () => {
    const wrapper = await mountSuspended(Menu, {
      props: {
        contextTriggerText: 'Right-click here',
      },
    })

    expect(wrapper.text()).toContain('Right-click here')
  })

  it('renders custom trigger text', async () => {
    const wrapper = await mountSuspended(Menu, {
      props: {
        triggerText: 'Options',
      },
    })

    expect(wrapper.find('[data-part="trigger"]').text()).toContain('Options')
  })

  it('applies custom ui classes to positioner and content', async () => {
    await mountSuspended(Menu, {
      props: {
        items: [{ label: 'A', type: 'item', value: 'a' }],
        open: true,
        ui: {
          content: 'custom-content',
          positioner: 'custom-positioner',
        },
      },
    })

    expect(document.body.querySelector('.custom-positioner')).not.toBeNull()
    expect(document.body.querySelector('.custom-content')).not.toBeNull()
  })

  it('renders disabled items with disabled attribute', async () => {
    await mountSuspended(Menu, {
      props: {
        items: [{ disabled: true, label: 'Disabled', type: 'item', value: 'disabled' }],
        open: true,
      },
    })

    const items = document.body.querySelectorAll('[data-part="item"]')
    const item = Array.from(items).find((el) => el.textContent?.includes('Disabled'))
    expect(item).not.toBeUndefined()
    expect(
      item?.hasAttribute('data-disabled') || item?.getAttribute('aria-disabled') === 'true',
    ).toBe(true)
  })

  it('calls onSelect callback when item is selected', async () => {
    const onSelect = vi.fn()
    await mountSuspended(Menu, {
      props: {
        items: [{ label: 'Action', onSelect, type: 'item', value: 'action' }],
        open: true,
      },
    })

    const item = document.body.querySelector('[data-part="item"]')
    expect(item).not.toBeNull()
    expect(document.body.textContent).toContain('Action')
  })

  it('calls onCheckedChange callback when checkbox item is toggled', async () => {
    const onCheckedChange = vi.fn()
    await mountSuspended(Menu, {
      props: {
        items: [
          { checked: false, label: 'Toggle', onCheckedChange, type: 'checkbox', value: 'toggle' },
        ],
        open: true,
      },
    })

    expect(document.body.textContent).toContain('Toggle')
  })

  it('calls onValueChange callback when radio item selection changes', async () => {
    const onValueChange = vi.fn()
    await mountSuspended(Menu, {
      props: {
        items: [
          {
            items: [
              { label: 'Option A', value: 'a' },
              { label: 'Option B', value: 'b' },
            ],
            label: 'Options',
            onValueChange,
            type: 'radio-group',
            value: 'a',
          },
        ],
        open: true,
      },
    })

    expect(document.body.textContent).toContain('Options')
    expect(document.body.textContent).toContain('Option A')
  })

  it('renders item with to as anchor tag with rel attribute', async () => {
    await mountSuspended(Menu, {
      props: {
        items: [
          {
            label: 'External Link',
            target: '_blank',
            to: 'https://example.com',
            type: 'item',
            value: 'link',
          },
        ],
        open: true,
      },
    })

    const link = document.body.querySelector('a[href="https://example.com"]')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('renders custom #trigger slot with w-fit unstyled anchor', async () => {
    const wrapper = await mountSuspended(Menu, {
      slots: {
        trigger: '<span class="custom-menu-trigger">Open</span>',
      },
    })

    const trigger = wrapper.find('[data-part="trigger"]')
    expect(trigger.element.tagName).toBe('SPAN')
    expect(trigger.classes()).toContain('w-fit')
    expect(trigger.find('.custom-menu-trigger').exists()).toBe(true)
    expect(trigger.classes().join(' ')).not.toMatch(/primary-fill|neutral-fill-subtle/)
  })

  it('applies w-fit to default styled trigger', async () => {
    const wrapper = await mountSuspended(Menu, {
      props: { triggerText: 'Actions' },
    })

    expect(wrapper.find('[data-part="trigger"]').classes()).toContain('w-fit')
  })

  it('does not apply default button styles when unstyled is true', async () => {
    const wrapper = await mountSuspended(Menu, {
      props: {
        triggerText: 'Actions',
        unstyled: true,
      },
    })

    const trigger = wrapper.find('[data-part="trigger"]')
    expect(trigger.classes().join(' ')).not.toMatch(/primary-fill|neutral-fill-subtle/)
  })
})
