import type { NuxtLinkProps } from '#app'
import type { ClassValue } from 'vue'

interface MenuBaseItem {
  disabled?: boolean
  customClass?: ClassValue
}

export interface MenuItemEntry extends MenuBaseItem {
  /** Explicit `'item'` or omitted (defaults to `'item'` at runtime). */
  type?: 'item'
  label: string
  value: string
  closeOnSelect?: boolean
  valueText?: string
  onSelect?: () => void
  to?: NuxtLinkProps['to']
  target?: string
  external?: boolean
}

export interface MenuCheckboxEntry extends MenuBaseItem {
  type: 'checkbox'
  label: string
  value: string
  checked: boolean
  closeOnSelect?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export interface MenuRadioGroupEntry {
  type: 'radio-group'
  label?: string
  value?: string
  customClass?: ClassValue
  onValueChange?: (value: string) => void
  items: Array<{
    label: string
    value: string
    disabled?: boolean
  }>
}

export interface MenuSeparatorEntry {
  type: 'separator'
  customClass?: ClassValue
}

export interface MenuSubmenuEntry {
  type: 'submenu'
  label: string
  customClass?: ClassValue
  items: MenuListEntry[]
}

export interface MenuGroupEntry {
  type: 'group'
  label?: string
  customClass?: ClassValue
  items: MenuListEntry[]
}

export type MenuListEntry =
  | MenuItemEntry
  | MenuCheckboxEntry
  | MenuRadioGroupEntry
  | MenuGroupEntry
  | MenuSubmenuEntry
  | MenuSeparatorEntry

/**
 * Narrowed variant requiring a literal `type` discriminant.
 * Use in switch/if-chains that need exhaustive checking via `assertNever`.
 */
export type MenuListEntryStrict =
  | (MenuItemEntry & { type: 'item' })
  | MenuCheckboxEntry
  | MenuRadioGroupEntry
  | MenuGroupEntry
  | MenuSubmenuEntry
  | MenuSeparatorEntry
