import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import Chip from '~ui/app/components/Chip.vue'

describe('Chip', () => {
  it('renders the label', async () => {
    const wrapper = await mountSuspended(Chip, {
      props: { label: 'Filter' },
    })

    expect(wrapper.text()).toContain('Filter')
  })

  it('applies chipIcon size classes for each size variant', async () => {
    const sizes = [
      { iconSizeClass: 'size-2.5', size: 'sm' as const },
      { iconSizeClass: 'size-3', size: 'md' as const },
      { iconSizeClass: 'size-4', size: 'lg' as const },
    ]

    for (const { size, iconSizeClass } of sizes) {
      const wrapper = await mountSuspended(Chip, {
        props: {
          icon: 'tabler:tag',
          label: 'X',
          size,
        },
      })

      const sizeIcons = wrapper
        .findAll('*')
        .filter((w) => w.classes().some((c) => c.startsWith('size-')))
      const [mainIcon] = sizeIcons
      expect(mainIcon, `main icon for size ${size}`).toBeDefined()
      expect(mainIcon!.classes()).toContain(iconSizeClass)
    }
  })

  it('merges ui.icon onto the main icon', async () => {
    const wrapper = await mountSuspended(Chip, {
      props: {
        icon: 'tabler:tag',
        label: 'Y',
        ui: { icon: 'custom-chip-icon' },
      },
    })

    const main = wrapper.find('.custom-chip-icon')
    expect(main.exists()).toBe(true)
    expect(main.classes().some((c) => c.startsWith('size-'))).toBe(true)
  })

  it('invokes onClick when the action icon is clicked and onIconAction is true', async () => {
    const onClick = vi.fn()
    const wrapper = await mountSuspended(Chip, {
      props: {
        label: 'Remove',
        onClick,
        onIconAction: true,
      },
    })

    const action = wrapper.findAll('*').find((w) => w.classes().includes('size-3'))
    expect(action).toBeDefined()
    await action!.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('invokes onClick when the root is clicked and onIconAction is false', async () => {
    const onClick = vi.fn()
    const wrapper = await mountSuspended(Chip, {
      props: {
        label: 'Whole chip',
        onClick,
        onIconAction: false,
      },
    })

    await wrapper.find('div.group').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not invoke onClick when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = await mountSuspended(Chip, {
      props: {
        disabled: true,
        label: 'Off',
        onClick,
      },
    })

    const action = wrapper.findAll('*').find((w) => w.classes().includes('size-3'))
    expect(action).toBeDefined()
    await action!.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })
})
