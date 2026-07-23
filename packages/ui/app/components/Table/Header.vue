<script setup lang="ts" generic="TData">
import { tableHeaderSlotName } from '~/utils/Components/Table/types'
import { resolveStickyVariant, tableTheadCVA } from '~/utils/Components/Table/variants'

defineOptions({ inheritAttrs: false })

const { table, sticky, loading, intent, ui } = useTableContext<TData>()
const slots = useSlots()

const stickyVariant = computed(() => resolveStickyVariant(sticky.value))
</script>

<template>
  <thead :class="cn(tableTheadCVA({ intent, sticky: stickyVariant, loading }), ui?.thead)">
    <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
      <UITableHead v-for="header in headerGroup.headers" :key="header.id" :header="header">
        <template v-if="slots[tableHeaderSlotName(header.column.id)]" #default>
          <slot
            :name="tableHeaderSlotName(header.column.id)"
            :header="header"
            :column="header.column"
            :table
          />
        </template>
      </UITableHead>
    </tr>
  </thead>
</template>
