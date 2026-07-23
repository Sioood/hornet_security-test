<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewBranchTriggerBaseProps } from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewBranchTriggerCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewBranchTriggerSlots {
  root?: ClassValue
}

export interface TreeViewBranchTriggerProps extends TreeViewBranchTriggerBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewBranchTriggerSlots>
}

const props = withDefaults(defineProps<TreeViewBranchTriggerProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const triggerProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.BranchTrigger
    v-bind="{ ...triggerProps, ...attrs }"
    :class="cn(treeViewBranchTriggerCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkTreeView.BranchTrigger>
</template>
