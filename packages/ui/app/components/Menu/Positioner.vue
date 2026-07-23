<script setup lang="ts">
import { Menu as ArkMenu } from '@ark-ui/vue/menu'

import { useFloatingLayerPositionerRef } from '~/composables/useLayerZIndexRef'
import { menuPositionerCVA } from '~/utils/Components/Menu/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface MenuPositionerProps {
  ui?: ClassValue
}

withDefaults(defineProps<MenuPositionerProps>(), {
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
  <ArkMenu.Positioner
    :ref="positionerRef"
    v-bind="positionerAttrs"
    :class="cn(menuPositionerCVA(), positionerAttrs.class as ClassValue, ui)"
  >
    <slot />
  </ArkMenu.Positioner>
</template>
