<script setup lang="ts">
import { TabContent, type TabContentBaseProps } from '@ark-ui/vue/tabs'
import { cva } from 'class-variance-authority'

import { tabsChromeKey } from '~/utils/Components/Tabs/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITabsContentSlots {
  root?: ClassValue
}

export interface TabsContentProps extends TabContentBaseProps {
  lazyMount?: boolean
  unmountOnExit?: boolean
  /** Teleport panel markup to `teleportTo` (e.g. `'body'` or a layout outlet selector). */
  portalled?: boolean
  teleportTo?: string
  ui?: Partial<UITabsContentSlots>
}

const tabsContentCVA = cva('outline-none', {
  variants: {
    orientation: {
      horizontal: 'mt-4',
      vertical: 'mt-0 ml-4',
    },
  },
})

const props = withDefaults(defineProps<TabsContentProps>(), {
  lazyMount: undefined,
  portalled: false,
  teleportTo: 'body',
  ui: undefined,
  unmountOnExit: undefined,
})

const attrs = useAttrs()

const chrome = inject(tabsChromeKey, null)

const orientation = computed(() => chrome?.orientation.value ?? 'horizontal')

const contentProps = computed(() =>
  pick(props, ['asChild', 'value', 'lazyMount', 'unmountOnExit'] as const),
)
const contentAttrs = computed(() => splitArkAttrs(attrs))

const contentClass = computed(() =>
  cn(tabsContentCVA({ orientation: orientation.value }), props.ui?.root),
)
</script>

<template>
  <Teleport :to="teleportTo" :disabled="!portalled">
    <TabContent v-bind="{ ...contentProps, ...contentAttrs }" :class="contentClass">
      <slot />
    </TabContent>
  </Teleport>
</template>
