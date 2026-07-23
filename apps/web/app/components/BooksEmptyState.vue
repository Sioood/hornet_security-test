<script setup lang="ts">
defineEmits<{
  reset: []
}>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 rounded-xs border border-dashed border-neutral-border-subtle bg-neutral-surface-subtle px-6 py-16 text-center"
  >
    <Icon class="size-10 text-neutral-text-subtle" name="tabler:books-off" />
    <div class="flex max-w-md flex-col gap-2">
      <h2 class="font-display txt-h3 text-neutral-text">{{ $t('books.emptyTitle') }}</h2>
      <p class="txt-base text-neutral-text-muted">{{ $t('books.emptyDescription') }}</p>
    </div>
    <UIButton intent="neutral" size="sm" variant="subtle" @click="$emit('reset')">
      {{ $t('books.emptyReset') }}
    </UIButton>
  </div>
</template>
