import { watchDebounced } from '@vueuse/core'
import { computed, ref, watch, type Ref } from 'vue'

import {
  applyFilters,
  hasActiveFilters as computeHasActiveFilters,
} from '../utils/Components/Filter/apply-filters'
import {
  buildDefaultFilterValues,
  mergeFilterValues,
  resolveSearchFieldKey,
} from '../utils/Components/Filter/schema'

import type { FilterSchema, FilterValues } from '../utils/Components/Filter/schema'

export interface UseFilterBarOptions<TItem> {
  schema: FilterSchema<TItem>
  values?: Ref<FilterValues>
  defaultValues?: Partial<FilterValues>
  debounce?: number
  searchKey?: string
  onChange?: (values: FilterValues) => void
}

export function useFilterBar<TItem>(options: UseFilterBarOptions<TItem>) {
  const defaults = buildDefaultFilterValues(options.schema)
  const values =
    options.values ?? ref<FilterValues>(mergeFilterValues(defaults, options.defaultValues))

  const resolvedSearchKey = computed(
    () => options.searchKey ?? resolveSearchFieldKey(options.schema),
  )

  const debounceMs = computed(() => options.debounce ?? 300)
  const isSearchPending = ref(false)

  if (options.onChange) {
    watch(
      values,
      () => {
        isSearchPending.value = true
      },
      { deep: true },
    )

    watchDebounced(
      values,
      () => {
        options.onChange?.({ ...values.value })
        isSearchPending.value = false
      },
      { debounce: debounceMs, deep: true },
    )
  }

  const hasActiveFilters = computed(() => computeHasActiveFilters(options.schema, values.value))

  function filter(items: readonly TItem[]): TItem[] {
    return applyFilters({
      items,
      schema: options.schema,
      searchKey: resolvedSearchKey.value,
      values: values.value,
    })
  }

  function reset() {
    values.value = buildDefaultFilterValues(options.schema)
    isSearchPending.value = false
    options.onChange?.({ ...values.value })
  }

  function flushSearch() {
    options.onChange?.({ ...values.value })
    isSearchPending.value = false
  }

  function cancelSearch() {
    isSearchPending.value = false
  }

  function getFieldValue(key: string): FilterValues[string] | undefined {
    return values.value[key]
  }

  function setFieldValue(key: string, value: FilterValues[string]) {
    values.value = { ...values.value, [key]: value }
  }

  return {
    cancelSearch,
    filter,
    flushSearch,
    getFieldValue,
    hasActiveFilters,
    isSearchPending,
    reset,
    setFieldValue,
    values,
  }
}

export type UseFilterBarReturn<TItem> = ReturnType<typeof useFilterBar<TItem>>
