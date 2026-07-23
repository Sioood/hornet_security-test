<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()

const statusCode = computed(() => props.error.status || 500)
const title = computed(() => {
  if (statusCode.value === 404) return t('errorPage.title.notFound')
  if (statusCode.value === 403) return t('errorPage.title.forbidden')
  return t('errorPage.title.default')
})
const description = computed(
  () => props.error.statusText || props.error.message || t('errorPage.description'),
)

const handleClearError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <p>{{ statusCode }}</p>
    <h1 class="mt-4">{{ title }}</h1>
    <p class="mt-2 max-w-md">{{ description }}</p>
    <button
      class="mt-8 inline-flex cursor-pointer items-center gap-2 px-4 py-2"
      @click="handleClearError"
    >
      {{ t('errorPage.backHome') }}
    </button>
  </div>
</template>
