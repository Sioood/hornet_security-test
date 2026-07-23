<script setup lang="ts">
const menuOpen = ref(false)
const metadataOpen = ref(false)
const lastAction = ref<string | null>(null)

const menuItems = [
  {
    label: 'Nouveau',
    onSelect: () => {
      lastAction.value = 'Nouveau'
    },
    type: 'item' as const,
    value: 'new',
  },
  {
    label: 'Ouvrir…',
    onSelect: () => {
      lastAction.value = 'Ouvrir'
    },
    type: 'item' as const,
    value: 'open',
  },
  {
    label: 'Exporter',
    onSelect: () => {
      lastAction.value = 'Exporter'
    },
    type: 'item' as const,
    value: 'export',
  },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <UIMenu
        v-model:open="menuOpen"
        trigger-text="Document"
        :items="menuItems"
        intent="neutral"
        size="sm"
      />
      <UITooltip content="Actions sur le document">
        <template #trigger>
          <Icon name="tabler:info-circle" class="size-4 text-neutral-icon-subtle" />
        </template>
      </UITooltip>
    </div>
    <UICollapsible v-model="metadataOpen" heading="Métadonnées">
      <dl class="txt-caption flex flex-col gap-1 text-neutral-text-subtle">
        <div class="flex justify-between gap-2">
          <dt>Auteur</dt>
          <dd class="text-neutral-text">Marie Dupont</dd>
        </div>
        <div class="flex justify-between gap-2">
          <dt>Modifié</dt>
          <dd class="text-neutral-text">23 mai 2026</dd>
        </div>
      </dl>
    </UICollapsible>
    <p v-if="lastAction" class="txt-caption text-neutral-text-subtle">
      Dernière action : {{ lastAction }}
    </p>
  </div>
</template>
