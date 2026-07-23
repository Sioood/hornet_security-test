import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/vue-table'

import type { TableOptions } from '@tanstack/vue-table'

interface RowModelFeatureFlags {
  enableFiltering?: boolean
  enableSorting?: boolean
  enablePagination?: boolean
  enableGrouping?: boolean
  enableExpanding?: boolean
  enableFaceting?: boolean
}

function resolveRowModelFeatures<TData>(
  options: Partial<TableOptions<TData>>,
): RowModelFeatureFlags {
  const enableFiltering =
    !options.manualFiltering &&
    (options.state?.columnFilters !== undefined ||
      options.state?.globalFilter !== undefined ||
      options.onColumnFiltersChange !== undefined ||
      options.onGlobalFilterChange !== undefined)

  return {
    enableExpanding:
      options.enableExpanding === true ||
      options.getSubRows !== undefined ||
      options.state?.expanded !== undefined ||
      options.onExpandedChange !== undefined,
    enableFaceting:
      options.getFacetedRowModel !== undefined ||
      options.getFacetedUniqueValues !== undefined ||
      options.getFacetedMinMaxValues !== undefined ||
      enableFiltering,
    enableFiltering,
    enableGrouping: options.state?.grouping !== undefined || options.onGroupingChange !== undefined,
    enablePagination:
      !options.manualPagination &&
      (options.state?.pagination !== undefined || options.onPaginationChange !== undefined),
    enableSorting:
      !options.manualSorting &&
      (options.state?.sorting !== undefined || options.onSortingChange !== undefined),
  }
}

export function applyDefaultRowModels<TData>(
  options: Partial<TableOptions<TData>>,
): Partial<TableOptions<TData>> {
  const features = resolveRowModelFeatures(options)
  const next: Partial<TableOptions<TData>> = { ...options }

  next.getCoreRowModel = next.getCoreRowModel ?? getCoreRowModel()

  if (features.enableFiltering && !next.getFilteredRowModel) {
    next.getFilteredRowModel = getFilteredRowModel()
  }

  if (features.enableSorting && !next.getSortedRowModel) {
    next.getSortedRowModel = getSortedRowModel()
  }

  if (features.enablePagination && !next.getPaginationRowModel) {
    next.getPaginationRowModel = getPaginationRowModel()
  }

  if (features.enableGrouping && !next.getGroupedRowModel) {
    next.getGroupedRowModel = getGroupedRowModel()
  }

  if (features.enableExpanding && !next.getExpandedRowModel) {
    next.getExpandedRowModel = getExpandedRowModel()
  }

  if (features.enableFaceting) {
    next.getFacetedRowModel = next.getFacetedRowModel ?? getFacetedRowModel()
    next.getFacetedUniqueValues = next.getFacetedUniqueValues ?? getFacetedUniqueValues()
    next.getFacetedMinMaxValues = next.getFacetedMinMaxValues ?? getFacetedMinMaxValues()
  }

  return next
}
