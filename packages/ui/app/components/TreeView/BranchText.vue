<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewBranchTextBaseProps } from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewNodeTextCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewBranchTextSlots {
  root?: ClassValue
}

export interface TreeViewBranchTextProps extends TreeViewBranchTextBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewBranchTextSlots>
}

const props = withDefaults(defineProps<TreeViewBranchTextProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const textProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.BranchText
    v-bind="{ ...textProps, ...attrs }"
    :class="cn(treeViewNodeTextCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkTreeView.BranchText>
</template>
