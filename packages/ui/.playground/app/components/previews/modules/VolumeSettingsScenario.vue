<script setup lang="ts">
const volume = ref([60])
const muted = ref(false)

watch(muted, (isMuted) => {
  if (isMuted) volume.value = [0]
})

watch(volume, (value) => {
  const level = value[0] ?? 0
  if (level > 0) muted.value = false
  if (level === 0) muted.value = true
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <UIFormSlider v-model="volume" :min="0" :max="100" label="Volume" intent="primary" />
    <UIDivider />
    <UISwitch v-model:checked="muted" label="Muet" />
  </div>
</template>
