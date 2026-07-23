<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewTreeBaseProps } from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewTreeCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewTreeSlots {
  root?: ClassValue
}

export interface TreeViewTreeProps extends TreeViewTreeBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewTreeSlots>
}

const props = withDefaults(defineProps<TreeViewTreeProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const treeProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.Tree
    v-bind="{ ...treeProps, ...attrs }"
    :class="cn(treeViewTreeCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkTreeView.Tree>
</template>
