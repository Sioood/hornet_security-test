<script setup lang="ts">
import type { ClassValue } from 'vue'

const GLYPH_ICONS = {
  check: 'tabler:check',
  checks: 'tabler:checks',
  'chevron-down': 'tabler:chevron-down',
  loader: 'tabler:loader',
  x: 'tabler:x',
} as const

type GlyphName = keyof typeof GLYPH_ICONS

defineProps<{
  glyphClass?: ClassValue
  name: GlyphName
}>()
</script>

<template>
  <Icon :name="GLYPH_ICONS[name]" :class="glyphClass" />
</template>
