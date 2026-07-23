<script setup lang="ts">
import {
  buildTreeViewCheckedState,
  emptyTreeViewCheckedState,
  type TreeViewCheckedState,
} from '~/utils/Components/TreeView/checked-state'
import {
  createTreeViewCollection,
  getTreeViewRootChildren,
} from '~/utils/Components/TreeView/collection'

import type { TreeViewCheckedChangeDetails, UseTreeViewContext } from '@ark-ui/vue/tree-view'
import type { ClassValue } from 'vue'
import type {
  TreeViewIntent,
  TreeViewItem,
  TreeViewSize,
} from '~/utils/Components/TreeView/context'
import type { FieldProps } from '~ui/app/components/Form/Field.vue'
import type { FormControlShellProps } from '~ui/app/components/Form/FormControlShell.vue'

defineOptions({ inheritAttrs: false })

export type { TreeViewCheckedState } from '~/utils/Components/TreeView/checked-state'
export type { TreeViewItem } from '~/utils/Components/TreeView/context'

export interface UIFormTreeViewSlots {
  root?: ClassValue
  tree?: ClassValue
  node?: ClassValue
}

export interface FormTreeViewProps extends Omit<FieldProps, 'ui'> {
  items: TreeViewItem[]
  intent?: TreeViewIntent
  size?: TreeViewSize
  selectionMode?: 'multiple' | 'single'
  ui?: Partial<UIFormTreeViewSlots>
}

const modelValue = defineModel<TreeViewCheckedState>({
  default: () => emptyTreeViewCheckedState(),
})

const props = withDefaults(defineProps<FormTreeViewProps>(), {
  error: undefined,
  helperText: undefined,
  intent: 'primary',
  label: undefined,
  selectionMode: 'multiple',
  size: 'md',
  ui: undefined,
})

const attrs = useAttrs()
const treeContext = ref<UseTreeViewContext<TreeViewItem> | null>(null)

const collection = computed(() => createTreeViewCollection(props.items))
const rootChildren = computed(() => getTreeViewRootChildren(collection.value))

const checkedIds = computed({
  get: () => modelValue.value.value,
  set: (next: string[]) => {
    modelValue.value = buildTreeViewCheckedState(next, treeContext.value?.getCheckedMap())
  },
})

const shellProps = computed<FormControlShellProps>(() => ({
  disabled: props.disabled,
  error: props.error,
  helperText: props.helperText,
  intent: props.intent,
  invalid: props.invalid || String(props.error ?? '').length > 0,
  label: props.label,
  readOnly: props.readOnly,
  required: props.required,
  size: props.size,
  ui: {
    shell: cn('border-0 bg-transparent p-0 shadow-none', props.ui?.root),
  },
}))

const rootPassthrough = computed(() => {
  const {
    error: _error,
    helperText: _helperText,
    items: _items,
    label: _label,
    ui: _ui,
    ...rest
  } = props
  return rest
})

function handleCheckedChange(details: TreeViewCheckedChangeDetails) {
  modelValue.value = buildTreeViewCheckedState(
    details.checkedValue,
    treeContext.value?.getCheckedMap(),
  )
}

function handleContextReady(context: UseTreeViewContext<TreeViewItem>) {
  treeContext.value = context
}

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    label: 'Tree',
    size: 'md',
  },
})
</script>

<template>
  <UIFormControlShell v-bind="shellProps">
    <UITreeViewRoot
      v-bind="{ ...rootPassthrough, ...attrs }"
      v-model:checked-value="checkedIds"
      mode="checkbox"
      :collection="collection"
      :selection-mode="selectionMode"
      :invalid="shellProps.invalid"
      :ui="{ root: cn('max-w-none', ui?.tree) }"
      @checked-change="handleCheckedChange"
    >
      <UITreeViewTree>
        <UITreeViewContext v-slot="ctx">
          <UITreeViewContextBridge :context="ctx" @ready="handleContextReady" />
        </UITreeViewContext>

        <UITreeViewNode
          v-for="(item, index) in rootChildren"
          :key="item.id"
          :node="item"
          :index-path="[index]"
          mode="checkbox"
          :class="ui?.node"
        />
      </UITreeViewTree>
    </UITreeViewRoot>
  </UIFormControlShell>
</template>
