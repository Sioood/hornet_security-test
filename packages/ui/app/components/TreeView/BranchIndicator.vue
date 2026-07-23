<script setup lang="ts">
import {
  TreeView as ArkTreeView,
  type TreeViewBranchIndicatorBaseProps,
} from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewBranchIndicatorCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewBranchIndicatorSlots {
  root?: ClassValue
}

export interface TreeViewBranchIndicatorProps extends TreeViewBranchIndicatorBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewBranchIndicatorSlots>
}

const props = withDefaults(defineProps<TreeViewBranchIndicatorProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const indicatorProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.BranchIndicator
    v-bind="{ ...indicatorProps, ...attrs }"
    :class="cn(treeViewBranchIndicatorCVA({ intent, size }), ui?.root)"
  >
    <slot>
      <Icon name="tabler:chevron-right" class="size-full" />
    </slot>
  </ArkTreeView.BranchIndicator>
</template>
