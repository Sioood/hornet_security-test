<script setup lang="ts">
import { TagsInput as ArkTagsInput } from '@ark-ui/vue/tags-input'

defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkTagsInput.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkTagsInput.Context>
</template>
