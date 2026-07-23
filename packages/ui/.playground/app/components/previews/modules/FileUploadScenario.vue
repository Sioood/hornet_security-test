<script setup lang="ts">
const files = ref<File[]>([])
const uploadProgress = ref(0)
const uploadComplete = ref(false)

let uploadTimer: ReturnType<typeof setInterval> | undefined

watch(files, (nextFiles) => {
  if (uploadTimer) {
    clearInterval(uploadTimer)
    uploadTimer = undefined
  }

  uploadComplete.value = false
  uploadProgress.value = 0

  if (nextFiles.length === 0) return

  uploadTimer = setInterval(() => {
    if (uploadProgress.value >= 100) {
      if (uploadTimer) clearInterval(uploadTimer)
      uploadComplete.value = true
      return
    }
    uploadProgress.value = Math.min(100, uploadProgress.value + 12)
  }, 200)
})

onUnmounted(() => {
  if (uploadTimer) clearInterval(uploadTimer)
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <UIFileUpload
      v-model="files"
      label="Contrat signé"
      helper-text="PDF ou image, 10 Mo max."
      accept="application/pdf,image/*"
      dropzone
    />
    <UIProgress
      v-if="files.length > 0 && !uploadComplete"
      v-model="uploadProgress"
      label="Envoi en cours"
      intent="primary"
    />
    <UIAlert
      v-if="uploadComplete"
      type="success"
      title="Document reçu"
      :description="`${files[0]?.name ?? 'Fichier'} est disponible dans votre espace.`"
    />
  </div>
</template>
