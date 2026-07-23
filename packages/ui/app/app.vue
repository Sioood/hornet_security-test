<script setup lang="ts">
import DrawerExample from './compodium/examples/UI/DrawerExample.vue'
</script>

<template>
  <NuxtPwaAssets />
  <div>
    <h1>{{ $t('hell') }}</h1>
    <p class="font-mono">{{ $t('namespace:hell') }}</p>
    <DrawerExample />
  </div>
  <UIToast />
  <UIPwaNotifier />
</template>
