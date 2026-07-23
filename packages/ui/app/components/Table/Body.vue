<script setup lang="ts">
import { tableTbodyCVA } from '~/utils/Components/Table/variants'

defineOptions({ inheritAttrs: false })

const { intent, ui } = useTableContext()
</script>

<template>
  <tbody :class="cn(tableTbodyCVA({ intent }), ui?.tbody)">
    <slot name="body-top" />
    <slot />
    <slot name="body-bottom" />
  </tbody>
</template>
