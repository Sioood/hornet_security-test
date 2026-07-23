<script setup lang="ts">
const activeTab = ref('overview')
const pendingTasks = ref(7)

const tabOptions = [
  { icon: 'tabler:layout-dashboard', label: 'Vue d’ensemble', value: 'overview' },
  { icon: 'tabler:activity', label: 'Activité', value: 'activity' },
  { icon: 'tabler:settings', label: 'Paramètres', value: 'settings' },
]

const activitySummary = computed(() => {
  if (activeTab.value === 'overview') return `${pendingTasks.value} tâches en attente`
  if (activeTab.value === 'activity') return '12 événements cette semaine'
  return '3 préférences modifiables'
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <UITabs v-model="activeTab" :options="tabOptions" intent="primary" size="sm">
      <template #content-overview>
        <p class="txt-caption text-neutral-text-subtle">
          Synthèse des indicateurs clés et actions prioritaires.
        </p>
      </template>
      <template #content-activity>
        <p class="txt-caption text-neutral-text-subtle">
          Historique des connexions, exports et notifications récentes.
        </p>
      </template>
      <template #content-settings>
        <p class="txt-caption text-neutral-text-subtle">
          Langue, fuseau horaire et préférences d’affichage.
        </p>
      </template>
    </UITabs>

    <div class="flex items-center gap-2">
      <UIChip :label="activitySummary" size="sm" intent="neutral" :on-icon-action="false" />
      <UIButton
        v-if="activeTab === 'overview'"
        size="sm"
        variant="ghost"
        intent="neutral"
        text="-1"
        @click="pendingTasks = Math.max(0, pendingTasks - 1)"
      />
    </div>
  </div>
</template>
