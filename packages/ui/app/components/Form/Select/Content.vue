<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import {
  selectChromeKey,
  type SelectIntent,
  type SelectSize,
} from '~/utils/Components/Form/Select/context'
import { selectContentCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectContentProps {
  intent?: SelectIntent
  size?: SelectSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<SelectContentProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(selectChromeKey, null)
const attrs = useAttrs()

const intent = computed(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed(() => props.size ?? chrome?.size.value ?? 'md')

const contentAttrs = computed(() => {
  const {
    intent: _intent,
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    intent?: SelectIntent
    size?: SelectSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkSelect.Content
    v-bind="contentAttrs"
    :class="cn(selectContentCVA({ intent, size }), contentAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkSelect.Content>
</template>

<style scoped>
:deep([data-part='content'][data-state='open']) {
  animation: scale-fade-in 100ms ease-out;
}

:deep([data-part='content'][data-state='closed']) {
  animation: scale-fade-out 50ms ease-in;
}

@keyframes scale-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scale-fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
