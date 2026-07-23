<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewBranchContentBaseProps } from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewBranchContentCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewBranchContentSlots {
  root?: ClassValue
}

export interface TreeViewBranchContentProps extends TreeViewBranchContentBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewBranchContentSlots>
}

const props = withDefaults(defineProps<TreeViewBranchContentProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const contentProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.BranchContent
    v-bind="{ ...contentProps, ...attrs }"
    :class="cn(treeViewBranchContentCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkTreeView.BranchContent>
</template>
