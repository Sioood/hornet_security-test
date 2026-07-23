<script setup lang="ts">
import {
  TreeView as ArkTreeView,
  type TreeViewRootBaseProps,
  type TreeViewRootProviderBaseProps,
  type UseTreeViewReturn,
} from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewItem,
  type TreeViewMode,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewRootCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue, UnwrapRef } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewRootSlots {
  root?: ClassValue
}

export interface TreeViewRootProps
  extends
    Omit<
      TreeViewRootBaseProps<TreeViewItem>,
      'checkedValue' | 'expandedValue' | 'focusedValue' | 'selectedValue'
    >,
    Omit<TreeViewRootProviderBaseProps<TreeViewItem>, 'value'> {
  /**
   * Pass the return value of `useTreeView()` to enable **RootProvider** mode.
   */
  value?: UnwrapRef<UseTreeViewReturn<TreeViewItem>>
  mode?: TreeViewMode
  intent?: TreeViewIntent
  size?: TreeViewSize
  invalid?: boolean
  ui?: Partial<UITreeViewRootSlots>
}

const props = withDefaults(defineProps<TreeViewRootProps>(), {
  intent: 'primary',
  invalid: false,
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

provide(treeViewChromeKey, {
  intent: toRef(props, 'intent'),
  invalid: toRef(props, 'invalid'),
  mode: toRef(props, 'mode'),
  size: toRef(props, 'size'),
})

const isProvider = computed(() => props.value !== undefined)
const isCheckboxMode = computed(() => props.mode === 'checkbox')

const rootComponent = computed(() =>
  isProvider.value ? ArkTreeView.RootProvider : ArkTreeView.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'lazyMount', 'unmountOnExit', 'value'])
  }

  return pick(props, [
    'asChild',
    'canRename',
    'collection',
    'defaultCheckedValue',
    'defaultExpandedValue',
    'defaultFocusedValue',
    'defaultSelectedValue',
    'expandOnClick',
    'id',
    'ids',
    'lazyMount',
    'loadChildren',
    'scrollToIndexFn',
    'selectionMode',
    'typeahead',
    'unmountOnExit',
  ])
})

const resolvedDefaultCheckedValue = computed(() => {
  if (!isCheckboxMode.value || isProvider.value) return undefined
  if (props.defaultCheckedValue !== undefined) return props.defaultCheckedValue
  if (checkedValue.value !== undefined) return undefined
  return []
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(
      treeViewRootCVA({ intent: props.intent, size: props.size }),
      arkAttrs.value.class as ClassValue,
      props.ui?.root,
    ),
  }

  if (!isProvider.value) {
    if (isCheckboxMode.value && props.expandOnClick === undefined) {
      base.expandOnClick = false
    }

    if (resolvedDefaultCheckedValue.value !== undefined) {
      base.defaultCheckedValue = resolvedDefaultCheckedValue.value
    }

    if (expandedValue.value !== undefined) {
      base.expandedValue = expandedValue.value
      base['onUpdate:expandedValue'] = (next: string[]) => {
        expandedValue.value = next
      }
    }

    if (selectedValue.value !== undefined) {
      base.selectedValue = selectedValue.value
      base['onUpdate:selectedValue'] = (next: string[]) => {
        selectedValue.value = next
      }
    }

    if (isCheckboxMode.value && checkedValue.value !== undefined) {
      base.checkedValue = checkedValue.value
      base['onUpdate:checkedValue'] = (next: string[]) => {
        checkedValue.value = next
      }
    }

    if (focusedValue.value !== undefined) {
      base.focusedValue = focusedValue.value ?? undefined
      base['onUpdate:focusedValue'] = (next: string | null) => {
        focusedValue.value = next
      }
    }
  }

  return base
})

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    mode: 'normal',
    size: 'md',
  },
})
</script>

<template>
  <component :is="rootComponent" v-bind="rootBindings">
    <slot />
  </component>
</template>
