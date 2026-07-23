<script setup lang="ts">
const confirmOpen = ref(false)
const deleted = ref(false)

function openConfirm() {
  confirmOpen.value = true
}

function confirmDelete() {
  deleted.value = true
  confirmOpen.value = false
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <UIButton intent="error" variant="subtle" text="Supprimer le projet" @click="openConfirm" />
    <UIDialog
      v-model:open="confirmOpen"
      hide-trigger
      title="Supprimer le projet ?"
      description="Cette action est irréversible. Toutes les données seront perdues."
      size="sm"
    >
      <template #footer>
        <UIButton variant="subtle" intent="neutral" text="Annuler" @click="confirmOpen = false" />
        <UIButton intent="primary" text="Supprimer" @click="confirmDelete" />
      </template>
    </UIDialog>
    <UIAlert
      v-if="deleted"
      type="warning"
      title="Projet supprimé"
      description="Le projet a été retiré de votre espace."
    />
  </div>
</template>
