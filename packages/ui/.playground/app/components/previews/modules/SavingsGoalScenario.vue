<script setup lang="ts">
const saved = ref(7_500)
const target = ref(10_000)
const previousSaved = ref(saved.value)

const progress = computed(() => Math.min(100, Math.round((saved.value / target.value) * 100)))

const trendLabel = computed(() => {
  const delta = saved.value - previousSaved.value
  if (delta <= 0) return 'Stable'
  const percent = Math.round((delta / previousSaved.value) * 100)
  return `+${percent} %`
})

const trendIntent = computed(() => (saved.value > previousSaved.value ? 'success' : 'neutral'))

function addContribution() {
  previousSaved.value = saved.value
  saved.value = Math.min(target.value, saved.value + 500)
}
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <UIProgressCircular :model-value="progress" size="md" intent="primary" label="Objectif" />
    <p class="txt-h6 text-neutral-text tabular-nums">
      {{ saved.toLocaleString('fr-FR') }} € / {{ target.toLocaleString('fr-FR') }} €
    </p>
    <div class="flex items-center gap-2">
      <UIBadge :intent="trendIntent" :label="trendLabel" size="sm" />
      <UIButton
        size="sm"
        variant="subtle"
        intent="primary"
        text="+500 €"
        @click="addContribution"
      />
    </div>
  </div>
</template>
