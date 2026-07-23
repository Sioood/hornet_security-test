<script setup lang="ts">
import {
  Pagination as ArkPagination,
  type PaginationFirstTriggerBaseProps,
} from '@ark-ui/vue/pagination'

import {
  paginationChromeKey,
  type PaginationIntent,
  type PaginationSize,
} from '~/utils/Components/Pagination/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIPaginationFirstTriggerSlots {
  root?: ClassValue
}

export interface PaginationFirstTriggerProps extends PaginationFirstTriggerBaseProps {
  intent?: PaginationIntent
  size?: PaginationSize
  ui?: Partial<UIPaginationFirstTriggerSlots>
}

const props = withDefaults(defineProps<PaginationFirstTriggerProps>(), {
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
    ui?: Partial<UIPaginationFirstTriggerSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {},
})
</script>

<template>
  <ArkPagination.FirstTrigger
    v-if="triggerProps.asChild"
    v-bind="{ ...triggerProps, ...triggerAttrs }"
    :class="ui?.root"
  >
    <slot>
      <Icon name="tabler:chevrons-left" class="size-4 shrink-0" />
    </slot>
  </ArkPagination.FirstTrigger>
  <ArkPagination.FirstTrigger v-else v-bind="triggerAttrs" as-child :class="ui?.root">
    <UIButton :variant="'subtle'" :intent :size>
      <slot>
        <Icon name="tabler:chevrons-left" class="size-4 shrink-0" />
      </slot>
    </UIButton>
  </ArkPagination.FirstTrigger>
</template>
