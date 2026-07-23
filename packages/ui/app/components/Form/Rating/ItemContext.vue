<script setup lang="ts">
import { RatingGroup as ArkRatingGroup } from '@ark-ui/vue/rating-group'

defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkRatingGroup.ItemContext v-slot="item">
    <slot v-bind="item" />
  </ArkRatingGroup.ItemContext>
</template>
