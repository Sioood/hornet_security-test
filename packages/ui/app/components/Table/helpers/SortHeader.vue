<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  column: Column<unknown, unknown>
  label?: string
}>()

const sorted = computed(() => props.column.getIsSorted())
const sortIcon = computed(() => {
  if (sorted.value === 'asc') return 'tabler:arrow-up'
  if (sorted.value === 'desc') return 'tabler:arrow-down'
  return 'tabler:arrows-sort'
})
</script>

<template>
  <UIButton
    intent="neutral"
    size="sm"
    variant="ghost"
    class="gap-1"
    type="button"
    :disabled="!column.getCanSort()"
    @click.stop="column.getToggleSortingHandler()?.($event)"
  >
    <span>{{ label ?? column.id }}</span>
    <Icon :name="sortIcon" class="size-4 opacity-60" />
  </UIButton>
</template>
