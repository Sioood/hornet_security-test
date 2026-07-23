<script setup lang="ts">
// oxlint-disable no-console
import { useTreeView } from '@ark-ui/vue/tree-view'

import {
  emptyTreeViewCheckedState,
  type TreeViewCheckedState,
} from '~/utils/Components/TreeView/checked-state'
import { createTreeViewCollection } from '~/utils/Components/TreeView/collection'

import type {
  TreeViewCheckedChangeDetails,
  TreeViewExpandedChangeDetails,
  TreeViewSelectionChangeDetails,
} from '@ark-ui/vue/tree-view'
import type { TreeViewItem } from '~/utils/Components/TreeView/context'

const fileTreeItems: TreeViewItem[] = [
  {
    children: [
      { id: 'src/app.vue', label: 'app.vue' },
      { id: 'src/main.ts', label: 'main.ts' },
    ],
    id: 'src',
    label: 'src',
  },
  {
    children: [
      {
        children: [
          { id: 'packages/ui/index.ts', label: 'index.ts' },
          { id: 'packages/ui/components', label: 'components' },
        ],
        id: 'packages/ui',
        label: 'ui',
      },
    ],
    id: 'packages',
    label: 'packages',
  },
  { id: 'package.json', label: 'package.json' },
  { id: 'readme.md', label: 'README.md' },
]

const collection = createTreeViewCollection(fileTreeItems)

const controlledExpanded = ref<string[]>(['src'])
const controlledSelected = ref<string[]>([])
const controlledChecked = ref<TreeViewCheckedState>(emptyTreeViewCheckedState())

const externalTree = useTreeView({
  collection,
  defaultCheckedValue: [],
  defaultExpandedValue: ['packages'],
})

const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Basic (Root mode)</h2>
        <p class="text-sm text-neutral-text-subtle">
          High-level `UITreeView` with auto-rendered `items` in normal selection mode.
        </p>
      </div>

      <UITreeView
        label="Project files"
        :items="fileTreeItems"
        :default-expanded-value="['src']"
        @selection-change="(d: TreeViewSelectionChangeDetails) => console.log('selectionChange', d)"
        @expanded-change="(d: TreeViewExpandedChangeDetails) => console.log('expandedChange', d)"
      />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Checkbox mode</h2>
      <UITreeView
        label="Permissions"
        mode="checkbox"
        :items="fileTreeItems"
        :default-expanded-value="['src', 'packages']"
        @checked-change="(d: TreeViewCheckedChangeDetails) => console.log('checkedChange', d)"
      />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="intent in intents" :key="intent" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ intent }}</p>
          <UITreeView
            :intent
            :items="fileTreeItems.slice(0, 2)"
            :default-expanded-value="['src']"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div class="flex flex-col gap-6">
        <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle uppercase">{{ size }}</p>
          <UITreeView :size :items="fileTreeItems.slice(0, 2)" :default-expanded-value="['src']" />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled expanded</h2>
      <p class="text-sm text-neutral-text-subtle">
        Expanded: {{ controlledExpanded.join(', ') || 'none' }}
      </p>
      <UITreeView v-model:expanded-value="controlledExpanded" :items="fileTreeItems" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled selection</h2>
      <p class="text-sm text-neutral-text-subtle">
        Selected: {{ controlledSelected.join(', ') || 'none' }}
      </p>
      <UITreeView
        v-model:selected-value="controlledSelected"
        :items="fileTreeItems"
        selection-mode="multiple"
        :default-expanded-value="['src', 'packages']"
      />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode</h2>
      <div class="flex flex-wrap gap-2">
        <UIButton
          intent="primary"
          variant="subtle"
          text="Expand all"
          @click="externalTree.expand()"
        />
        <UIButton
          intent="primary"
          variant="subtle"
          text="Collapse all"
          @click="externalTree.collapse()"
        />
        <UIButton
          intent="primary"
          variant="subtle"
          text="Clear checked"
          @click="externalTree.clearChecked()"
        />
      </div>
      <UITreeViewRoot :value="externalTree" mode="checkbox">
        <UITreeViewLabel>External API</UITreeViewLabel>
        <UITreeViewTree>
          <UITreeViewNode
            v-for="(item, index) in fileTreeItems"
            :key="item.id"
            :node="item"
            :index-path="[index]"
            mode="checkbox"
          />
        </UITreeViewTree>
      </UITreeViewRoot>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Compound composition</h2>
      <UITreeViewRoot :collection="collection" :default-expanded-value="['packages']">
        <UITreeViewLabel>Manual composition</UITreeViewLabel>
        <UITreeViewTree>
          <UITreeViewContext v-slot="ctx">
            <p class="txt-caption mb-2 text-neutral-text-subtle">
              Expanded nodes: {{ ctx.expandedValue.join(', ') || 'none' }}
            </p>
          </UITreeViewContext>
          <UITreeViewNode
            v-for="(item, index) in fileTreeItems"
            :key="item.id"
            :node="item"
            :index-path="[index]"
          />
        </UITreeViewTree>
      </UITreeViewRoot>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Form checkbox tree</h2>
      <UIFormTreeView
        v-model="controlledChecked"
        label="Accessible routes"
        helper-text="Select the routes included in the export"
        :items="fileTreeItems"
        :default-expanded-value="['src']"
      />
      <pre class="txt-caption rounded-md bg-neutral-fill-subtle p-3">{{ controlledChecked }}</pre>
    </section>
  </div>
</template>
