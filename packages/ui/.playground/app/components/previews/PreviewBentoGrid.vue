<script setup lang="ts">
const ROW_HEIGHT_PX = 10
const GAP_PX = 12

const gridRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | undefined

function layoutMasonry() {
  const grid = gridRef.value
  if (!grid) return

  const items: HTMLElement[] = []
  for (const node of grid.children) {
    if (!(node instanceof HTMLElement)) continue
    items.push(node)
    node.style.gridRowEnd = 'span 1'
  }

  for (const node of items) {
    const { height } = node.getBoundingClientRect()
    const span = Math.max(1, Math.ceil((height + GAP_PX) / (ROW_HEIGHT_PX + GAP_PX)))
    node.style.gridRowEnd = `span ${span}`
  }
}

onMounted(async () => {
  await nextTick()
  layoutMasonry()

  resizeObserver = new ResizeObserver(() => {
    layoutMasonry()
  })

  const grid = gridRef.value
  if (!grid) return

  resizeObserver.observe(grid)
  for (const node of grid.children) {
    if (node instanceof HTMLElement) resizeObserver.observe(node)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    ref="gridRef"
    class="grid-auto-rows-[10px] grid grid-cols-[repeat(auto-fill,400px)] justify-center gap-3"
  >
    <slot />
  </div>
</template>
