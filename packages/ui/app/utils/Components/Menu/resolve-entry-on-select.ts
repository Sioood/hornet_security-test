import type { MenuListEntry } from '~/utils/Components/Menu/entries'

function isItemEntry(entry: MenuListEntry): entry is Extract<MenuListEntry, { type?: 'item' }> {
  return !entry.type || entry.type === 'item'
}

export function resolveEntryOnSelect(items: MenuListEntry[], value: string): boolean {
  for (const entry of items) {
    if (isItemEntry(entry) && entry.value === value) {
      entry.onSelect?.()
      return true
    }

    if (entry.type === 'group' || entry.type === 'submenu') {
      if (resolveEntryOnSelect(entry.items, value)) {
        return true
      }
    }
  }

  return false
}
