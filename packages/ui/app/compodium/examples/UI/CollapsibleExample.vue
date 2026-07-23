<script setup lang="ts">
import { useCollapsible, type CollapsibleOpenChangeDetails } from '@ark-ui/vue/collapsible'

const open = ref(false)
const externalCollapsible = useCollapsible({ defaultOpen: false })
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-12 p-6">
    <!-- Basic usage -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Basic (Root mode)</h3>
      <UICollapsible
        heading="What is a Collapsible?"
        @open-change="(d: CollapsibleOpenChangeDetails) => console.log('openChange', d)"
      >
        A Collapsible is a component that shows or hides content with an animated transition. It is
        perfect for FAQ sections, details, and progressive disclosure.
      </UICollapsible>
    </section>

    <!-- Disabled -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Disabled</h3>
      <UICollapsible heading="Locked (disabled)" disabled>
        This content is hidden and cannot be expanded.
      </UICollapsible>
    </section>

    <!-- Controlled state -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Controlled State (v-model)</h3>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="open = true">Open</UIButton>
        <UIButton size="sm" variant="subtle" @click="open = false">Close</UIButton>
        <UIButton size="sm" variant="subtle" @click="open = !open">Toggle</UIButton>
      </div>
      <p class="font-mono text-xs text-neutral-text-subtle">open={{ open }}</p>
      <UICollapsible
        v-model="open"
        heading="Controlled Collapsible"
        @open-change="(d: CollapsibleOpenChangeDetails) => console.log('openChange', d)"
      >
        This panel is controlled from outside via <code>v-model</code>.
      </UICollapsible>
    </section>

    <!-- Nested collapsibles -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Nested</h3>
      <UICollapsible heading="Level 1 — Outer">
        <p class="mb-3 text-sm text-neutral-text-subtle">
          Outer content and a nested collapsible below.
        </p>
        <UICollapsible heading="Level 2 — Inner">
          <p class="text-sm">This is nested inside the outer collapsible.</p>
        </UICollapsible>
      </UICollapsible>
    </section>

    <!-- Without animation -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">No Animation</h3>
      <UICollapsible heading="No animation panel" :content-animated="false">
        <p class="text-sm">This panel opens instantly with no height transition.</p>
      </UICollapsible>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">RootProvider mode (external API)</h3>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useCollapsible()</code> — call
        <code>externalCollapsible.value.setOpen()</code> from outside.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalCollapsible.setOpen(true)">
          Open
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalCollapsible.setOpen(false)">
          Close
        </UIButton>
      </div>
      <UICollapsible
        :value="externalCollapsible"
        heading="Externally Controlled"
        @open-change="(d: CollapsibleOpenChangeDetails) => console.log('openChange', d)"
      >
        This panel is controlled entirely by <code>useCollapsible()</code>.
      </UICollapsible>
    </section>
  </div>
</template>
