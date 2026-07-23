<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewItemBaseProps } from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewItemCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewItemSlots {
  root?: ClassValue
}

export interface TreeViewItemProps extends TreeViewItemBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewItemSlots>
}

const props = withDefaults(defineProps<TreeViewItemProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const itemProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.Item
    v-bind="{ ...itemProps, ...attrs }"
    :class="cn(treeViewItemCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkTreeView.Item>
</template>
