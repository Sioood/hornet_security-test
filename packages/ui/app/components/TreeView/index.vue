<script setup lang="ts">
import {
  createTreeViewCollection,
  getTreeViewRootChildren,
} from '~/utils/Components/TreeView/collection'

import type { TreeViewRootProps, UITreeViewRootSlots } from './Root.vue'
import type { TreeCollection } from '@ark-ui/vue/tree-view'
import type {
  TreeViewIntent,
  TreeViewItem,
  TreeViewMode,
  TreeViewSize,
} from '~/utils/Components/TreeView/context'

defineOptions({ inheritAttrs: false })

export type { TreeViewItem } from '~/utils/Components/TreeView/context'

export interface UITreeViewSlots extends UITreeViewRootSlots {
  label?: string
}

/**
 * High-level TreeView with optional `items` auto-rendering.
 *
 * - Provide `items` to auto-render nodes via `UITreeViewNode`.
 * - Omit `items` and compose manually with sub-components inside the default slot.
 *
 * For full control, use `UITreeViewRoot` directly.
 */
export interface UITreeViewProps extends Omit<TreeViewRootProps, 'collection'> {
  items?: TreeViewItem[] | null
  collection?: TreeCollection<TreeViewItem>
  /** Visible tree heading (rendered via `UITreeViewLabel`). */
  label?: string
  mode?: TreeViewMode
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewSlots>
}

const props = withDefaults(defineProps<UITreeViewProps>(), {
  collection: undefined,
  intent: 'primary',
  items: undefined,
  label: undefined,
  mode: 'normal',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const expandedValue = defineModel<string[]>('expandedValue', { required: false })
const selectedValue = defineModel<string[]>('selectedValue', { required: false })
const checkedValue = defineModel<string[]>('checkedValue', { required: false })
const focusedValue = defineModel<string | null>('focusedValue', { required: false })

const attrs = useAttrs()

const resolvedCollection = computed(() => {
  if (props.collection) return props.collection
  if (props.items !== undefined && props.items !== null) {
    return createTreeViewCollection(props.items)
  }
  return undefined
})

const rootChildren = computed(() =>
  resolvedCollection.value ? getTreeViewRootChildren(resolvedCollection.value) : [],
)

const hasAutoItems = computed(() => props.items !== undefined && props.items !== null)

const rootPassthrough = computed(() => {
  const { items: _items, label: _label, ui: _ui, ...rest } = props
  return rest
})
</script>

<template>
  <UITreeViewRoot
    v-bind="{ ...rootPassthrough, ...attrs, collection: resolvedCollection }"
    v-model:expanded-value="expandedValue"
    v-model:selected-value="selectedValue"
    v-model:checked-value="checkedValue"
    v-model:focused-value="focusedValue"
    :ui="{ root: cn(ui?.root) }"
  >
    <UITreeViewLabel v-if="label">{{ label }}</UITreeViewLabel>

    <UITreeViewTree>
      <slot v-if="!hasAutoItems" />

      <template v-else>
        <UITreeViewNode
          v-for="(item, index) in rootChildren"
          :key="item.id"
          :node="item"
          :index-path="[index]"
          :mode="mode"
        />
      </template>
    </UITreeViewTree>
  </UITreeViewRoot>
</template>
