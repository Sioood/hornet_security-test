<script setup lang="ts" generic="TData">
import { tableCellCVA, tableRowCVA } from '~/utils/Components/Table/variants'

import type { Row } from '@tanstack/vue-table'

defineOptions({ inheritAttrs: false })

defineProps<{
  row: Row<TData>
  colspan: number
}>()

const { size, intent, ui } = useTableContext<TData>()
</script>

<template>
  <tr :class="tableRowCVA({ intent, expanded: true })">
    <td :colspan :class="cn(tableCellCVA({ intent, size }), ui?.td, 'p-0')">
      <slot />
    </td>
  </tr>
</template>
