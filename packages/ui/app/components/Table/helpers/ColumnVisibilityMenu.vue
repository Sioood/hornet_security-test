<script setup lang="ts">
import type { MenuListEntryStrict } from '@/components/Menu/index.vue'
import type { Column } from '@tanstack/vue-table'

defineOptions({ inheritAttrs: false })

const { table } = useTableContext()

const items = computed<MenuListEntryStrict[]>(() =>
  table.value
    .getAllLeafColumns()
    .reduce<MenuListEntryStrict[]>((acc, column: Column<unknown, unknown>) => {
      if (!column.getCanHide()) return acc
      acc.push({
        checked: column.getIsVisible(),
        closeOnSelect: false,
        label: column.id,
        onCheckedChange: (checked: boolean) => {
          column.toggleVisibility(checked)
        },
        type: 'checkbox' as const,
        value: column.id,
      })
      return acc
    }, []),
)
</script>

<template>
  <UIMenu :items intent="neutral">
    <UIButton intent="neutral" variant="ghost" trailing-icon="tabler:chevron-down">
      Columns
    </UIButton>
  </UIMenu>
</template>
