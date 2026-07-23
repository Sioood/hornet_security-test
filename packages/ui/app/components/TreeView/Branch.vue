<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewBranchBaseProps } from '@ark-ui/vue/tree-view'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewBranchSlots {
  root?: ClassValue
}

export interface TreeViewBranchProps extends TreeViewBranchBaseProps {
  ui?: Partial<UITreeViewBranchSlots>
}

const props = withDefaults(defineProps<TreeViewBranchProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const branchProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.Branch v-bind="{ ...branchProps, ...attrs }" :class="cn('relative', ui?.root)">
    <slot />
  </ArkTreeView.Branch>
</template>
