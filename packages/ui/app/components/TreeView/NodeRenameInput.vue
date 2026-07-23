<script setup lang="ts">
import {
  TreeView as ArkTreeView,
  type TreeViewNodeRenameInputBaseProps,
} from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewNodeRenameInputCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewNodeRenameInputSlots {
  root?: ClassValue
}

export interface TreeViewNodeRenameInputProps extends TreeViewNodeRenameInputBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewNodeRenameInputSlots>
}

const props = withDefaults(defineProps<TreeViewNodeRenameInputProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const inputProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.NodeRenameInput
    v-bind="{ ...inputProps, ...attrs }"
    :class="cn(treeViewNodeRenameInputCVA({ intent, size }), ui?.root)"
  />
</template>
