<script setup lang="ts">
// oxlint-disable no-console
import { useTabs, type TabsValueChangeDetails } from '@ark-ui/vue/tabs'

const selected = ref<string>('react')
const route = useRoute()
const externalApi = useTabs({
  defaultValue: 'solid',
})

const options = [
  { icon: 'tabler:brand-react', label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { icon: 'tabler:brand-svelte', label: 'Svelte', value: 'svelte' },
  { icon: 'tabler:brand-vue', label: 'Vue', value: 'vue' },
]

const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const

function onValueChange(d: TabsValueChangeDetails) {
  console.log('valueChange:', d.value)
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Basic -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Basic</h2>
        <p class="text-sm text-neutral-text-subtle">Default tabs with animated indicator.</p>
      </div>
      <UITabs v-model="selected" :options @value-change="onValueChange" />
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
      <UITabs v-model="selected" :options intent="secondary" />
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="intent in intents" :key="intent" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ intent }}</p>
          <UITabs :options :intent :model-value="options[0]?.value" />
        </div>
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div class="flex flex-col gap-6">
        <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ size }}</p>
          <UITabs
            :options
            :size
            :model-value="options[0]?.value"
            :ui="{ root: 'w-full', list: 'w-full' }"
          />
          <UITabs
            :options
            :size
            variant="pill"
            :model-value="options[0]?.value"
            :ui="{ root: 'w-full', list: 'w-full' }"
          />
        </div>
      </div>
    </section>

    <!-- Vertical Orientation -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Vertical Orientation</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Horizontal (default)</p>
          <UITabs :options :model-value="options[0]?.value" orientation="horizontal" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Vertical</p>
          <UITabs :options :model-value="options[0]?.value" orientation="vertical" />
        </div>
      </div>
    </section>

    <!-- Subtle Variant -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Subtle Variant</h2>
      <p class="text-sm text-neutral-text-subtle">
        Underline-style tabs without container background.
      </p>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Horizontal subtle</p>
          <UITabs v-model="selected" :options variant="line" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Vertical subtle</p>
          <UITabs :options :model-value="options[0]?.value" variant="line" orientation="vertical" />
        </div>
      </div>
    </section>

    <!-- Vertical Dashboard Layout -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Vertical Dashboard Layout</h2>
      <p class="text-sm text-neutral-text-subtle">
        Vertical tabs with a fixed-height container, items stacked at the top with space below.
      </p>
      <UITabs
        v-model="selected"
        variant="line"
        :options="[
          { value: 'overview', label: 'Overview' },
          { value: 'analytics', label: 'Analytics' },
          { value: 'reports', label: 'Reports' },
          { value: 'settings', label: 'Settings' },
        ]"
        orientation="vertical"
        class="h-64"
      >
        <template #content-overview>
          <div
            class="rounded-md border border-neutral-border-subtle bg-neutral-fill-subtle p-4 disabled:pointer-events-none disabled:opacity-40"
          >
            <h3 class="text-lg font-semibold text-neutral-text">Overview</h3>
            <p class="mt-2 text-sm text-neutral-text-subtle">
              Dashboard overview with key metrics and recent activity.
            </p>
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div class="rounded-md bg-neutral-bg p-3">
                <p class="text-2xl font-bold text-primary-text">1,234</p>
                <p class="text-xs text-neutral-text-subtle">Total Users</p>
              </div>
              <div class="rounded-md bg-neutral-bg p-3">
                <p class="text-2xl font-bold text-accent-text">567</p>
                <p class="text-xs text-neutral-text-subtle">Active Sessions</p>
              </div>
            </div>
          </div>
        </template>
        <template #content-analytics>
          <div
            class="rounded-md border border-neutral-border-subtle bg-neutral-fill-subtle p-4 disabled:pointer-events-none disabled:opacity-40"
          >
            <h3 class="text-lg font-semibold text-neutral-text">Analytics</h3>
            <p class="mt-2 text-sm text-neutral-text-subtle">
              Detailed analytics and performance metrics.
            </p>
          </div>
        </template>
        <template #content-reports>
          <div
            class="rounded-md border border-neutral-border-subtle bg-neutral-fill-subtle p-4 disabled:pointer-events-none disabled:opacity-40"
          >
            <h3 class="text-lg font-semibold text-neutral-text">Reports</h3>
            <p class="mt-2 text-sm text-neutral-text-subtle">Generate and view reports.</p>
          </div>
        </template>
        <template #content-settings>
          <div
            class="rounded-md border border-neutral-border-subtle bg-neutral-fill-subtle p-4 disabled:pointer-events-none disabled:opacity-40"
          >
            <h3 class="text-lg font-semibold text-neutral-text">Settings</h3>
            <p class="mt-2 text-sm text-neutral-text-subtle">
              Configure your dashboard preferences.
            </p>
          </div>
        </template>
      </UITabs>
    </section>

    <!-- Disabled -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Disabled</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Group disabled</p>
          <UITabs disabled :options :model-value="options[0]?.value" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Item disabled</p>
          <UITabs
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
        Created via <code>useTabs()</code> — allows setting the value imperatively.
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
      <UITabs :value="externalApi" :options intent="accent" />
    </section>

    <!-- Mobile bottom nav (stacked triggers, routing) -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Mobile navigation (stacked, no panels)</h2>
      <p class="text-sm text-neutral-text-subtle">
        <code>trigger-layout="stacked"</code> with <code>render-content="false"</code> — use
        <code>:model-value="route.path"</code> (read-only from the router) and matching
        <code>value</code> / <code>to</code> on each option. Navigation is handled by
        <code>NuxtLink</code> inside the trigger (SPA, no full reload).
      </p>
      <UITabs
        v-model="route.path"
        :options="[
          { value: '/', label: 'Dashboard', icon: 'tabler:layout-grid', to: '/' },
          { value: '/training', label: 'Training', icon: 'tabler:barbell', to: '/training' },
          { value: '/goals', label: 'Goals', icon: 'tabler:target', to: '/goals' },
          { value: '/social', label: 'Social', icon: 'tabler:users', to: '/social' },
          { value: '/profile', label: 'Profile', icon: 'tabler:user', to: '/profile' },
        ]"
        trigger-layout="stacked"
        :render-content="false"
        :ui="{ root: 'w-full', list: 'w-full', trigger: 'flex-1' }"
      />
    </section>

    <!-- Custom slot content -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Custom slot content</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use the default slot to render custom triggers and content.
      </p>
      <UITabsRoot v-model="selected" intent="primary">
        <UITabsList>
          <UITabsTrigger value="react">⚛️ React</UITabsTrigger>
          <UITabsTrigger value="vue">💚 Vue</UITabsTrigger>
        </UITabsList>
        <UITabsContent value="react">
          <p>React content here</p>
        </UITabsContent>
        <UITabsContent value="vue">
          <p>Vue content here</p>
        </UITabsContent>
      </UITabsRoot>
    </section>
  </div>
</template>
