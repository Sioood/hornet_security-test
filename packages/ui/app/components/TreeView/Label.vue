<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewLabelBaseProps } from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewLabelCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewLabelSlots {
  root?: ClassValue
}

export interface TreeViewLabelProps extends TreeViewLabelBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewLabelSlots>
}

const props = withDefaults(defineProps<TreeViewLabelProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const labelProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.Label
    v-bind="{ ...labelProps, ...attrs }"
    :class="cn(treeViewLabelCVA({ intent, size }), ui?.root)"
  >
    <slot />
  </ArkTreeView.Label>
</template>
