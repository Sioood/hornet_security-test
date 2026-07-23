<script setup lang="ts">
import {
  SegmentGroup as ArkSegmentGroup,
  type SegmentGroupItemBaseProps,
} from '@ark-ui/vue/segment-group'

import { segmentedItemCVA } from '~/utils/Components/Segmented/variants'
import {
  segmentGroupChromeKey,
  type SegmentGroupIntent,
  type SegmentGroupSize,
} from '~/utils/Components/SegmentGroup/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UISegmentGroupItemSlots {
  root?: ClassValue
}

export interface SegmentGroupItemProps extends SegmentGroupItemBaseProps {
  intent?: SegmentGroupIntent
  size?: SegmentGroupSize
  ui?: Partial<UISegmentGroupItemSlots>
}

const props = withDefaults(defineProps<SegmentGroupItemProps>(), {
  disabled: undefined,
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(segmentGroupChromeKey, null)

const intent = computed<SegmentGroupIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<SegmentGroupSize>(() => props.size ?? chrome?.size.value ?? 'md')
const orientation = computed(() => chrome?.orientation.value ?? 'horizontal')
const variant = computed(() => chrome?.variant.value ?? 'line')
const isDisabled = computed(() => props.disabled ?? false)

const itemProps = computed(() => pick(props, ['asChild', 'disabled', 'value'] as const))
const itemAttrs = computed(() => splitArkAttrs(attrs))

extendCompodiumMeta({
  defaultProps: {
    value: 'react',
  },
})
</script>

<template>
  <ArkSegmentGroup.Item
    v-bind="{ ...itemProps, ...itemAttrs }"
    :class="
      cn(segmentedItemCVA({ variant, intent, size, orientation, disabled: isDisabled }), ui?.root)
    "
  >
    <slot />
  </ArkSegmentGroup.Item>
</template>
