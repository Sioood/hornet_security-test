<script setup lang="ts">
import type { UITableIntent } from '~/utils/Components/Table/types'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    intent?: UITableIntent
    showFirstLast?: boolean
  }>(),
  {
    intent: 'neutral',
    showFirstLast: false,
  },
)

const { table } = useTableContext()

const page = computed({
  get: () => table.value.getState().pagination.pageIndex + 1,
  set: (value: number) => {
    table.value.setPageIndex(Math.max(value - 1, 0))
  },
})

const pageSize = computed({
  get: () => table.value.getState().pagination.pageSize,
  set: (value: number) => {
    table.value.setPageSize(value)
  },
})

const total = computed(() => table.value.getFilteredRowModel().rows.length)
</script>

<template>
  <UIPagination
    v-model:page="page"
    v-model:page-size="pageSize"
    :count="total"
    :show-first-last="showFirstLast"
    :intent
    size="sm"
  />
</template>
