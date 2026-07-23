<script setup lang="ts">
import { Drawer as ArkDrawer } from '@ark-ui/vue/drawer'
</script>

<template>
  <ArkDrawer.Stack>
    <slot />
  </ArkDrawer.Stack>
</template>
