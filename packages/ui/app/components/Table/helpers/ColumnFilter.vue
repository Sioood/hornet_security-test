<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    column?: Column<unknown, unknown>
    columnId?: string
    placeholder?: string
    debounce?: number
  }>(),
  {
    column: undefined,
    columnId: undefined,
    debounce: 300,
    placeholder: 'Filter…',
  },
)

const { table } = useTableContext()

const resolvedColumn = computed(() => {
  if (props.column) return props.column
  if (props.columnId) return table.value.getColumn(props.columnId) ?? undefined
  return undefined
})

const filter = ref(String(resolvedColumn.value?.getFilterValue() ?? ''))
const debouncedFilter = refDebounced(filter, props.debounce)

watch(resolvedColumn, (column) => {
  filter.value = String(column?.getFilterValue() ?? '')
})

watch(debouncedFilter, (value) => {
  resolvedColumn.value?.setFilterValue(value)
})

watch(
  () => resolvedColumn.value?.getFilterValue(),
  (value) => {
    const next = String(value ?? '')
    if (next !== filter.value) filter.value = next
  },
)
</script>

<template>
  <UIFormInput
    v-model="filter"
    type="search"
    :placeholder
    :disabled="!resolvedColumn"
    :aria-label="`Filter ${resolvedColumn?.id ?? columnId ?? 'column'}`"
  />
</template>
