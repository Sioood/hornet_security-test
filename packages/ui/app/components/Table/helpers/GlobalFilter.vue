<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    placeholder?: string
    debounce?: number
  }>(),
  {
    debounce: 300,
    placeholder: 'Search…',
  },
)

const { table } = useTableContext()

const filter = ref(String(table.value.getState().globalFilter ?? ''))
const debouncedFilter = refDebounced(filter, props.debounce)

watch(debouncedFilter, (value) => {
  table.value.setGlobalFilter(value)
})

watch(
  () => table.value.getState().globalFilter,
  (value) => {
    const next = String(value ?? '')
    if (next !== filter.value) filter.value = next
  },
  { flush: 'sync' },
)
</script>

<template>
  <UIFormInput v-model="filter" type="search" :placeholder aria-label="Global table filter" />
</template>
