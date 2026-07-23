<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import { selectChromeKey, type SelectSize } from '~/utils/Components/Form/Select/context'
import { selectClearTriggerCVA, selectIconSizeCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectClearTriggerProps {
  size?: SelectSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<SelectClearTriggerProps>(), {
  size: undefined,
  ui: undefined,
})

const chrome = inject(selectChromeKey, null)
const attrs = useAttrs()

const size = computed(() => props.size ?? chrome?.size.value ?? 'md')
const iconClass = computed(() => cn(selectIconSizeCVA({ size: size.value })))

const clearAttrs = computed(() => {
  const {
    size: _size,
    ui: _ui,
    ...rest
  } = attrs as Record<string, unknown> & {
    size?: SelectSize
    ui?: ClassValue
  }
  return rest
})
</script>

<template>
  <ArkSelect.ClearTrigger
    v-bind="clearAttrs"
    :class="cn(selectClearTriggerCVA(), clearAttrs.class as ClassValue, ui)"
    @click.prevent
  >
    <slot>
      <UIFormSelectGlyph name="x" :glyph-class="iconClass" />
    </slot>
  </ArkSelect.ClearTrigger>
</template>
