<script setup lang="ts">
import { tableEmptyCVA } from '~/utils/Components/Table/variants'

defineOptions({ inheritAttrs: false })

const { table, emptyText, size, intent, ui, loading } = useTableContext()
const isEmpty = computed(() => !loading.value && !table.value.getRowModel().rows.length)
</script>

<template>
  <div v-if="isEmpty" :class="cn(tableEmptyCVA({ intent, size }), ui?.empty)" role="status">
    <slot>{{ emptyText ?? 'No data' }}</slot>
  </div>
</template>
