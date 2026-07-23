<script setup lang="ts">
import { SegmentGroup as ArkSegmentGroup } from '@ark-ui/vue/segment-group'

import { segmentedIndicatorCVA } from '~/utils/Components/Segmented/variants'
import {
  segmentGroupChromeKey,
  type SegmentGroupIntent,
} from '~/utils/Components/SegmentGroup/context'

defineOptions({ inheritAttrs: false })

interface IndicatorProps {
  intent?: SegmentGroupIntent
}

const props = defineProps<IndicatorProps>()
const attrs = useAttrs()

const chrome = inject(segmentGroupChromeKey, null)
const intent = computed<SegmentGroupIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const variant = computed(() => chrome?.variant.value ?? 'line')
const orientation = computed(() => chrome?.orientation.value ?? 'horizontal')

const arkAttrs = computed(() => splitArkAttrs(attrs))
</script>

<template>
  <ArkSegmentGroup.Indicator
    v-bind="arkAttrs"
    :data-variant="variant"
    :class="cn(segmentedIndicatorCVA({ variant, intent, orientation }), $attrs.class as string)"
  />
</template>
