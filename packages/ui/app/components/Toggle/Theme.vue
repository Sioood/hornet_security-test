<script setup lang="ts">
const isDark = useDark()
const toggleTheme = useToggle(isDark)
</script>

<template>
  <UIToggle v-model:pressed="isDark" @pressed-change="toggleTheme">
    <template #on>
      <Icon name="tabler:moon" />
    </template>
    <template #off>
      <Icon name="tabler:sun" />
    </template>
    <template #fallback>
      <Icon name="tabler:moon" />
    </template>
  </UIToggle>
</template>
