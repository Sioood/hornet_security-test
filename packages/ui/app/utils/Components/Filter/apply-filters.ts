import { assertNever } from '~nuxt-essentials/app/utils/assert-never'

import { runFuseSearch } from './fuse-search'

import type {
  FilterApplyContext,
  FilterFieldConfig,
  FilterSchema,
  FilterValues,
  SearchFilterField,
} from './schema'

function defaultIsFieldActive(field: FilterFieldConfig<unknown>, value: unknown): boolean {
  switch (field.type) {
    case 'search':
      return typeof value === 'string' && value.trim() !== ''
    case 'select':
    case 'toggle-group':
      return Array.isArray(value) && value.length > 0
    case 'toggle':
      return value === true
    default:
      return assertNever(field)
  }
}

export function isFilterFieldActive<TItem>(
  field: FilterFieldConfig<TItem>,
  value: unknown,
): boolean {
  if (field.isActive) {
    return field.isActive(value as never)
  }
  return defaultIsFieldActive(field as FilterFieldConfig<unknown>, value)
}

export function hasActiveFilters<TItem>(
  schema: FilterSchema<TItem>,
  values: FilterValues,
): boolean {
  for (const [key, field] of Object.entries(schema)) {
    if (isFilterFieldActive(field, values[key])) {
      return true
    }
  }
  return false
}

function defaultSelectFilter<TItem>(
  item: TItem,
  selected: string[],
  field: FilterFieldConfig<TItem>,
): boolean {
  if (selected.length === 0) {
    return true
  }
  const itemValue = field.getValue?.(item)
  if (itemValue === undefined || itemValue === null) {
    return false
  }
  return selected.includes(String(itemValue))
}

function defaultToggleFilter<TItem>(
  item: TItem,
  active: boolean,
  field: FilterFieldConfig<TItem>,
): boolean {
  if (!active) {
    return true
  }
  const itemValue = field.getValue?.(item)
  return itemValue === true
}

function defaultToggleGroupFilter<TItem>(
  item: TItem,
  selected: string[],
  field: FilterFieldConfig<TItem>,
): boolean {
  if (selected.length === 0) {
    return true
  }
  const itemValue = field.getValue?.(item)
  if (itemValue === undefined || itemValue === null) {
    return false
  }
  return selected.includes(String(itemValue))
}

interface MatchFieldFilterInput<TItem> {
  ctx: FilterApplyContext<TItem>
  field: FilterFieldConfig<TItem>
  item: TItem
  value: unknown
}

function matchesFieldFilter<TItem>(input: MatchFieldFilterInput<TItem>): boolean {
  const { ctx, field, item, value } = input

  switch (field.type) {
    case 'search':
      return true
    case 'select': {
      const selected = Array.isArray(value) ? value : []
      if (field.filterFunction) {
        return field.filterFunction(item, selected, ctx)
      }
      return defaultSelectFilter(item, selected, field)
    }
    case 'toggle': {
      const pressed = value === true
      if (field.filterFunction) {
        return field.filterFunction(item, pressed, ctx)
      }
      return defaultToggleFilter(item, pressed, field)
    }
    case 'toggle-group': {
      const selected = Array.isArray(value) ? value : []
      if (field.filterFunction) {
        return field.filterFunction(item, selected, ctx)
      }
      return defaultToggleGroupFilter(item, selected, field)
    }
    default:
      return assertNever(field)
  }
}

export interface ApplyFiltersInput<TItem> {
  items: readonly TItem[]
  schema: FilterSchema<TItem>
  values: FilterValues
  searchKey?: string
}

export function applyFilters<TItem>(input: ApplyFiltersInput<TItem>): TItem[] {
  const { items, schema, values, searchKey } = input

  const resolvedSearchKey =
    searchKey ?? Object.entries(schema).find(([, field]) => field.type === 'search')?.[0]

  const ctx: FilterApplyContext<TItem> = {
    schema,
    searchKey: resolvedSearchKey,
    values,
  }

  let result = [...items]

  if (resolvedSearchKey) {
    const searchField = schema[resolvedSearchKey] as SearchFilterField<TItem> | undefined
    const query = String(values[resolvedSearchKey] ?? '')
    if (searchField?.type === 'search') {
      result = runFuseSearch(result, { field: searchField, query })
    }
  }

  for (const [key, field] of Object.entries(schema)) {
    if (field.type === 'search') {
      continue
    }
    const value = values[key]
    result = result.filter((item) => matchesFieldFilter({ ctx, field, item, value }))
  }

  return result
}
