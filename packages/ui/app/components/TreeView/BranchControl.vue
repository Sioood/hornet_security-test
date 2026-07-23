<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewBranchControlBaseProps } from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewBranchControlCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewBranchControlSlots {
  root?: ClassValue
}

export interface TreeViewBranchControlProps extends TreeViewBranchControlBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewBranchControlSlots>
}

const props = withDefaults(defineProps<TreeViewBranchControlProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const controlProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.BranchControl
    v-bind="{ ...controlProps, ...attrs }"
    :class="cn(treeViewBranchControlCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkTreeView.BranchControl>
</template>
