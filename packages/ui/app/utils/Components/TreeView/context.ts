import type { InjectionKey, Ref } from 'vue'
import type { ComponentIntent, ComponentSize } from '~/utils/Components/contextBase'

export type TreeViewIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type TreeViewSize = NonNullable<Extract<ComponentSize, 'sm' | 'md' | 'lg'>>
export type TreeViewMode = 'normal' | 'checkbox'

export interface TreeViewItem {
  id: string
  label: string
  disabled?: boolean
  children?: TreeViewItem[]
  childrenCount?: number
  href?: string
}

export interface TreeViewChromeContext {
  intent: Ref<TreeViewIntent>
  size: Ref<TreeViewSize>
  mode: Ref<TreeViewMode>
  invalid: Ref<boolean>
}

export const treeViewChromeKey: InjectionKey<TreeViewChromeContext> = Symbol.for(
  'hornet_security-test.ui.tree-view.chrome',
)
