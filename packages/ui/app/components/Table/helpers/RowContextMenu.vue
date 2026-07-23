<script setup lang="ts" generic="TData">
import { useMenu } from '@ark-ui/vue/menu'

import type { MenuListEntry } from '@/components/Menu/index.vue'
import type { Row } from '@tanstack/vue-table'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  getItems: (row: Row<TData>) => MenuListEntry[]
}>()

const open = ref(false)
const items = ref<MenuListEntry[]>([])
const contentKey = ref(0)

const menu = useMenu(
  computed(() => ({
    onOpenChange: (details) => {
      open.value = details.open
    },
    open: open.value,
    positioning: { strategy: 'fixed' },
  })),
)

async function handleContextmenu(event: Event, row: Row<TData>) {
  event.preventDefault()
  event.stopPropagation()

  if (!(event instanceof MouseEvent)) return

  const nextItems = props.getItems(row)
  if (nextItems.length === 0) return

  open.value = false
  items.value = nextItems
  contentKey.value += 1

  await nextTick()

  menu.machine.send({
    point: { x: event.clientX, y: event.clientY },
    type: 'CONTEXT_MENU',
  })
}
</script>

<template>
  <slot :on-contextmenu="handleContextmenu" />

  <ClientOnly>
    <UIMenu
      :value="menu"
      intent="neutral"
      size="md"
      :show-indicator="false"
      lazy-mount
      unmount-on-exit
      aria-label="Row context menu"
    >
      <template #context-trigger />
      <template #content>
        <UIMenuEntryRenderer :key="contentKey" :items intent="neutral" size="md" />
      </template>
    </UIMenu>
  </ClientOnly>
</template>
