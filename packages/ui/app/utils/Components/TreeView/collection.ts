import { createTreeCollection, type TreeCollection } from '@ark-ui/vue/tree-view'

import type { TreeViewItem } from './context'

const ROOT_NODE_ID = 'ROOT'

export function createTreeViewCollection(items: TreeViewItem[]): TreeCollection<TreeViewItem> {
  return createTreeCollection<TreeViewItem>({
    nodeToString: (node) => node.label,
    nodeToValue: (node) => node.id,
    rootNode: {
      children: items,
      id: ROOT_NODE_ID,
      label: '',
    },
  })
}

export function getTreeViewRootChildren(collection: TreeCollection<TreeViewItem>): TreeViewItem[] {
  return collection.rootNode.children ?? []
}
