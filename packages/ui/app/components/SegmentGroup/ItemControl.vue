<script setup lang="ts">
import { SegmentGroup as ArkSegmentGroup } from '@ark-ui/vue/segment-group'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UISegmentGroupItemControlSlots {
  root?: ClassValue
}

const props = defineProps<{
  ui?: Partial<UISegmentGroupItemControlSlots>
}>()

const attrs = useAttrs()
const arkAttrs = computed(() => splitArkAttrs(attrs))
</script>

<template>
  <ArkSegmentGroup.ItemControl
    v-bind="arkAttrs"
    :class="cn('hidden', props.ui?.root, attrs.class as string)"
  >
    <slot />
  </ArkSegmentGroup.ItemControl>
</template>
