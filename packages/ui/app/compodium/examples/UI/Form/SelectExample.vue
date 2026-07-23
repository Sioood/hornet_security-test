<script setup lang="ts">
// oxlint-disable no-console
import { createListCollection, useSelect } from '@ark-ui/vue/select'

import type { SelectItem } from '~/components/Form/Select/index.vue'

// ── Basic ──────────────────────────────────────────────────────────────────
const basicValue = ref<string[]>([])

const frameworks: SelectItem[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid' },
  { disabled: true, label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember' },
  { label: 'Panda', value: 'panda' },
  { label: 'Tailwind', value: 'tailwind' },
  { label: 'Bootstrap', value: 'bootstrap' },
  { label: 'Material UI', value: 'material-ui' },
  { label: 'Chakra UI', value: 'chakra-ui' },
  { label: 'Ant Design', value: 'ant-design' },
  { label: 'PrimeVue', value: 'primevue' },
  { label: 'Vuetify', value: 'vuetify' },
  { label: 'Nuxt UI', value: 'nuxt-ui' },
]

// ── Multiple ───────────────────────────────────────────────────────────────
const multipleValue = ref<string[]>([])

// ── Grouping ───────────────────────────────────────────────────────────────
const groupValue = ref<string[]>([])

const groupedItems: SelectItem[] = [
  { group: 'JS', label: 'React', value: 'react' },
  { group: 'JS', label: 'Solid', value: 'solid' },
  { group: 'JS', label: 'Vue', value: 'vue' },
  { group: 'CSS', label: 'Panda', value: 'panda' },
  { group: 'CSS', label: 'Tailwind', value: 'tailwind' },
]

// ── Max selection ──────────────────────────────────────────────────────────
const maxValue = ref<string[]>([])
const MAX = 2

// ── Select All ─────────────────────────────────────────────────────────────
const selectAllValue = ref<string[]>([])

// ── Intents ────────────────────────────────────────────────────────────────
const intentValue = ref<string[]>([])

// ── Sizes ──────────────────────────────────────────────────────────────────
const sizeValue = ref<string[]>([])

// ── Async loading ──────────────────────────────────────────────────────────
const asyncItems = ref<SelectItem[] | null>(null)
const asyncLoading = ref(false)
const asyncOpen = ref(false)
const asyncValue = ref<string[]>([])

async function handleAsyncOpen(isOpen: boolean | undefined) {
  asyncOpen.value = isOpen ?? false
  if (!isOpen || asyncItems.value !== null) return
  asyncLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1200))
  asyncItems.value = [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Angular', value: 'angular' },
    { label: 'Ember', value: 'ember' },
  ]
  asyncLoading.value = false
}

// ── Form usage ─────────────────────────────────────────────────────────────
const formValue = ref<string[]>(['vue'])
const formResult = ref<string | null>(null)

function handleFormSubmit(e: Event) {
  e.preventDefault()
  const data = new FormData(e.target as HTMLFormElement)
  formResult.value = data.get('framework') as string
}

// ── Controlled open ────────────────────────────────────────────────────────
const controlledOpen = ref(false)
const controlledValue = ref<string[]>([])

// ── Deselectable (single) ──────────────────────────────────────────────────
const deselectableValue = ref<string[]>([])

const providerItems: SelectItem[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid' },
]

const providerCollection = computed(() => createListCollection({ items: providerItems }))

const providerApi = useSelect({
  collection: providerCollection.value,
})
</script>

<template>
  <div class="flex max-w-xl flex-col gap-8 p-6">
    <!-- Basic single select -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Basic</p>
      <UIFormSelect
        v-model="basicValue"
        :items="frameworks"
        placeholder="Select a framework"
        label="Framework"
      />
      <p class="txt-caption text-neutral-text-subtle">Value: {{ basicValue[0] ?? 'none' }}</p>
    </section>

    <!-- Multiple selection -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Multiple</p>
      <UIFormSelect
        v-model="multipleValue"
        :items="frameworks"
        placeholder="Select frameworks"
        label="Frameworks"
        multiple
      />
      <p class="txt-caption text-neutral-text-subtle">
        Selected: {{ multipleValue.join(', ') || 'none' }}
      </p>
    </section>

    <!-- Grouping -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Grouping</p>
      <UIFormSelect
        v-model="groupValue"
        :items="groupedItems"
        placeholder="Select a tool"
        label="Tool"
      />
      <p class="txt-caption text-neutral-text-subtle">Value: {{ groupValue[0] ?? 'none' }}</p>
    </section>

    <!-- Max selection -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Max selection ({{ MAX }})</p>
      <UIFormSelect
        v-model="maxValue"
        :items="frameworks"
        placeholder="Select up to 2"
        label="Frameworks (max 2)"
        multiple
        :max-selection="MAX"
      />
      <p class="txt-caption text-neutral-text-subtle">
        Selected: {{ maxValue.join(', ') || 'none' }}
      </p>
    </section>

    <!-- Select All -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Select All</p>
      <UIFormSelect
        v-model="selectAllValue"
        :items="frameworks"
        placeholder="Select frameworks"
        label="Frameworks"
        multiple
        allow-select-all
      />
      <p class="txt-caption text-neutral-text-subtle">
        Selected ({{ selectAllValue.length }}): {{ selectAllValue.join(', ') || 'none' }}
      </p>
    </section>

    <!-- Async loading -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Async loading</p>
      <UIFormSelect
        v-model="asyncValue"
        v-model:open="asyncOpen"
        :items="asyncItems"
        :loading="asyncLoading"
        placeholder="Click to load…"
        label="Framework (async)"
        @update:open="handleAsyncOpen"
      />
      <p class="txt-caption text-neutral-text-subtle">Value: {{ asyncValue[0] ?? 'none' }}</p>
    </section>

    <!-- Form usage -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Form usage</p>
      <form class="flex flex-col gap-3" @submit="handleFormSubmit">
        <UIFormSelect
          v-model="formValue"
          :items="frameworks"
          placeholder="Select a framework"
          label="Framework"
          name="framework"
          required
        />
        <UIButton type="submit" size="sm" intent="primary" text="Submit" />
      </form>
      <p v-if="formResult !== null" class="txt-caption text-neutral-text-subtle">
        Submitted: {{ formResult }}
      </p>
    </section>

    <!-- Controlled open -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Controlled open</p>
      <div class="flex items-center gap-2">
        <UIButton
          size="sm"
          variant="subtle"
          intent="neutral"
          :text="controlledOpen ? 'Close' : 'Open programmatically'"
          @click="controlledOpen = !controlledOpen"
        />
      </div>
      <UIFormSelect
        v-model="controlledValue"
        v-model:open="controlledOpen"
        :items="frameworks"
        placeholder="Select a framework"
      />
    </section>

    <!-- Deselectable single select -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Deselectable (single)</p>
      <UIFormSelect
        v-model="deselectableValue"
        :items="frameworks"
        placeholder="Select, then click again to deselect"
        label="Framework"
        deselectable
      />
      <p class="txt-caption text-neutral-text-subtle">
        Value: {{ deselectableValue[0] ?? 'none' }}
      </p>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Intents</p>
      <div class="grid grid-cols-2 gap-2">
        <UIFormSelect
          v-for="intent in ['neutral', 'primary', 'secondary', 'accent'] as const"
          :key="intent"
          v-model="intentValue"
          :items="frameworks"
          :placeholder="intent"
          :intent
          size="sm"
        />
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Sizes</p>
      <UIFormSelect
        v-for="size in ['sm', 'md', 'lg'] as const"
        :key="size"
        v-model="sizeValue"
        :items="frameworks"
        :placeholder="`Size: ${size}`"
        :size
      />
    </section>

    <!-- Disabled / invalid / read-only -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">States</p>
      <UIFormSelect v-model="basicValue" :items="frameworks" placeholder="Disabled" disabled />
      <UIFormSelect v-model="basicValue" :items="frameworks" placeholder="Invalid" invalid />
      <UIFormSelect
        :items="frameworks"
        placeholder="Read-only"
        read-only
        :model-value="['react']"
      />
    </section>

    <!-- RootProvider compound mode -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">RootProvider compound</p>
      <UIButton size="sm" @click="providerApi.setValue(['react'])">
        Select React externally
      </UIButton>
      <UIFormSelectRoot :value="providerApi" intent="primary" size="md">
        <UIFormSelectLabel>Provider mode</UIFormSelectLabel>
        <UIFormSelectControl>
          <UIFormSelectTrigger>
            <UIFormSelectValueText placeholder="Provider select…" />
            <UIFormSelectIndicator />
          </UIFormSelectTrigger>
        </UIFormSelectControl>
        <Teleport to="body">
          <UIFormSelectPositioner>
            <UIFormSelectContent>
              <UIFormSelectListContent
                :collection="providerCollection"
                intent="primary"
                size="md"
                :loading="false"
                loading-text="Loading…"
                empty-text="No results"
                :allow-select-all="false"
                :is-grouped="false"
              />
            </UIFormSelectContent>
          </UIFormSelectPositioner>
        </Teleport>
        <UIFormSelectHiddenSelect />
      </UIFormSelectRoot>
    </section>
  </div>
</template>
