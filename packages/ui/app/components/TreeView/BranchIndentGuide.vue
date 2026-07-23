<script setup lang="ts">
import {
  TreeView as ArkTreeView,
  type TreeViewBranchIndentGuideBaseProps,
} from '@ark-ui/vue/tree-view'

import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'
import { treeViewBranchIndentGuideCVA } from '~/utils/Components/TreeView/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewBranchIndentGuideSlots {
  root?: ClassValue
}

export interface TreeViewBranchIndentGuideProps extends TreeViewBranchIndentGuideBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewBranchIndentGuideSlots>
}

const props = withDefaults(defineProps<TreeViewBranchIndentGuideProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')

const guideProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.BranchIndentGuide
    v-bind="{ ...guideProps, ...attrs }"
    :class="cn(treeViewBranchIndentGuideCVA({ intent, size }), ui?.root)"
  />
</template>
