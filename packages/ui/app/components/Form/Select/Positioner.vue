<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

import { useFloatingLayerPositionerRef } from '~/composables/useLayerZIndexRef'
import { selectPositionerCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface SelectPositionerProps {
  ui?: ClassValue
}

withDefaults(defineProps<SelectPositionerProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const positionerRef = useFloatingLayerPositionerRef()

const positionerAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: ClassValue }
  return rest
})
</script>

<template>
  <ArkSelect.Positioner
    :ref="positionerRef"
    v-bind="positionerAttrs"
    :class="cn(selectPositionerCVA(), positionerAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkSelect.Positioner>
</template>
