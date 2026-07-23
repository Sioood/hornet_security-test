<script setup lang="ts">
const pages = [
  {
    title: 'Previews',
    to: '/previews',
  },
]
</script>

<template>
  <main class="flex min-h-svh flex-col gap-4 p-12">
    <ul class="flex flex-col gap-2">
      <li v-for="page in pages" :key="page.title">
        <UILink :to="page.to">{{ page.title }}</UILink>
      </li>
    </ul>
  </main>
</template>
