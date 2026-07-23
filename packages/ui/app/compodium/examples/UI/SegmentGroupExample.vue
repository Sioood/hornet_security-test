<script setup lang="ts">
// oxlint-disable no-console
import { useSegmentGroup, type SegmentGroupValueChangeDetails } from '@ark-ui/vue/segment-group'

const selected = ref<string>('react')
const externalApi = useSegmentGroup({
  defaultValue: 'solid',
})

const options = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Vue', value: 'vue' },
]

const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const

function onValueChange(d: SegmentGroupValueChangeDetails) {
  console.log('valueChange:', d.value)
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Basic -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Basic</h2>
        <p class="text-sm text-neutral-text-subtle">
          Default segment group with animated indicator.
        </p>
      </div>
      <UISegmentGroup v-model="selected" :options @value-change="onValueChange" />
      <p class="font-mono text-xs text-neutral-text-subtle">Value: {{ selected || '(empty)' }}</p>
    </section>

    <!-- Controlled (v-model) -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled (v-model)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Fully controlled via <code>v-model</code>. External buttons set the value.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="selected = 'react'">React</UIButton>
        <UIButton size="sm" variant="subtle" @click="selected = 'vue'">Vue</UIButton>
        <UIButton size="sm" variant="subtle" @click="selected = ''">Clear</UIButton>
      </div>
      <UISegmentGroup v-model="selected" :options intent="secondary" />
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="intent in intents" :key="intent" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ intent }}</p>
          <UISegmentGroup :options :intent :model-value="options[0]?.value" />
        </div>
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div class="flex flex-col gap-6">
        <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ size }}</p>
          <UISegmentGroup :options :size :model-value="options[0]?.value" />
          <UISegmentGroup
            :options
            :size
            variant="pill"
            :model-value="options[0]?.value"
            :ui="{ root: 'w-full' }"
          />
        </div>
      </div>
    </section>

    <!-- Orientation -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Orientation</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Horizontal (default)</p>
          <UISegmentGroup :options :model-value="options[0]?.value" orientation="horizontal" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Vertical</p>
          <UISegmentGroup :options :model-value="options[0]?.value" orientation="vertical" />
        </div>
      </div>
    </section>

    <!-- Pill Variant -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Pill Variant</h2>
      <p class="text-sm text-neutral-text-subtle">
        Pill-style segment group without container background.
      </p>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Horizontal pill</p>
          <UISegmentGroup v-model="selected" :options variant="pill" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Vertical pill</p>
          <UISegmentGroup
            :options
            :model-value="options[0]?.value"
            variant="pill"
            orientation="vertical"
          />
        </div>
      </div>
    </section>

    <!-- Disabled -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Disabled</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Group disabled</p>
          <UISegmentGroup disabled :options :model-value="options[0]?.value" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Item disabled</p>
          <UISegmentGroup
            :options="[
              { value: 'a', label: 'Active' },
              { value: 'b', label: 'Disabled', disabled: true },
              { value: 'c', label: 'Active' },
            ]"
            :model-value="'a'"
          />
        </div>
      </div>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode (external API)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useSegmentGroup()</code> — allows setting the value imperatively.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalApi.setValue('react')">
          Set React
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalApi.setValue('vue')">
          Set Vue
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalApi.setValue('')"> Clear </UIButton>
      </div>
      <UISegmentGroup :value="externalApi" :options intent="accent" />
    </section>

    <!-- Custom slot content -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Custom slot content</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use the default slot to render custom items with icons.
      </p>
      <UISegmentGroup v-model="selected" intent="primary">
        <UISegmentGroupItem value="react">
          <UISegmentGroupItemText>⚛️ React</UISegmentGroupItemText>
          <UISegmentGroupItemControl class="hidden" />
          <UISegmentGroupItemHiddenInput />
        </UISegmentGroupItem>
        <UISegmentGroupItem value="vue">
          <UISegmentGroupItemText>💚 Vue</UISegmentGroupItemText>
          <UISegmentGroupItemControl class="hidden" />
          <UISegmentGroupItemHiddenInput />
        </UISegmentGroupItem>
      </UISegmentGroup>
    </section>
  </div>
</template>
