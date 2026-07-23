import { createListCollection, type ListCollection } from '@ark-ui/vue/combobox'

import type { ComboboxItem } from './context'

const comboboxCollectionOptions = {
  itemToString: (item: ComboboxItem) => item.label,
  itemToValue: (item: ComboboxItem) => item.value,
} as const

export function filterComboboxItems(
  items: ComboboxItem[],
  query: string,
  contains: (string: string, substring: string) => boolean,
): ComboboxItem[] {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return items

  return items.filter(
    (item) => contains(item.label, normalizedQuery) || contains(item.value, normalizedQuery),
  )
}

export function createComboboxCollection(
  items: ComboboxItem[],
  options?: { groupBy?: (item: ComboboxItem) => string },
): ListCollection<ComboboxItem> {
  return createListCollection({
    items,
    ...comboboxCollectionOptions,
    ...options,
  })
}

export function resolveComboboxSelectedValue(details: {
  value: string[]
  items: ComboboxItem[]
}): string | undefined {
  const fromItem = details.items[0]?.value
  if (fromItem) return fromItem

  const [fromValue] = details.value
  if (!fromValue) return undefined

  return fromValue
}
