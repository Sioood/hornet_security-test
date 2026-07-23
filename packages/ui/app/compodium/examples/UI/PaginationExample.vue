<script setup lang="ts">
import { usePagination, type PaginationPageChangeDetails } from '@ark-ui/vue/pagination'

import UIPaginationRoot from '~ui/app/components/Pagination/Root.vue'

const currentPage = ref<number>(1)
const slicingPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItems = 150

const externalPagination = usePagination({ count: totalItems, pageSize: 10 })

const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const

// Mock data for data slicing example
const allItems = Array.from({ length: totalItems }, (_, i) => ({
  id: i + 1,
  label: `Item ${i + 1}`,
}))

const slicedItems = computed(() => {
  const start = (slicingPage.value - 1) * pageSize.value
  return allItems.slice(start, start + pageSize.value)
})
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Default assembled usage -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Default Assembled</h2>
        <p class="text-sm text-neutral-text-subtle">
          Pass <code>count</code> and <code>page-size</code> — everything is rendered automatically.
        </p>
      </div>
      <UIPagination
        :count="totalItems"
        :page-size="10"
        @page-change="(d: PaginationPageChangeDetails) => console.log('pageChange', d)"
      />
    </section>

    <!-- Assembled with showFirstLast -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Assembled with First / Last</h2>
      <p class="text-sm text-neutral-text-subtle">
        Set <code>:show-first-last="true"</code> to include jump-to-ends buttons.
      </p>
      <UIPagination :count="200" :page-size="10" intent="accent" show-first-last />
    </section>

    <!-- Controlled via v-model:page -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled (v-model:page)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Fully controlled via <code>v-model:page</code>. External buttons jump to arbitrary pages.
      </p>
      <div class="mb-2 flex gap-2">
        <UIButton size="sm" variant="subtle" @click="currentPage = 1">Page 1</UIButton>
        <UIButton size="sm" variant="subtle" @click="currentPage = 5">Page 5</UIButton>
        <UIButton size="sm" variant="subtle" @click="currentPage = 10">Page 10</UIButton>
        <UIButton size="sm" variant="subtle" @click="currentPage = 15">Page 15</UIButton>
      </div>
      <p class="font-mono text-xs text-neutral-text-subtle">Current page: {{ currentPage }}</p>
      <UIPagination
        v-model:page="currentPage"
        :count="totalItems"
        :page-size="10"
        intent="secondary"
      />
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div class="flex flex-col gap-6">
        <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ size }}</p>
          <UIPagination :count="40" :page-size="6" :size />
        </div>
      </div>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="intent in intents" :key="intent" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ intent }}</p>
          <UIPagination :count="60" :page-size="8" :intent />
        </div>
      </div>
    </section>

    <!-- Many pages -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Many Pages (siblingCount)</h2>
      <p class="text-sm text-neutral-text-subtle">
        500 items × 10/page = 50 pages. <code>:sibling-count="1"</code> limits visible pages.
      </p>
      <UIPagination
        :count="500"
        :page-size="10"
        :sibling-count="1"
        intent="secondary"
        show-first-last
      />
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode (external API)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>usePagination()</code> — allows calling
        <code>setPage()</code> imperatively.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalPagination.setPage(1)">
          Page 1
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalPagination.setPage(5)">
          Page 5
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalPagination.setPage(10)">
          Page 10
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalPagination.setPage(15)">
          Page 15
        </UIButton>
      </div>
      <UIPagination :value="externalPagination" intent="accent" />
    </section>

    <!-- Manual composition with context for data slicing -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Manual Composition — Data Slicing & Page Range</h2>
      <p class="text-sm text-neutral-text-subtle">
        For advanced use cases, compose manually with <code>UIPaginationRoot</code> +
        <code>UIPaginationContext</code> to access page range, slice data, or inject custom UI.
      </p>
      <UIPaginationRoot
        v-model:page="slicingPage"
        :count="totalItems"
        :page-size="pageSize"
        intent="primary"
      >
        <UIPaginationContext v-slot="ctx">
          <div class="flex flex-col gap-4">
            <div
              class="mb-3 flex flex-wrap items-center gap-4 font-mono text-xs text-neutral-text-subtle"
            >
              <span>Page {{ ctx.page }} / {{ ctx.totalPages }}</span>
              <span
                >Items {{ ctx.pageRange.start + 1 }}–{{
                  Math.min(ctx.pageRange.end + 1, ctx.count)
                }}
                of {{ ctx.count }}</span
              >
              <span>Page size: {{ ctx.pageSize }}</span>
            </div>
            <ul class="grid grid-cols-5 gap-1">
              <li
                v-for="item in slicedItems"
                :key="item.id"
                class="rounded border border-neutral-border-subtle px-2 py-1 text-xs"
              >
                {{ item.label }}
              </li>
            </ul>
            <div class="mb-3 flex gap-1">
              <UIPaginationPrevTrigger />
              <template v-for="(p, index) in ctx.pages" :key="index">
                <UIPaginationPageTrigger v-if="p.type === 'page'" :value="p.value" />
                <UIPaginationEllipsis v-else :index />
              </template>
              <UIPaginationNextTrigger />
            </div>
          </div>
        </UIPaginationContext>
      </UIPaginationRoot>
    </section>

    <!-- asChild with manual composition -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Manual Composition — asChild Triggers</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use <code>as-child</code> on triggers to override with a custom
        <code>UIButton</code> variant.
      </p>
      <UIPaginationRoot :count="50" :page-size="8" intent="neutral">
        <UIPaginationPrevTrigger as-child>
          <UIButton variant="ghost" size="md" intent="secondary">
            <Icon name="tabler:chevron-left" class="size-4" />
          </UIButton>
        </UIPaginationPrevTrigger>
        <UIPaginationContext v-slot="{ pages }">
          <template v-for="(p, index) in pages" :key="index">
            <UIPaginationPageTrigger v-if="p.type === 'page'" :value="p.value" as-child>
              <UIButton variant="ghost" size="md" intent="primary">
                {{ p.value }}
              </UIButton>
            </UIPaginationPageTrigger>
            <UIPaginationEllipsis v-else :index />
          </template>
        </UIPaginationContext>
        <UIPaginationNextTrigger as-child>
          <UIButton variant="ghost" size="md" intent="secondary">
            <Icon name="tabler:chevron-right" class="size-4" />
          </UIButton>
        </UIPaginationNextTrigger>
      </UIPaginationRoot>
    </section>

    <!-- Custom trigger content -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Manual Composition — Custom Trigger Content</h2>
      <p class="text-sm text-neutral-text-subtle">
        Override trigger content via slots (text labels, custom icons).
      </p>
      <UIPaginationRoot :count="80" :page-size="10" intent="primary">
        <UIPaginationPrevTrigger>
          <Icon name="tabler:arrow-left" class="size-4 shrink-0" />
          <span class="hidden sm:inline">Prev</span>
        </UIPaginationPrevTrigger>
        <UIPaginationContext v-slot="{ pages }">
          <template v-for="(p, index) in pages" :key="index">
            <UIPaginationPageTrigger v-if="p.type === 'page'" :value="p.value" />
            <UIPaginationEllipsis v-else :index />
          </template>
        </UIPaginationContext>
        <UIPaginationNextTrigger>
          <span class="hidden sm:inline">Next</span>
          <Icon name="tabler:arrow-right" class="size-4 shrink-0" />
        </UIPaginationNextTrigger>
      </UIPaginationRoot>
    </section>
  </div>
</template>
