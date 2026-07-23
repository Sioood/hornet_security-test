<script setup lang="ts">
import { TabList, type TabListBaseProps } from '@ark-ui/vue/tabs'

import { segmentedRootCVA } from '~/utils/Components/Segmented/variants'
import { tabsChromeKey, type TabsIntent, type TabsSize } from '~/utils/Components/Tabs/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITabsListSlots {
  root?: ClassValue
}

export interface TabsListProps extends TabListBaseProps {
  asChild?: boolean
  intent?: TabsIntent
  size?: TabsSize
  ui?: Partial<UITabsListSlots>
}

const props = withDefaults(defineProps<TabsListProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(tabsChromeKey, null)

const intent = computed<TabsIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TabsSize>(() => props.size ?? chrome?.size.value ?? 'md')
const orientation = computed(() => chrome?.orientation.value ?? 'horizontal')
const variant = computed(() => chrome?.variant.value ?? 'line')

const listProps = computed(() => pick(props, ['asChild'] as const))
const listAttrs = computed(() => splitArkAttrs(attrs))

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <TabList
    v-bind="{ ...listProps, ...listAttrs }"
    :class="cn(segmentedRootCVA({ variant, intent, size, orientation }), ui?.root)"
  >
    <slot />
  </TabList>
</template>
