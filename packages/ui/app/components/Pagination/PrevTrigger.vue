<script setup lang="ts">
import {
  Pagination as ArkPagination,
  type PaginationPrevTriggerBaseProps,
} from '@ark-ui/vue/pagination'

import {
  paginationChromeKey,
  type PaginationIntent,
  type PaginationSize,
} from '~/utils/Components/Pagination/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIPaginationPrevTriggerSlots {
  root?: ClassValue
}

export interface PaginationPrevTriggerProps extends PaginationPrevTriggerBaseProps {
  intent?: PaginationIntent
  size?: PaginationSize
  ui?: Partial<UIPaginationPrevTriggerSlots>
}

const props = withDefaults(defineProps<PaginationPrevTriggerProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()

const chrome = inject(paginationChromeKey, null)

const intent = computed<PaginationIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<PaginationSize>(() => props.size ?? chrome?.size.value ?? 'md')

const triggerProps = computed(() => pick(props, ['asChild'] as const))

const triggerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIPaginationPrevTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkPagination.PrevTrigger
    v-if="triggerProps.asChild"
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    :class="ui?.root"
  >
    <slot>
      <Icon name="tabler:chevron-left" class="size-4 shrink-0" />
    </slot>
  </ArkPagination.PrevTrigger>
  <ArkPagination.PrevTrigger v-else v-bind="triggerAttrs" as-child :class="ui?.root">
    <UIButton :variant="'subtle'" :intent :size>
      <slot>
        <Icon name="tabler:chevron-left" class="size-4 shrink-0" />
      </slot>
    </UIButton>
  </ArkPagination.PrevTrigger>
</template>
