<script setup lang="ts">
import type { ClassValue } from 'vue'

defineProps<{
  title: string
  class?: ClassValue
}>()
</script>

<template>
  <UICardBase
    variant="subtle"
    intent="neutral"
    size="lg"
    :class="cn('flex flex-col gap-3', $props.class)"
  >
    <h2 class="txt-label text-neutral-text-subtle">{{ title }}</h2>
    <slot />
  </UICardBase>
</template>
