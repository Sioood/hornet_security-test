/** @lintignore Public tree view check state for branch nodes */
export type TreeViewBranchCheckState = boolean | 'indeterminate'

export interface TreeViewCheckedValueMap {
  branches: Record<string, TreeViewBranchCheckState>
  leaves: Record<string, boolean>
}

export interface TreeViewCheckedState {
  /** Flat list of checked node IDs. */
  value: string[]
  /** Branch nodes with checked / indeterminate state. */
  branches: Record<string, TreeViewBranchCheckState>
  /** Leaf nodes with checked state. */
  leaves: Record<string, boolean>
}

export function buildTreeViewCheckedState(
  value: string[],
  map?: Partial<TreeViewCheckedValueMap>,
): TreeViewCheckedState {
  return {
    branches: map?.branches ?? {},
    leaves: map?.leaves ?? {},
    value,
  }
}

export function emptyTreeViewCheckedState(): TreeViewCheckedState {
  return buildTreeViewCheckedState([])
}
