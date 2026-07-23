<script setup lang="ts">
const previews = [
  {
    title: 'Component Bento',
    to: '/previews/bento',
  },
  {
    title: 'Movie Detail Page',
    to: '/previews/movie',
  },
]
</script>

<template>
  <main class="flex flex-col gap-4 p-12">
    <ul class="flex flex-col gap-2">
      <li v-for="preview in previews" :key="preview.title">
        <UILink :to="preview.to">{{ preview.title }}</UILink>
      </li>
    </ul>
  </main>
</template>
