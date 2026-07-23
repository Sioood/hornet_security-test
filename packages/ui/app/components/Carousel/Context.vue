<script setup lang="ts">
import { Carousel as ArkCarousel } from '@ark-ui/vue/carousel'

/**
 * Exposes Ark `Carousel.Context` slot props for inline state access.
 *
 * Available slot props include:
 * - `page` — current page index
 * - `pageSnapPoints` — snap points for page-based indicators
 * - `isPlaying` — autoplay active state
 * - `isDragging` — drag active state
 * - `canScrollNext` / `canScrollPrev` — navigation availability
 * - `scrollToIndex` / `scrollTo` / `scrollNext` / `scrollPrev` — navigation methods
 * - `getProgress` / `getProgressText` — progress helpers
 * - `play` / `pause` — autoplay controls
 * - `isInView` / `refresh` — viewport utilities
 */
defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkCarousel.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkCarousel.Context>
</template>
