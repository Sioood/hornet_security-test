<script setup lang="ts">
import { getBookSpineStyle } from '../utils/book-spine'

import type { Book } from '../types/book'

const SPINE_COUNT = 12

const props = defineProps<{
  books: readonly Book[]
  loading?: boolean
}>()

const styledSpines = computed(() =>
  props.books.slice(0, SPINE_COUNT).map((book) => ({
    book,
    style: getBookSpineStyle(book.id),
  })),
)

const skeletonSpines = computed(() =>
  Array.from({ length: SPINE_COUNT }, (_, index) => ({
    heightRem: 9 + (index % 4) * 1.25,
    widthRem: 1.5 + (index % 5) * 0.35,
  })),
)

function titleSizeClass(title: string): string {
  if (title.length > 34) {
    return 'txt-small'
  }

  if (title.length > 22) {
    return 'txt-caption'
  }

  return 'txt-label'
}
</script>

<template>
  <section
    :aria-busy="loading ? true : undefined"
    :aria-label="$t('books.spineShelfLabel')"
    class="relative rounded-xs border border-neutral-border-subtle bg-primary-bg-subtle px-4 pt-6 pb-6"
  >
    <div
      class="flex min-h-72 items-end justify-center gap-1 overflow-x-auto px-2 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="list"
    >
      <template v-if="loading">
        <div
          v-for="(item, index) in skeletonSpines"
          :key="index"
          class="shrink-0 animate-pulse rounded-t-xs bg-neutral-surface-subtle"
          role="listitem"
          :style="{ height: `${item.heightRem}rem`, width: `${item.widthRem}rem` }"
        />
      </template>

      <template v-else>
        <div
          v-for="{ book, style } in styledSpines"
          :key="book.id"
          class="relative shrink-0 origin-bottom transition-transform duration-200 ease-in-out will-change-transform focus-within:z-10 focus-within:scale-110 hover:z-10 hover:scale-110 motion-reduce:transition-none motion-reduce:focus-within:scale-100 motion-reduce:hover:scale-100"
          role="listitem"
        >
          <NuxtLink
            :aria-label="book.title"
            class="block rounded-t-xs no-underline hover:no-underline focus-visible:ring-2 focus-visible:ring-primary-border focus-visible:ring-offset-2 focus-visible:ring-offset-primary-bg focus-visible:outline-none"
            :to="`/books/${book.id}`"
          >
            <div
              class="relative overflow-hidden rounded-t-xs"
              :class="style.classes.background"
              :style="{
                height: `${style.heightRem}rem`,
                width: `${style.widthRem}rem`,
              }"
            >
              <span
                class="font-display absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-90 truncate whitespace-nowrap uppercase no-underline"
                :class="[style.classes.text, titleSizeClass(book.title)]"
                :style="{ maxWidth: `${style.titleMaxWidthPx}px` }"
              >
                {{ book.title }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </template>
    </div>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-4 bottom-3 h-2 rounded-xs bg-neutral-fill-subtle"
    />
  </section>
</template>
