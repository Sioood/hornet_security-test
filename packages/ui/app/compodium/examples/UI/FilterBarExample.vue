<script setup lang="ts">
// oxlint-disable no-console
import type { FilterSchema, FilterValues } from '~/utils/Components/Filter/schema'

interface Project {
  id: number
  name: string
  description: string
  status: 'active' | 'archived'
  premium: boolean
  category: string
}

const allProjects: Project[] = Array.from({ length: 24 }, (_, index) => ({
  category: ['web', 'mobile', 'design'][index % 3] ?? 'web',
  description: `Description for project ${index + 1}`,
  id: index + 1,
  name: `Projet ${index + 1}`,
  premium: index % 5 === 0,
  status: index % 4 === 0 ? 'archived' : 'active',
}))

const filterValues = ref<FilterValues>({
  category: [],
  premium: false,
  search: '',
  status: [],
})

const filterBarRef = ref<{
  filter: (items: readonly Project[]) => Project[]
  flushSearch: () => void
  reset: () => void
} | null>(null)

const schema = {
  category: {
    defaultValue: [] as string[],
    getValue: (item: Project) => item.category,
    props: {
      options: [
        { title: 'Web', value: 'web' },
        { title: 'Mobile', value: 'mobile' },
        { title: 'Design', value: 'design' },
      ],
    },
    type: 'toggle-group',
  },
  premium: {
    defaultValue: false,
    getValue: (item: Project) => item.premium,
    label: 'Premium uniquement',
    type: 'toggle',
    variant: 'switch',
  },
  search: {
    defaultValue: '',
    fuse: {
      fuseOptions: {
        keys: ['name', 'description'],
        threshold: 0.35,
        useTokenSearch: true,
      },
      matchAllWhenSearchEmpty: true,
    },
    label: 'Rechercher',
    placeholder: 'Nom ou description…',
    type: 'search',
  },
  status: {
    defaultValue: [] as string[],
    getValue: (item: Project) => item.status,
    label: 'Statut',
    props: {
      items: [
        { label: 'Actif', value: 'active' },
        { label: 'Archivé', value: 'archived' },
      ],
      placeholder: 'Tous les statuts',
    },
    type: 'select',
  },
} satisfies FilterSchema<Project>

const customSearchValues = ref<FilterValues>({ search: '' })

const customSearchSchema: FilterSchema<Project> = {
  search: {
    defaultValue: '',
    label: 'Custom search',
    search: (items, query) =>
      items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    type: 'search',
  },
}

const filteredProjects = computed(() => {
  void filterValues.value
  return filterBarRef.value?.filter(allProjects) ?? allProjects
})

function onFilterChange(values: FilterValues) {
  console.log('[filter-bar-example] change', values)
}
</script>

<template>
  <div class="flex max-w-4xl flex-col gap-10 p-4">
    <section class="flex flex-col gap-3">
      <h3 class="text-lg font-bold">Basic</h3>
      <UIFilterBar
        ref="filterBarRef"
        v-model="filterValues"
        :schema="schema"
        :layout="['search', ['status', 'premium', 'category']]"
        show-search-pending
        @change="onFilterChange"
      />
      <p class="txt-caption text-neutral-text-subtle">
        {{ filteredProjects.length }} résultat{{ filteredProjects.length > 1 ? 's' : '' }}
      </p>
      <ul class="flex max-h-48 flex-col gap-1 overflow-y-auto">
        <li
          v-for="project in filteredProjects"
          :key="project.id"
          class="txt-caption border-b border-neutral-border-subtle py-1 text-neutral-text"
        >
          {{ project.name }}
        </li>
      </ul>
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="text-lg font-bold">Compact (forcé)</h3>
      <UIFilterBar v-model="filterValues" :schema="schema" force-compact />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="text-lg font-bold">Search dans le menu</h3>
      <UIFilterBar v-model="filterValues" :schema="schema" force-compact search-in-menu />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="text-lg font-bold">Custom search function</h3>
      <UIFilterBar
        v-model="customSearchValues"
        :schema="customSearchSchema"
        @change="(v) => console.log('custom search', v)"
      />
    </section>

    <section class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Actions</h3>
      <div class="flex flex-wrap gap-2">
        <UIButton size="sm" variant="subtle" @click="filterBarRef?.flushSearch()">
          Flush search
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="filterBarRef?.reset()">Reset filters</UIButton>
      </div>
    </section>
  </div>
</template>
