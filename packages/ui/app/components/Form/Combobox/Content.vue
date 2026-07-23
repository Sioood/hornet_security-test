<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

import {
  comboboxChromeKey,
  type ComboboxIntent,
  type ComboboxSize,
} from '~/utils/Components/Form/Combobox/context'
import { comboboxContentCVA } from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface ComboboxContentProps {
  intent?: ComboboxIntent
  size?: ComboboxSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<ComboboxContentProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const chrome = inject(comboboxChromeKey, null)
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
    intent?: ComboboxIntent
    size?: ComboboxSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkCombobox.Content
    v-bind="contentAttrs"
    :class="cn(comboboxContentCVA({ intent, size }), contentAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkCombobox.Content>
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
