<script setup lang="ts">
const shareUrl = ref('https://hornet_security-test.dev/invite/a8f3k2')
const copied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
  } catch {
    copied.value = false
  }
}

watch(shareUrl, () => {
  copied.value = false
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="mx-auto size-28">
      <UIQRCode v-model="shareUrl" intent="primary" />
    </div>
    <UIFormInput v-model="shareUrl" label="Lien d'invitation" read-only />
    <UIButton intent="primary" :text="copied ? 'Copié' : 'Copier le lien'" @click="copyLink" />
    <UIBadge v-if="copied" intent="success" label="Lien copié" size="sm" />
  </div>
</template>
