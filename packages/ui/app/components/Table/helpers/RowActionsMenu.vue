<script setup lang="ts">
import type { MenuListEntry } from '@/components/Menu/index.vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  items: MenuListEntry[]
}>()
</script>

<template>
  <div class="inline-flex justify-end" @click.stop>
    <UIMenu :items intent="neutral" :show-indicator="false">
      <template #triggers="{ trigger: Trigger }">
        <component :is="Trigger" as-child>
          <UIButton
            intent="neutral"
            variant="ghost"
            size="sm"
            leading-icon="tabler:dots-vertical"
            aria-label="Row actions"
          />
        </component>
      </template>
    </UIMenu>
  </div>
</template>
