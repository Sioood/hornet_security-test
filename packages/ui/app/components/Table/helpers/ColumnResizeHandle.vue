<script setup lang="ts">
import type { Column, ColumnSizingInfoState } from '@tanstack/vue-table'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  column: Column<unknown, unknown>
}>()

const { table } = useTableContext()
const isResizing = ref(false)

const onMove = (event: PointerEvent) => {
  if (!isResizing.value) return
  table.value.setColumnSizingInfo((prev: ColumnSizingInfoState) => ({
    ...prev,
    deltaOffset: event.movementX,
  }))
}

const onUp = () => {
  isResizing.value = false
  table.value.setColumnSizingInfo((prev: ColumnSizingInfoState) => ({
    ...prev,
    deltaOffset: 0,
    isResizingColumn: false,
  }))
}

useEventListener('pointermove', onMove)
useEventListener('pointerup', onUp)

function onPointerDown(event: PointerEvent) {
  isResizing.value = true
  props.column.getResizeHandler()(event)
}
</script>

<template>
  <div
    class="absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none bg-transparent select-none hover:bg-primary-fill/40"
    @pointerdown="onPointerDown"
  />
</template>
