<script setup lang="ts">
const viewMode = ref('list')
const page = ref(1)
const pageSize = 10
const showActiveOnly = ref(true)
const showPremiumOnly = ref(false)

const viewOptions = [
  { label: 'Liste', value: 'list' },
  { label: 'Grille', value: 'grid' },
]

const allItems = Array.from({ length: 120 }, (_, index) => ({
  active: index % 3 !== 0,
  id: index + 1,
  name: `Projet ${index + 1}`,
  premium: index % 5 === 0,
}))

const filteredItems = computed(() => {
  let items = allItems
  if (showActiveOnly.value) items = items.filter((item) => item.active)
  if (showPremiumOnly.value) items = items.filter((item) => item.premium)
  return items
})

const pagedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

const activeFilters = computed(() => {
  const filters: string[] = []
  if (showActiveOnly.value) filters.push('Actifs')
  if (showPremiumOnly.value) filters.push('Premium')
  return filters
})

watch([showActiveOnly, showPremiumOnly], () => {
  page.value = 1
})

watch(
  () => filteredItems.value.length,
  (count) => {
    const maxPage = Math.max(1, Math.ceil(count / pageSize))
    if (page.value > maxPage) page.value = maxPage
  },
)

function removeFilter(filter: string) {
  if (filter === 'Actifs') showActiveOnly.value = false
  if (filter === 'Premium') showPremiumOnly.value = false
}
</script>

<template>
  <div class="flex min-h-0 flex-col gap-3">
    <UISegmentGroup v-model="viewMode" :options="viewOptions" size="sm" />

    <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-1">
      <UIChip
        v-for="filter in activeFilters"
        :key="filter"
        :label="filter"
        size="sm"
        intent="neutral"
        :on-click="() => removeFilter(filter)"
      />
    </div>
    <p v-else class="txt-caption text-neutral-text-subtle">Aucun filtre actif</p>

    <ul v-if="viewMode === 'list'" class="flex min-h-0 flex-1 flex-col gap-1">
      <li
        v-for="item in pagedItems"
        :key="item.id"
        class="txt-caption flex items-center justify-between gap-2 border-b border-neutral-border-subtle py-1"
      >
        <span class="min-w-0 truncate text-neutral-text">{{ item.name }}</span>
        <UIBadge v-if="item.premium" intent="accent" label="Premium" size="sm" />
      </li>
    </ul>

    <div v-else class="grid auto-rows-auto grid-cols-[repeat(auto-fill,400px)] justify-start gap-1">
      <div
        v-for="item in pagedItems"
        :key="item.id"
        class="txt-caption truncate rounded border border-neutral-border-subtle bg-neutral-surface-subtle p-2 text-neutral-text"
      >
        {{ item.name }}
      </div>
    </div>

    <UIPagination
      v-model:page="page"
      :count="filteredItems.length"
      :page-size="pageSize"
      intent="primary"
      size="sm"
    />
  </div>
</template>
