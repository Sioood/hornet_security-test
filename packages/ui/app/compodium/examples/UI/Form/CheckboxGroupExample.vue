<script setup lang="ts">
const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
]

const value = ref<string[]>(['vue'])
</script>

<template>
  <div class="flex flex-col gap-10 p-4">
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Vertical (Default)</h3>
      <UIFormCheckboxGroup
        v-model="value"
        helper-text="Choose your preferred frameworks"
        label="Frameworks"
        name="framework-v"
        :items
      />
    </section>

    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Horizontal</h3>
      <UIFormCheckboxGroup
        v-model="value"
        orientation="horizontal"
        helper-text="Select multiple options"
        label="Frameworks (Horizontal)"
        name="framework-h"
        intent="primary"
        :items
      />
    </section>

    <div class="txt-caption text-neutral-text-subtle">Selected: {{ value }}</div>
  </div>
</template>
