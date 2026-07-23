<script setup lang="ts">
import type { CheckboxCheckedState } from '@ark-ui/vue/checkbox'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  checked: boolean | 'indeterminate'
  toggleSelected: (value: boolean | 'indeterminate') => void
}>()

const checkedModel = computed({
  get: (): CheckboxCheckedState =>
    props.checked === 'indeterminate' ? 'indeterminate' : props.checked,
  set: (value) => {
    props.toggleSelected(value)
  },
})
</script>

<template>
  <div class="inline-flex" @click.stop>
    <UIFormCheckbox v-model="checkedModel" control-only aria-label="Select row" />
  </div>
</template>
