<script setup lang="ts">
const toaster = useToast()
const { $pwa } = useNuxtApp()
const { t } = useI18n()

const hasShownOfflineReadyToast = ref(false)
const hasShownUpdateToast = ref(false)

watch(
  () => $pwa?.offlineReady,
  (offlineReady) => {
    if (!offlineReady || hasShownOfflineReadyToast.value) {
      return
    }

    toaster.value?.success({
      closable: true,
      description: t('pwa:offlineReady.description'),
      title: t('pwa:offlineReady.title'),
    })
    hasShownOfflineReadyToast.value = true
  },
)

watch(
  () => $pwa?.needRefresh,
  (needRefresh) => {
    if (!needRefresh) {
      hasShownUpdateToast.value = false
      return
    }

    if (hasShownUpdateToast.value) {
      return
    }

    toaster.value?.create({
      action: {
        label: t('pwa:updateAvailable.reloadLabel'),
        onClick: () => {
          void $pwa?.updateServiceWorker()
        },
      },
      closable: true,
      description: t('pwa:updateAvailable.description'),
      title: t('pwa:updateAvailable.title'),
      type: 'info',
    })

    hasShownUpdateToast.value = true
  },
)
</script>

<template>
  <span class="hidden" aria-hidden="true" />
</template>
