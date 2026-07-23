<script setup lang="ts">
import { bookCoverViewTransitionName } from '../utils/book-view-transition'

import type { Book } from '../types/book'


definePageMeta({
  viewTransition: true,
})

const props = defineProps<{
  book: Book
  favorite?: boolean
}>()

const { locale } = useI18n()

const formattedPublished = computed(() => {
  const date = new Date(`${props.book.published}T00:00:00`)

  return new Intl.DateTimeFormat(locale.value, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
})
</script>

<template>
  <article class="h-full">
    <UILink
      :aria-label="book.title"
      intent="neutral"
      styled
      :to="`/books/${book.id}`"
      :ui="{
        root: 'group flex h-full flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-border focus-visible:ring-offset-2 focus-visible:ring-offset-primary-bg',
      }"
      variant="ghost"
    >
      <UICard
        class="h-full flex-1 transition-shadow duration-200 group-hover:shadow-md"
        intent="neutral"
        size="md"
        variant="subtle"
        :card-base-ui="{ root: 'h-full flex flex-1 flex-col', body: 'flex flex-1 flex-col' }"
        :ui="{ content: 'flex flex-1 flex-col gap-4' }"
      >
        <div
          class="relative aspect-3/4 overflow-hidden rounded-xs bg-neutral-surface"
          :style="{ viewTransitionName: bookCoverViewTransitionName(book.id) }"
        >
          <NuxtImg
            :alt="book.title"
            class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            densities="1x 2x"
            format="webp"
            height="640"
            loading="lazy"
            :src="book.image"
            width="480"
          />
          <UIBadge
            v-if="favorite"
            class="absolute top-2 right-2"
            intent="accent"
            :label="$t('books.favoriteBadge')"
            size="sm"
            variant="subtle"
          />
        </div>

        <div class="flex flex-1 flex-col gap-2 px-1">
          <UIBadge :label="book.genre" intent="neutral" size="sm" variant="subtle" />

          <h2 class="font-display txt-h4 line-clamp-2 text-neutral-text">
            {{ book.title }}
          </h2>

          <p class="txt-caption text-neutral-text-muted">
            {{ $t('books.byAuthor', { author: book.author }) }}
          </p>

          <p class="txt-caption line-clamp-2 text-neutral-text-subtle">
            {{ book.description }}
          </p>

          <p class="txt-small mt-auto text-neutral-text-muted">
            {{ formattedPublished }}
          </p>
        </div>
      </UICard>
    </UILink>
  </article>
</template>
