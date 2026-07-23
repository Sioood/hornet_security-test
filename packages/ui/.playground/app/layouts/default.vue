<script setup lang="ts">
const route = useRoute()

const navOptions = [
  { icon: 'tabler:layout-grid', label: 'Dashboard', to: '/', value: '/' },
  { icon: 'tabler:barbell', label: 'Training', to: '/training', value: '/training' },
  { icon: 'tabler:target', label: 'Goals', to: '/goals', value: '/goals' },
  { icon: 'tabler:users', label: 'Social', to: '/social', value: '/social' },
  { icon: 'tabler:user', label: 'Profile', to: '/profile', value: '/profile' },
] as const
</script>

<template>
  <div class="flex min-h-svh flex-col">
    <main class="flex-1">
      <slot />
    </main>
    <nav class="sticky bottom-0 bg-primary-surface">
      <UITabs
        v-model="route.path"
        :options="[...navOptions]"
        trigger-layout="stacked"
        :render-content="false"
        :ui="{ root: 'w-full', list: 'w-full', trigger: 'flex-1' }"
      />
    </nav>
  </div>
</template>
