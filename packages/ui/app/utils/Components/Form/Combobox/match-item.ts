import type { ComboboxItem } from './context'

function findComboboxItemMatch(input: string, items: ComboboxItem[]): ComboboxItem | undefined {
  const normalized = input.trim().toLowerCase()
  if (!normalized) return undefined

  return items.find(
    (item) => item.label.toLowerCase() === normalized || item.value.toLowerCase() === normalized,
  )
}

export function resolveComboboxEnterMatch(
  input: string,
  availableItems: ComboboxItem[],
  allItems?: ComboboxItem[],
): ComboboxItem | undefined {
  const normalized = input.trim()
  if (!normalized) return undefined

  const exactMatch = findComboboxItemMatch(normalized, allItems ?? availableItems)
  if (exactMatch) return exactMatch

  const selectable = availableItems.filter((item) => !item.disabled)
  if (selectable.length === 1) return selectable[0]

  return undefined
}
