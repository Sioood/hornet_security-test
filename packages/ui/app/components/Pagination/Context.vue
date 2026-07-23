<script setup lang="ts">
import { Pagination as ArkPagination } from '@ark-ui/vue/pagination'

/**
 * Exposes Ark `Pagination.Context` slot props for inline state access.
 *
 * Available slot props include:
 * - `page` — current page number
 * - `totalPages` — total number of pages
 * - `pages` — array of page objects with `{ type: 'page' | 'ellipsis', value?: number, index?: number }`
 * - `pageSize` — current page size
 * - `count` — total item count
 * - `previousPage` — previous page number (null if on first page)
 * - `nextPage` — next page number (null if on last page)
 * - `pageRange` — object `{ start: number, end: number }` with the range of visible items
 * - `slice` — function to slice a data array for the current page
 * - `setPageSize` — function to change the page size
 * - `setPage` — function to set the current page
 * - `goToNextPage` / `goToPrevPage` / `goToFirstPage` / `goToLastPage` — navigation functions
 */
defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkPagination.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkPagination.Context>
</template>
