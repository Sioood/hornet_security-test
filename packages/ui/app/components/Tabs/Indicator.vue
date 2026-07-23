<script setup lang="ts">
import { TabIndicator, type TabIndicatorBaseProps } from '@ark-ui/vue/tabs'

import { segmentedIndicatorCVA } from '~/utils/Components/Segmented/variants'
import { tabsChromeKey, type TabsIntent } from '~/utils/Components/Tabs/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITabsIndicatorSlots {
  root?: ClassValue
}

export interface TabsIndicatorProps extends TabIndicatorBaseProps {
  intent?: TabsIntent
  ui?: Partial<UITabsIndicatorSlots>
}

const props = withDefaults(defineProps<TabsIndicatorProps>(), {
  intent: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(tabsChromeKey, null)
const intent = computed<TabsIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const variant = computed(() => chrome?.variant.value ?? 'line')
const orientation = computed(() => chrome?.orientation.value ?? 'horizontal')

const indicatorProps = computed(() => pick(props, ['asChild'] as const))
const indicatorAttrs = computed(() => splitArkAttrs(attrs))
</script>

<template>
  <TabIndicator
    v-bind="{ ...indicatorProps, ...indicatorAttrs }"
    :data-variant="variant"
    :class="cn(segmentedIndicatorCVA({ variant, intent, orientation }), ui?.root)"
  />
</template>
