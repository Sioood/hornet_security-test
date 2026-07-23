<script setup lang="ts" generic="TData">
import { FlexRender } from '@tanstack/vue-table'

import { tableFooterSlotName } from '~/utils/Components/Table/types'
import { resolveStickyVariant, tableTfootCVA } from '~/utils/Components/Table/variants'

defineOptions({ inheritAttrs: false })

const { table, sticky, intent, ui } = useTableContext<TData>()
const slots = useSlots()

const stickyVariant = computed(() => resolveStickyVariant(sticky.value))
const hasFooters = computed(() =>
  table.value
    .getFooterGroups()
    .some((group) => group.headers.some((header) => header.column.columnDef.footer)),
)
</script>

<template>
  <tfoot
    v-if="hasFooters || $slots.footer"
    :class="cn(tableTfootCVA({ intent, sticky: stickyVariant }), ui?.tfoot)"
  >
    <tr v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
      <th
        v-for="header in footerGroup.headers"
        :key="header.id"
        :colspan="header.colSpan"
        :class="cn(ui?.th)"
      >
        <slot
          v-if="slots[tableFooterSlotName(header.column.id)]"
          :name="tableFooterSlotName(header.column.id)"
          :column="header.column"
          :footer="header"
          :table
        />
        <FlexRender v-else :render="header.column.columnDef.footer" :props="header.getContext()" />
      </th>
    </tr>
    <slot name="footer" />
  </tfoot>
</template>
