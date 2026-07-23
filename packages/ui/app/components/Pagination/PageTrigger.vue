<script setup lang="ts">
import {
  Pagination as ArkPagination,
  usePaginationContext,
  type PaginationItemBaseProps,
} from '@ark-ui/vue/pagination'

import {
  paginationChromeKey,
  type PaginationIntent,
  type PaginationSize,
} from '~/utils/Components/Pagination/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIPaginationPageTriggerSlots {
  root?: ClassValue
}

export interface PaginationPageTriggerProps extends PaginationItemBaseProps {
  /** @default 'page' */
  type?: 'page'
  intent?: PaginationIntent
  size?: PaginationSize
  ui?: Partial<UIPaginationPageTriggerSlots>
}

const props = withDefaults(defineProps<PaginationPageTriggerProps>(), {
  intent: undefined,
  size: undefined,
  type: 'page' as const,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(paginationChromeKey, null)

const api = usePaginationContext()

const intent = computed<PaginationIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<PaginationSize>(() => props.size ?? chrome?.size.value ?? 'md')

const isSelected = computed(() => api.value?.page === props.value)

const itemProps = computed(() => pick(props, ['asChild'] as const))

const itemAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIPaginationPageTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {
    value: 1,
  },
})
</script>

<template>
  <ArkPagination.Item
    v-if="itemProps.asChild"
    v-bind="{ ...itemProps, ...itemAttrs, value, type: 'page' }"
    :class="ui?.root"
  >
    <slot>{{ value }}</slot>
  </ArkPagination.Item>
  <ArkPagination.Item
    v-else
    v-bind="{ ...itemAttrs, value, type: 'page' }"
    as-child
    :class="ui?.root"
  >
    <UIButton
      :variant="isSelected ? 'default' : 'subtle'"
      :intent
      :size
      :ui="{ root: 'tabular-nums' }"
    >
      <slot>{{ value }}</slot>
    </UIButton>
  </ArkPagination.Item>
</template>
