<script setup lang="ts">
import {
  TreeView as ArkTreeView,
  type TreeViewNodeCheckboxIndicatorBaseProps,
} from '@ark-ui/vue/tree-view'

import { treeNodeCheckboxIndicatorCVA } from '~/utils/Components/Form/checkbox-variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewNodeCheckboxIndicatorSlots {
  root?: ClassValue
}

export interface TreeViewNodeCheckboxIndicatorProps extends TreeViewNodeCheckboxIndicatorBaseProps {
  ui?: Partial<UITreeViewNodeCheckboxIndicatorSlots>
}

const props = withDefaults(defineProps<TreeViewNodeCheckboxIndicatorProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const indicatorProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.NodeCheckboxIndicator
    v-bind="{ ...indicatorProps, ...attrs }"
    :class="cn(treeNodeCheckboxIndicatorCVA(), ui?.root)"
  >
    <slot>
      <Icon name="tabler:check" class="size-3 shrink-0" />
    </slot>
    <template #indeterminate>
      <slot name="indeterminate">
        <Icon name="tabler:minus" class="size-3 shrink-0" />
      </slot>
    </template>
    <template #fallback>
      <slot name="fallback" />
    </template>
  </ArkTreeView.NodeCheckboxIndicator>
</template>
