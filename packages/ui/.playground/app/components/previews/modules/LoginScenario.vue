<script setup lang="ts">
const email = ref('marie.dupont@example.com')
const password = ref('')
const remember = ref(true)
const submitted = ref(false)

const canSubmit = computed(() => email.value.includes('@') && password.value.length >= 8)

function submit() {
  if (!canSubmit.value) return
  submitted.value = true
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <UIFormInput v-model="email" label="Adresse e-mail" type="email" />
    <UIFormInput v-model="password" label="Mot de passe" type="password" />
    <UIFormCheckbox v-model="remember" label="Se souvenir de moi" />
    <UIButton
      intent="primary"
      text="Se connecter"
      class="w-full"
      :disabled="!canSubmit"
      @click="submit"
    />
    <UIAlert
      v-if="submitted"
      type="success"
      title="Connecté"
      :description="`Session ouverte${remember ? ' (mémorisée)' : ''}.`"
    />
  </div>
</template>
