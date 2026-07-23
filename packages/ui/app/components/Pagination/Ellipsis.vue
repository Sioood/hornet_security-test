<script setup lang="ts">
import {
  Pagination as ArkPagination,
  type PaginationEllipsisBaseProps,
} from '@ark-ui/vue/pagination'

import { paginationChromeKey, type PaginationSize } from '~/utils/Components/Pagination/context'
import { paginationEllipsisCVA } from '~/utils/Components/Pagination/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIPaginationEllipsisSlots {
  root?: ClassValue
}

export interface PaginationEllipsisProps extends PaginationEllipsisBaseProps {
  size?: PaginationSize
  ui?: Partial<UIPaginationEllipsisSlots>
}

const props = withDefaults(defineProps<PaginationEllipsisProps>(), {
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(paginationChromeKey, null)

const size = computed<PaginationSize>(() => props.size ?? chrome?.size.value ?? 'md')

const ellipsisProps = computed(() => pick(props, ['index'] as const))

const ellipsisAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIPaginationEllipsisSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {
    index: 0,
  },
})
</script>

<template>
  <ArkPagination.Ellipsis
    v-bind="{ ...ellipsisProps, ...ellipsisAttrs }"
    :class="cn(paginationEllipsisCVA({ size }), ui?.root)"
  >
    <slot>
      <Icon name="tabler:dots" class="size-4 shrink-0" />
    </slot>
  </ArkPagination.Ellipsis>
</template>
