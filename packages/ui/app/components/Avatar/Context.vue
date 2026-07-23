<script setup lang="ts">
import { Avatar as ArkAvatar } from '@ark-ui/vue/avatar'

defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkAvatar.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkAvatar.Context>
</template>
