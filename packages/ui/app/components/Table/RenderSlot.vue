<script setup lang="ts">
const props = defineProps<{
  render?: ((slotProps: unknown) => unknown) | undefined
  slotProps: unknown
}>()
</script>

<template>
  <component :is="{ render: () => props.render!(props.slotProps) }" v-if="props.render" />
</template>
