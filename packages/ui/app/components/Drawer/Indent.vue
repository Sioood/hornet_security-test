<script setup lang="ts">
import { Drawer as ArkDrawer } from '@ark-ui/vue/drawer'

import type { ClassValue } from 'vue'

export interface UIDrawerIndentSlots {
  root?: ClassValue
}

interface DrawerIndentProps {
  ui?: Partial<UIDrawerIndentSlots>
}

const props = withDefaults(defineProps<DrawerIndentProps>(), {
  ui: undefined,
})
</script>

<template>
  <ArkDrawer.Indent :class="cn('drawer-indent', props.ui?.root)">
    <slot />
  </ArkDrawer.Indent>
</template>

<style scoped>
.drawer-indent {
  transition: border-radius 300ms ease;

  &[data-active] {
    border-radius: calc(1rem * (1 - var(--drawer-swipe-progress, 0)));
  }
}
</style>
