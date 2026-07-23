<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  rowId: string
}>()

const { table } = useTableContext()

const row = computed(() => table.value.getRow(props.rowId, true))
const expanded = computed(() => row.value?.getIsExpanded() ?? false)
const canExpand = computed(() => row.value?.getCanExpand() ?? false)

function toggleExpanded() {
  row.value?.toggleExpanded()
}
</script>

<template>
  <div class="inline-flex" @click.stop>
    <UIButton
      intent="neutral"
      size="sm"
      variant="ghost"
      :class="!canExpand ? 'invisible' : ''"
      :leading-icon="expanded ? 'tabler:minus' : 'tabler:plus'"
      aria-label="Toggle row expansion"
      @click="toggleExpanded"
    />
  </div>
</template>
