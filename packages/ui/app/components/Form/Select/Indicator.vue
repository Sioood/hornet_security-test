<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import { selectChromeKey, type SelectSize } from '~/utils/Components/Form/Select/context'
import { selectIconSizeCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectIndicatorProps {
  size?: SelectSize
  ui?: ClassValue
}

const props = withDefaults(defineProps<SelectIndicatorProps>(), {
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
  <ArkSelect.Indicator
    v-bind="indicatorAttrs"
    :class="
      cn(
        'inline-flex items-center transition-transform data-[state=open]:rotate-180',
        indicatorAttrs.class as ClassValue,
        ui,
      )
    "
  >
    <slot>
      <UIFormSelectGlyph name="chevron-down" :glyph-class="iconClass" />
    </slot>
  </ArkSelect.Indicator>
</template>
