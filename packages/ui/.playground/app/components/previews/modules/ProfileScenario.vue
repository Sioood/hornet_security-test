<script setup lang="ts">
const savedName = ref('Marie Dupont')
const savedBio = ref('Designer produit chez HornetSecurityTest.')
const name = ref(savedName.value)
const bio = ref(savedBio.value)

const isDirty = computed(() => name.value !== savedName.value || bio.value !== savedBio.value)

const statusLabel = computed(() => (isDirty.value ? 'Modifié' : 'Enregistré'))
const statusIntent = computed(() => (isDirty.value ? 'warning' : 'success'))

function saveProfile() {
  savedName.value = name.value
  savedBio.value = bio.value
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-2">
      <span class="txt-caption text-neutral-text-subtle">Profil public</span>
      <UIBadge :intent="statusIntent" :label="statusLabel" size="sm" />
    </div>
    <UIFormInput v-model="name" label="Nom complet" />
    <UIFormTextarea v-model="bio" label="Bio" :rows="3" />
    <UIButton
      intent="primary"
      text="Enregistrer"
      class="w-full"
      :disabled="!isDirty"
      @click="saveProfile"
    />
  </div>
</template>
