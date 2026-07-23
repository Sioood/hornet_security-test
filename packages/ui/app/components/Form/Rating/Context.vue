<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from '@ark-ui/vue/rating-group'

/**
 * Exposes Ark `RatingGroup.Context` slot props for inline state access.
 *
 * Available slot props include:
 * - `value` — current rating value
 * - `hoveredValue` — value under the cursor
 * - `hovering` — whether the group is hovered
 * - `count` — total number of items
 * - `items` — array of item indexes (1..count)
 * - `setValue` / `clearValue` — imperative helpers
 * - `getItemState` — per-item state lookup
 */
defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkRatingGroup.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkRatingGroup.Context>
</template>
