<script setup lang="ts">
import { tableCaptionCVA } from '~/utils/Components/Table/variants'

defineOptions({ inheritAttrs: false })

const { size, intent, ui } = useTableContext()
</script>

<template>
  <caption :class="cn(tableCaptionCVA({ intent, size }), ui?.caption)">
    <slot />
  </caption>
</template>
