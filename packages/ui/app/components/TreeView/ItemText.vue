<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewItemTextBaseProps } from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewNodeTextCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewItemTextSlots {
  root?: ClassValue
}

export interface TreeViewItemTextProps extends TreeViewItemTextBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewItemTextSlots>
}

const props = withDefaults(defineProps<TreeViewItemTextProps>(), {
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
  <ArkTreeView.ItemText
    v-bind="{ ...textProps, ...attrs }"
    :class="cn(treeViewNodeTextCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkTreeView.ItemText>
</template>
