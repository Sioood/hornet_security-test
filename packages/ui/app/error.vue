<script setup lang="ts">
import type { NuxtError } from '#app'

const { t } = useI18n()

const props = defineProps<{ error: NuxtError }>()

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
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
    <div class="flex flex-col items-center justify-center">
      <span class="txt-title text-accent-text-subtle">{{ statusCode }}</span>
      <h1 class="txt-h2 mt-4 text-neutral-text">{{ title }}</h1>
      <p class="txt-caption mt-2 max-w-md text-neutral-text-subtle">{{ description }}</p>
    </div>
    <UIButton class="mt-8" @click="handleClearError">
      {{ t('errorPage.backHome') }}
    </UIButton>
  </div>
</template>
