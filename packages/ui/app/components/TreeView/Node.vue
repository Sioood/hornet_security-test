<script setup lang="ts">
import {
  treeViewChromeKey,
  type TreeViewItem,
  type TreeViewMode,
} from '~/utils/Components/TreeView/context'

defineOptions({ inheritAttrs: false })

export interface TreeViewNodeProps {
  node: TreeViewItem
  indexPath: number[]
  mode?: TreeViewMode
}

const props = withDefaults(defineProps<TreeViewNodeProps>(), {
  mode: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const resolvedMode = computed<TreeViewMode>(() => props.mode ?? chrome?.mode.value ?? 'normal')
const isCheckboxMode = computed(() => resolvedMode.value === 'checkbox')
const hasChildren = computed(() => (props.node.children?.length ?? 0) > 0)
</script>

<template>
  <UITreeViewNodeProvider :node="node" :index-path="indexPath">
    <UITreeViewNodeContext v-slot="nodeState">
      <UITreeViewBranch v-if="hasChildren">
        <UITreeViewBranchControl>
          <UITreeViewNodeCheckbox v-if="isCheckboxMode">
            <UITreeViewNodeCheckboxIndicator />
          </UITreeViewNodeCheckbox>

          <UITreeViewBranchTrigger v-if="!isCheckboxMode">
            <UITreeViewBranchIndicator />
          </UITreeViewBranchTrigger>

          <UITreeViewBranchText>
            <Icon
              v-if="!isCheckboxMode"
              :name="nodeState.expanded ? 'tabler:folder-open' : 'tabler:folder'"
              class="size-4 shrink-0"
            />
            {{ node.label }}
          </UITreeViewBranchText>

          <UITreeViewBranchTrigger v-if="isCheckboxMode" class="ms-auto">
            <UITreeViewBranchIndicator />
          </UITreeViewBranchTrigger>

          <UITreeViewNodeRenameInput v-if="nodeState.renaming" />
        </UITreeViewBranchControl>

        <UITreeViewBranchContent>
          <UITreeViewBranchIndentGuide />
          <UITreeViewNode
            v-for="(child, childIndex) in node.children"
            :key="child.id"
            :node="child"
            :index-path="[...indexPath, childIndex]"
            :mode="resolvedMode"
          />
        </UITreeViewBranchContent>
      </UITreeViewBranch>

      <UITreeViewItem v-else-if="node.href" as-child>
        <NuxtLink :to="node.href" v-bind="attrs">
          <UITreeViewNodeCheckbox v-if="isCheckboxMode">
            <UITreeViewNodeCheckboxIndicator />
          </UITreeViewNodeCheckbox>

          <UITreeViewItemText>
            <Icon name="tabler:file" class="size-4 shrink-0" />
            {{ node.label }}
          </UITreeViewItemText>
        </NuxtLink>
      </UITreeViewItem>

      <UITreeViewItem v-else>
        <UITreeViewNodeCheckbox v-if="isCheckboxMode">
          <UITreeViewNodeCheckboxIndicator />
        </UITreeViewNodeCheckbox>

        <UITreeViewItemText>
          <Icon name="tabler:file" class="size-4 shrink-0" />
          {{ node.label }}
        </UITreeViewItemText>

        <UITreeViewNodeRenameInput v-if="nodeState.renaming" />
      </UITreeViewItem>
    </UITreeViewNodeContext>
  </UITreeViewNodeProvider>
</template>
