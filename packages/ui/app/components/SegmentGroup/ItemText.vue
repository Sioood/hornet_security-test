<script setup lang="ts">
import { SegmentGroup as ArkSegmentGroup } from '@ark-ui/vue/segment-group'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const arkAttrs = computed(() => splitArkAttrs(attrs))
</script>

<template>
  <ArkSegmentGroup.ItemText v-bind="arkAttrs">
    <slot />
  </ArkSegmentGroup.ItemText>
</template>
