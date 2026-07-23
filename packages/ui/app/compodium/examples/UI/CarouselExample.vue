<script setup lang="ts">
// oxlint-disable no-console
import {
  useCarousel,
  type CarouselDragStatusDetails,
  type CarouselPageChangeDetails,
} from '@ark-ui/vue/carousel'

const images = [
  { alt: 'Nature landscape', src: 'https://picsum.photos/seed/carousel-1/800/480' },
  { alt: 'City skyline', src: 'https://picsum.photos/seed/carousel-2/800/480' },
  { alt: 'Mountain view', src: 'https://picsum.photos/seed/carousel-3/800/480' },
  { alt: 'Ocean sunset', src: 'https://picsum.photos/seed/carousel-4/800/480' },
  { alt: 'Forest path', src: 'https://picsum.photos/seed/carousel-5/800/480' },
]

const thumbnailImages = images.slice(0, 4)

const currentPage = ref(0)
const dynamicSlides = ref(['Slide A', 'Slide B', 'Slide C'])

const externalCarousel = useCarousel({
  allowMouseDrag: true,
  slideCount: images.length,
})

const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const

function addSlide() {
  dynamicSlides.value = [
    ...dynamicSlides.value,
    `Slide ${String.fromCharCode(65 + dynamicSlides.value.length)}`,
  ]
}

function removeSlide() {
  if (dynamicSlides.value.length <= 1) return
  dynamicSlides.value = dynamicSlides.value.slice(0, -1)
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Basic assembled -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Basic (assembled)</h2>
        <p class="text-sm text-neutral-text-subtle">
          Draggable by default. Prev/next overlay appears on hover over the slide area.
        </p>
      </div>
      <UICarousel
        :items="images"
        @page-change="(d: CarouselPageChangeDetails) => console.log('pageChange', d)"
        @drag-status-change="(d: CarouselDragStatusDetails) => console.log('dragStatusChange', d)"
      />
    </section>

    <!-- Thumbnail indicators -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Thumbnail indicators</h2>
      <p class="text-sm text-neutral-text-subtle">
        Set <code>indicator-variant="thumbnail"</code> — thumbnails render from item
        <code>src</code>.
      </p>
      <UICarousel :items="thumbnailImages" indicator-variant="thumbnail" intent="accent" />
    </section>

    <!-- Controlled -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled (v-model:page)</h2>
      <div class="flex flex-wrap gap-2">
        <UIButton
          v-for="index in images.length"
          :key="index"
          size="sm"
          variant="subtle"
          @click="currentPage = index - 1"
        >
          Page {{ index }}
        </UIButton>
      </div>
      <p class="font-mono text-xs text-neutral-text-subtle">Current page: {{ currentPage }}</p>
      <UICarousel v-model:page="currentPage" :items="images" intent="secondary" />
    </section>

    <!-- Autoplay -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Autoplay + loop</h2>
      <UICarousel
        :items="images.slice(0, 3)"
        :autoplay="{ delay: 3000 }"
        loop
        pause-on-hover
        show-progress
      />
    </section>

    <!-- Slides per page -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Slides per page + spacing</h2>
      <UICarousel
        :items="['One', 'Two', 'Three', 'Four', 'Five', 'Six']"
        :slides-per-page="2"
        spacing="16px"
        :padding="'10%'"
      />
    </section>

    <!-- Vertical -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Vertical</h2>
      <UICarousel
        :items="['Top', 'Middle', 'Bottom']"
        orientation="vertical"
        class="max-w-xs"
        :ui="{ root: 'h-64' }"
      />
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
        <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ size }}</p>
        <UICarousel :items="images.slice(0, 3)" :size />
      </div>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="intent in intents" :key="intent" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ intent }}</p>
          <UICarousel :items="images.slice(0, 3)" :intent />
        </div>
      </div>
    </section>

    <!-- RootProvider -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useCarousel()</code> — imperative navigation from outside.
      </p>
      <div class="flex flex-wrap gap-2">
        <UIButton size="sm" variant="subtle" @click="externalCarousel.scrollTo(0)">
          First
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalCarousel.scrollNext()">
          Next
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalCarousel.scrollPrev()">
          Prev
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalCarousel.scrollTo(images.length - 1)">
          Last
        </UIButton>
      </div>
      <p class="font-mono text-xs text-neutral-text-subtle">
        Page: {{ externalCarousel.page }} / {{ externalCarousel.pageSnapPoints.length }}
      </p>
      <UICarousel :value="externalCarousel" :items="images" />
    </section>

    <!-- Manual composition -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Manual composition — pause on hover</h2>
      <UICarouselRoot :slide-count="images.length" :autoplay="{ delay: 4000 }" loop>
        <UICarouselContext v-slot="carousel">
          <div
            class="flex flex-col gap-4"
            @mouseenter="carousel.pause()"
            @mouseleave="carousel.play()"
          >
            <UICarouselControl>
              <UICarouselPrevTrigger />
              <UICarouselItemGroup>
                <UICarouselItem v-for="(image, index) in images" :key="index" :index="index">
                  <NuxtImg
                    :src="image.src"
                    :alt="image.alt"
                    class="h-48 w-full object-cover"
                    width="800"
                    height="480"
                  />
                </UICarouselItem>
              </UICarouselItemGroup>
              <UICarouselNextTrigger />
            </UICarouselControl>
            <div class="flex items-center justify-between">
              <UICarouselProgressText />
              <div class="flex gap-2">
                <UICarouselAutoplayIndicator />
                <UICarouselAutoplayTrigger />
              </div>
            </div>
            <UICarouselIndicatorGroup>
              <UICarouselIndicator
                v-for="(_, index) in carousel.pageSnapPoints"
                :key="index"
                :index="index"
              />
            </UICarouselIndicatorGroup>
          </div>
        </UICarouselContext>
      </UICarouselRoot>
    </section>

    <!-- Dynamic slides -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Dynamic slides</h2>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="addSlide">Add slide</UIButton>
        <UIButton size="sm" variant="subtle" @click="removeSlide">Remove slide</UIButton>
      </div>
      <UICarousel :items="dynamicSlides" loop />
    </section>

    <!-- Variable size -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Variable slide sizes</h2>
      <UICarouselRoot :slide-count="4" auto-size spacing="12px">
        <UICarouselControl>
          <UICarouselPrevTrigger />
          <UICarouselItemGroup>
            <UICarouselItem :index="0" snap-align="start" :ui="{ root: 'w-48' }">
              <div
                class="flex h-32 items-center justify-center border border-neutral-border-subtle bg-neutral-fill-subtle disabled:pointer-events-none disabled:opacity-40"
              >
                Narrow
              </div>
            </UICarouselItem>
            <UICarouselItem :index="1" snap-align="center" :ui="{ root: 'w-72' }">
              <div
                class="flex h-32 items-center justify-center border border-primary-border-subtle bg-primary-fill-subtle disabled:pointer-events-none disabled:opacity-40"
              >
                Wide
              </div>
            </UICarouselItem>
            <UICarouselItem :index="2" snap-align="end" :ui="{ root: 'w-56' }">
              <div
                class="flex h-32 items-center justify-center border border-secondary-border-subtle bg-secondary-fill-subtle disabled:pointer-events-none disabled:opacity-40"
              >
                Medium
              </div>
            </UICarouselItem>
            <UICarouselItem :index="3" :ui="{ root: 'w-64' }">
              <div
                class="flex h-32 items-center justify-center border border-accent-border-subtle bg-accent-fill-subtle disabled:pointer-events-none disabled:opacity-40"
              >
                Default snap
              </div>
            </UICarouselItem>
          </UICarouselItemGroup>
          <UICarouselNextTrigger />
        </UICarouselControl>
        <UICarouselContext v-slot="api">
          <UICarouselIndicatorGroup>
            <UICarouselIndicator
              v-for="(_, index) in api.pageSnapPoints"
              :key="index"
              :index="index"
            />
          </UICarouselIndicatorGroup>
        </UICarouselContext>
      </UICarouselRoot>
    </section>
  </div>
</template>
