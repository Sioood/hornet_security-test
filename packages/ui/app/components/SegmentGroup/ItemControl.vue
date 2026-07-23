<script setup lang="ts">
import { SegmentGroup as ArkSegmentGroup } from '@ark-ui/vue/segment-group'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const arkAttrs = computed(() => splitArkAttrs(attrs))
</script>

<template>
  <ArkSegmentGroup.ItemControl
    v-bind="arkAttrs"
    :class="cn('flex items-center justify-center', $attrs.class as string)"
  >
    <slot />
  </ArkSegmentGroup.ItemControl>
</template>
