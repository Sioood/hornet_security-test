<script setup lang="ts">
const code = ref('')
const verified = ref(false)

const isComplete = computed(() => code.value.length === 4)

function verify() {
  if (!isComplete.value) return
  verified.value = true
}

watch(code, () => {
  verified.value = false
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <UIFormPinInput v-model="code" label="Code de vérification" :count="4" />
    <UIAlert
      v-if="!verified"
      type="info"
      title="Vérifiez votre boîte mail"
      description="Un code à 4 chiffres vient d’être envoyé."
    />
    <UIAlert
      v-else
      type="success"
      title="Compte vérifié"
      description="Vous pouvez accéder à votre espace."
    />
    <UIButton
      intent="primary"
      text="Valider"
      class="w-full"
      :disabled="!isComplete"
      @click="verify"
    />
  </div>
</template>
