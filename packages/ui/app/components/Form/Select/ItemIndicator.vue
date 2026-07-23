<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import { selectChromeKey, type SelectSize } from '~/utils/Components/Form/Select/context'
import { selectIconSizeCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectItemIndicatorProps {
  size?: SelectSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<SelectItemIndicatorProps>(), {
  size: undefined,
  ui: undefined,
})

const chrome = inject(selectChromeKey, null)
const attrs = useAttrs()

const size = computed(() => props.size ?? chrome?.size.value ?? 'md')
const iconClass = computed(() => cn(selectIconSizeCVA({ size: size.value })))

const indicatorAttrs = computed(() => {
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
  <ArkSelect.ItemIndicator
    v-bind="indicatorAttrs"
    :class="cn('data-[state=unchecked]:invisible', indicatorAttrs.class as ClassValue, ui)"
  >
    <slot>
      <UIFormSelectGlyph name="check" :glyph-class="iconClass" />
    </slot>
  </ArkSelect.ItemIndicator>
</template>
