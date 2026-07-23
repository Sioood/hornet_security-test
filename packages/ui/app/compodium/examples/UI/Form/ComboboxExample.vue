<script setup lang="ts">
// oxlint-disable no-console
import { useCombobox, useListCollection } from '@ark-ui/vue/combobox'
import { useFilter } from '@ark-ui/vue/locale'

import type { ComboboxItem } from '~/components/Form/Combobox/index.vue'

const basicValue = ref<string[]>([])
const multipleValue = ref<string[]>([])
const controlledInput = ref('')
const controlledOpen = ref(false)

const frameworks: ComboboxItem[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid' },
  { disabled: true, label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
]

const groupedItems: ComboboxItem[] = [
  { group: 'JS', label: 'React', value: 'react' },
  { group: 'JS', label: 'Solid', value: 'solid' },
  { group: 'CSS', label: 'Tailwind', value: 'tailwind' },
]

const filters = useFilter({ sensitivity: 'base' })

const providerCollection = useListCollection({
  filter: filters.value.contains,
  initialItems: frameworks,
})

const providerApi = useCombobox({
  collection: providerCollection.collection.value,
  onInputValueChange(details) {
    providerCollection.filter(details.inputValue)
  },
})

const asyncItems = ref<ComboboxItem[] | null>(null)
const asyncLoading = ref(false)
const asyncValue = ref<string[]>([])

async function loadAsyncItems() {
  if (asyncItems.value !== null) return
  asyncLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 800))
  asyncItems.value = frameworks
  asyncLoading.value = false
}
</script>

<template>
  <div class="flex flex-col gap-8 p-4">
    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Basic</h3>
      <UIFormCombobox
        v-model="basicValue"
        label="Framework"
        :items="frameworks"
        @value-change="(d) => console.log('valueChange', d)"
        @input-value-change="(d) => console.log('inputValueChange', d)"
      />
      <p class="txt-caption text-neutral-text-subtle">
        Selected: {{ basicValue.join(', ') || '—' }}
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Multiple with chips</h3>
      <UIFormCombobox
        v-model="multipleValue"
        label="Skills"
        :items="frameworks"
        multiple
        placeholder="Search skills…"
      />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Grouping</h3>
      <UIFormCombobox v-model="basicValue" label="Tech" :items="groupedItems" />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Intents</h3>
      <div class="flex flex-col gap-3">
        <UIFormCombobox
          v-for="intent in ['neutral', 'primary', 'secondary', 'accent'] as const"
          :key="intent"
          :intent
          :items="frameworks"
          :label="intent"
        />
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Sizes</h3>
      <div class="flex flex-col gap-3">
        <UIFormCombobox
          v-for="size in ['sm', 'md', 'lg'] as const"
          :key="size"
          :size
          :items="frameworks"
          :label="size"
        />
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Controlled state</h3>
      <UIFormCombobox
        v-model="basicValue"
        v-model:open="controlledOpen"
        v-model:input-value="controlledInput"
        label="Controlled"
        :items="frameworks"
      />
      <div class="flex gap-2">
        <UIButton size="sm" @click="controlledOpen = !controlledOpen">Toggle open</UIButton>
        <UIButton size="sm" @click="controlledInput = 'vue'">Set input to vue</UIButton>
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">RootProvider mode</h3>
      <UIButton size="sm" @click="providerApi.setValue(['react'])">
        Select React externally
      </UIButton>
      <UIFormComboboxRoot :value="providerApi" intent="primary">
        <UIFormControlShell label="Provider mode" intent="primary" size="md">
          <UIFormComboboxControl class="min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none">
            <UIFormComboboxInput placeholder="Provider combobox…" />
          </UIFormComboboxControl>
          <template #inner-trailing>
            <UIFormComboboxTrigger />
          </template>
        </UIFormControlShell>
        <Teleport to="body">
          <UIFormComboboxPositioner>
            <UIFormComboboxContent intent="primary" size="md">
              <UIFormComboboxListContent
                :collection="providerCollection.collection.value"
                intent="primary"
                size="md"
                :loading="false"
                loading-text="Loading…"
                empty-text="No results"
                :is-grouped="false"
              />
            </UIFormComboboxContent>
          </UIFormComboboxPositioner>
        </Teleport>
      </UIFormComboboxRoot>
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Disabled</h3>
      <UIFormCombobox label="Disabled" :items="frameworks" disabled :model-value="['react']" />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Async loading</h3>
      <UIFormCombobox
        v-model="asyncValue"
        label="Async"
        :items="asyncItems"
        :loading="asyncLoading"
        @update:open="(isOpen) => isOpen && loadAsyncItems()"
      />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Creatable</h3>
      <UIFormCombobox
        label="Creatable"
        :items="frameworks"
        allow-custom-value
        input-behavior="autohighlight"
      />
    </section>
  </div>
</template>
