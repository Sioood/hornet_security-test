import type { SelectItem } from '../Form/Select/context'
import type Fuse from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'

interface FilterToggleGroupOption {
  disabled?: boolean
  icon?: string
  title?: string
  value: string
}

export type FilterBarLayout<TKey extends string = string> = TKey | readonly TKey[] | TKey[]

export function filterLayoutRowKeys(row: FilterBarLayout<string>): string[] {
  if (typeof row === 'string') {
    return [row]
  }
  return [...row]
}

interface FuseSearchConfig<TItem> {
  fuseOptions?: IFuseOptions<TItem>
  resultLimit?: number
  matchAllWhenSearchEmpty?: boolean
}

export interface FilterApplyContext<TItem> {
  schema: FilterSchema<TItem>
  values: FilterValues
  searchKey: string | undefined
}

interface FilterFieldBase<TItem, TValue> {
  label?: string
  defaultValue: TValue
  /** Extract a comparable value from an item (select / toggle / toggle-group). */
  getValue?: (item: TItem) => unknown
  /** Custom predicate — defaults are applied per field type when omitted. */
  filterFunction?: (item: TItem, value: TValue, ctx: FilterApplyContext<TItem>) => boolean
  /** Whether the field counts as an active filter (menu icon, badges). */
  isActive?: (value: TValue) => boolean
}

export interface SearchFilterField<TItem> extends FilterFieldBase<TItem, string> {
  type: 'search'
  placeholder?: string
  debounce?: number
  fuse?: FuseSearchConfig<TItem>
  /** Full override — receives items, query, and a Fuse instance. */
  search?: (items: readonly TItem[], query: string, fuse: Fuse<TItem>) => readonly TItem[]
}

interface SelectFilterField<TItem> extends FilterFieldBase<TItem, string[]> {
  type: 'select'
  props?: {
    items?: SelectItem[]
    multiple?: boolean
    placeholder?: string
    portalled?: boolean
    size?: 'sm' | 'md' | 'lg'
    [key: string]: unknown
  }
}

type ToggleFilterVariant = 'switch' | 'toggle'

interface ToggleFilterField<TItem> extends FilterFieldBase<TItem, boolean> {
  type: 'toggle'
  variant?: ToggleFilterVariant
  props?: Record<string, unknown>
}

interface ToggleGroupFilterField<TItem> extends FilterFieldBase<TItem, string[]> {
  type: 'toggle-group'
  props?: {
    options?: FilterToggleGroupOption[]
    iconOnly?: boolean
    size?: 'sm' | 'md' | 'lg'
    [key: string]: unknown
  }
}

export type FilterFieldConfig<TItem> =
  | SearchFilterField<TItem>
  | SelectFilterField<TItem>
  | ToggleFilterField<TItem>
  | ToggleGroupFilterField<TItem>

export type FilterSchema<TItem> = Record<string, FilterFieldConfig<TItem>>

export type FilterFieldValue = string | boolean | string[]

export type FilterValues = Record<string, FilterFieldValue>

export function buildDefaultFilterValues<TItem>(schema: FilterSchema<TItem>): FilterValues {
  const values: FilterValues = {}
  for (const [key, field] of Object.entries(schema)) {
    values[key] = field.defaultValue
  }
  return values
}

export function resolveSearchFieldKey<TItem>(schema: FilterSchema<TItem>): string | undefined {
  return Object.entries(schema).find(([, field]) => field.type === 'search')?.[0]
}

export function mergeFilterValues(
  defaults: FilterValues,
  overrides?: Partial<FilterValues>,
): FilterValues {
  if (!overrides) {
    return { ...defaults }
  }
  return { ...defaults, ...overrides }
}
