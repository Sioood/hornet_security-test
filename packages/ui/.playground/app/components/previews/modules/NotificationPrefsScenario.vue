<script setup lang="ts">
const emailNotifs = ref(true)
const pushNotifs = ref(true)
const marketingNotifs = ref(false)

const allDisabled = computed(
  () => !emailNotifs.value && !pushNotifs.value && !marketingNotifs.value,
)
</script>

<template>
  <div class="flex flex-col gap-3">
    <UISwitch v-model:checked="emailNotifs" label="Notifications e-mail" />
    <UISwitch v-model:checked="pushNotifs" label="Notifications push" />
    <UISwitch v-model:checked="marketingNotifs" label="Offres marketing" />
    <UIAlert
      v-if="allDisabled"
      type="info"
      title="Aucune alerte active"
      description="Vous ne recevrez plus de notifications."
    />
  </div>
</template>
