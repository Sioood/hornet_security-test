<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'

defineOptions({ inheritAttrs: true })

defineSlots<{
  default: (props: {
    table: Table<TData>
    tableApi: Table<TData>
    rows: ReturnType<Table<TData>['getRowModel']>['rows']
    headerGroups: ReturnType<Table<TData>['getHeaderGroups']>
    footerGroups: ReturnType<Table<TData>['getFooterGroups']>
  }) => unknown
}>()

const { table } = useTableContext<TData>()
</script>

<template>
  <slot
    :table
    :table-api="table"
    :rows="table.getRowModel().rows"
    :header-groups="table.getHeaderGroups()"
    :footer-groups="table.getFooterGroups()"
  />
</template>
