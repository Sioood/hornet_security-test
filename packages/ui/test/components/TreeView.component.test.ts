import { useTreeView } from '@ark-ui/vue/tree-view'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import UIFormTreeView from '~ui/app/components/Form/TreeView/index.vue'
import UITreeView from '~ui/app/components/TreeView/index.vue'
import UITreeViewNode from '~ui/app/components/TreeView/Node.vue'
import UITreeViewRoot from '~ui/app/components/TreeView/Root.vue'
import { emptyTreeViewCheckedState } from '~ui/app/utils/Components/TreeView/checked-state'
import { createTreeViewCollection } from '~ui/app/utils/Components/TreeView/collection'

import type { TreeViewItem } from '~ui/app/utils/Components/TreeView/context'

const treeItems: TreeViewItem[] = [
  {
    children: [
      { id: 'src/main.ts', label: 'main.ts' },
      { id: 'src/app.vue', label: 'app.vue' },
    ],
    id: 'src',
    label: 'src',
  },
  { id: 'package.json', label: 'package.json' },
]

describe('UITreeView', () => {
  it('renders auto-generated nodes from items', async () => {
    const wrapper = await mountSuspended(UITreeView, {
      props: {
        defaultExpandedValue: ['src'],
        items: treeItems,
        label: 'Files',
      },
    })

    expect(wrapper.text()).toContain('Files')
    expect(wrapper.text()).toContain('src')
    expect(wrapper.text()).toContain('main.ts')
  })

  it('expands branches matching defaultExpandedValue', async () => {
    const wrapper = await mountSuspended(UITreeView, {
      props: {
        defaultExpandedValue: ['src'],
        items: treeItems,
      },
    })

    expect(wrapper.text()).toContain('main.ts')
  })

  it('renders checkbox controls in checkbox mode', async () => {
    const wrapper = await mountSuspended(UITreeView, {
      props: {
        defaultExpandedValue: ['src'],
        items: treeItems,
        mode: 'checkbox',
      },
    })

    expect(wrapper.find('[data-part="node-checkbox"]').exists()).toBe(true)
    expect(wrapper.find('[data-part="branch-trigger"]').exists()).toBe(true)
  })

  it('expands a branch when clicking the branch trigger in checkbox mode', async () => {
    const wrapper = await mountSuspended(UITreeView, {
      props: {
        items: treeItems,
        mode: 'checkbox',
      },
    })

    const branchContent = wrapper.find('[data-part="branch-content"]')
    expect(branchContent.attributes('data-state')).toBe('closed')

    await wrapper.find('[data-part="branch-trigger"]').trigger('click')
    await nextTick()

    expect(branchContent.attributes('data-state')).toBe('open')
  })

  it('uses RootProvider mode when value prop is provided', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'TreeViewProviderHarness',
        setup() {
          const collection = createTreeViewCollection(treeItems)
          const tree = useTreeView({
            collection,
            defaultExpandedValue: ['src'],
          })

          return () =>
            h(
              UITreeViewRoot,
              { 'data-testid': 'tree-root', value: tree.value },
              {
                default: () => [
                  h(UITreeViewNode, {
                    indexPath: [0],
                    node: treeItems[0]!,
                  }),
                ],
              },
            )
        },
      }),
    )

    expect(wrapper.find('[data-testid="tree-root"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('src')
  })
})

describe('UIFormTreeView', () => {
  it('renders label and tree nodes', async () => {
    const wrapper = await mountSuspended(UIFormTreeView, {
      props: {
        items: treeItems,
        label: 'Permissions',
        modelValue: emptyTreeViewCheckedState(),
      },
    })

    expect(wrapper.text()).toContain('Permissions')
    expect(wrapper.text()).toContain('src')
    expect(wrapper.find('[data-part="node-checkbox"]').exists()).toBe(true)
  })

  it('emits rich checked state on interaction', async () => {
    const wrapper = await mountSuspended(UIFormTreeView, {
      props: {
        defaultExpandedValue: ['src'],
        items: treeItems,
        modelValue: emptyTreeViewCheckedState(),
      },
    })

    const leafCheckbox = wrapper.find('[data-part="node-checkbox"]')
    expect(leafCheckbox.exists()).toBe(true)
    await leafCheckbox.trigger('click')
    await nextTick()

    const updates = wrapper.emitted('update:modelValue')
    expect(updates?.length).toBeGreaterThan(0)

    const lastUpdate = updates?.at(-1)?.[0] as {
      value: string[]
      branches: Record<string, unknown>
      leaves: Record<string, unknown>
    }

    expect(Array.isArray(lastUpdate.value)).toBe(true)
    expect(lastUpdate).toHaveProperty('branches')
    expect(lastUpdate).toHaveProperty('leaves')
  })
})
