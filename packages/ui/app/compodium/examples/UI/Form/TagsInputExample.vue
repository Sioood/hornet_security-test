<script setup lang="ts">
// oxlint-disable no-console
import { useListCollection } from '@ark-ui/vue/combobox'
import { useFilter } from '@ark-ui/vue/locale'
import { useTagsInput } from '@ark-ui/vue/tags-input'

import type { TagsInputComboboxItem } from '~/components/Form/TagsInput/index.vue'

const basicValue = ref<string[]>(['react'])
const comboboxValue = ref<string[]>([])
const controlledInput = ref('')

const frameworks: TagsInputComboboxItem[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
]

const providerApi = useTagsInput({
  defaultValue: ['react', 'vue'],
  max: 5,
})

const filters = useFilter({ sensitivity: 'base' })

const providerCollection = useListCollection({
  filter: filters.value.contains,
  initialItems: frameworks,
})

const providerCombobox = useFormTagsInputCombobox({
  collection: providerCollection.collection,
  combobox: {
    onInputValueChange(details) {
      providerCollection.filter(details.inputValue)
    },
  },
  tagsInput: { max: 5 },
})
</script>

<template>
  <div class="flex flex-col gap-8 p-4">
    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Basic</h3>
      <UIFormTagsInput
        v-model="basicValue"
        label="Tags"
        @value-change="(d) => console.log('valueChange', d)"
      />
      <p class="txt-caption text-neutral-text-subtle">{{ basicValue.join(', ') || '—' }}</p>
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">With combobox (items prop)</h3>
      <UIFormTagsInput
        v-model="comboboxValue"
        label="Frameworks"
        :items="frameworks"
        placeholder="Add framework…"
      />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Max tags & validation</h3>
      <UIFormTagsInput
        label="Max 3 tags"
        :max="3"
        :validate="({ value }) => !value.includes('duplicate')"
      />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Intents & sizes</h3>
      <UIFormTagsInput intent="primary" size="sm" label="Small" :model-value="['sm']" />
      <UIFormTagsInput intent="secondary" size="md" label="Medium" :model-value="['md']" />
      <UIFormTagsInput intent="accent" size="lg" label="Large" :model-value="['lg']" />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Controlled input value</h3>
      <UIFormTagsInput
        v-model:input-value="controlledInput"
        label="Controlled input"
        :items="frameworks"
      />
      <UIButton size="sm" @click="controlledInput = 'vue'">Prefill input</UIButton>
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">RootProvider mode</h3>
      <UIButton size="sm" @click="providerApi.addValue('solid')">Add Solid externally</UIButton>
      <UIFormTagsInputRoot :value="providerApi" intent="primary" size="md">
        <UIFormControlShell label="Provider tags" intent="primary" size="md">
          <UIFormTagsInputControl class="min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none">
            <UIFormTagsInputItems intent="primary" size="md" />
            <UIFormTagsInputFieldInput placeholder="Provider mode…" />
          </UIFormTagsInputControl>
        </UIFormControlShell>
        <UIFormTagsInputHiddenInput />
      </UIFormTagsInputRoot>
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Compound combobox (useFormTagsInputCombobox)</h3>
      <UIFormComboboxRoot :value="providerCombobox.combobox" intent="primary">
        <UIFormTagsInputRoot :value="providerCombobox.tagsInput" intent="primary" size="md">
          <UIFormControlShell label="Compound" intent="primary" size="md">
            <UIFormTagsInputControl class="min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none">
              <UIFormTagsInputItems intent="primary" size="md" />
              <UIFormTagsInputComboboxInput placeholder="Compound mode…" />
            </UIFormTagsInputControl>
          </UIFormControlShell>
          <UIFormTagsInputHiddenInput />
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
        </UIFormTagsInputRoot>
      </UIFormComboboxRoot>
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Disabled & read-only</h3>
      <UIFormTagsInput label="Disabled" disabled :model-value="['react', 'vue']" />
      <UIFormTagsInput label="Read-only" read-only :model-value="['react']" />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Paste & delimiter</h3>
      <UIFormTagsInput label="Comma delimiter" delimiter="," add-on-paste blur-behavior="add" />
    </section>
  </div>
</template>
