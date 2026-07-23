<script setup lang="ts">
import { tableLoadingCVA } from '~/utils/Components/Table/variants'

defineOptions({ inheritAttrs: false })

const { loading, size, intent, ui } = useTableContext()
</script>

<template>
  <div
    v-if="loading"
    :class="cn(tableLoadingCVA({ intent, size }), ui?.loading)"
    role="status"
    aria-live="polite"
  >
    <slot>
      <div class="flex justify-center py-4">
        <UIProgress :model-value="50" :intent="intent" size="sm" />
      </div>
    </slot>
  </div>
</template>
