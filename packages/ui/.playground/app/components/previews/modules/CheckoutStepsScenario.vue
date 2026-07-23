<script setup lang="ts">
const step = ref(0)

const progressValue = computed(() => Math.round(((step.value + 1) / 3) * 100))
</script>

<template>
  <div class="flex flex-col gap-3">
    <UISteps
      v-model:step="step"
      :items="['Panier', 'Livraison', 'Paiement']"
      intent="primary"
      show-progress
      size="sm"
    >
      <UIStepsContent :index="0">
        <p class="txt-caption text-neutral-text-subtle">2 articles — 148,00 €</p>
      </UIStepsContent>
      <UIStepsContent :index="1">
        <p class="txt-caption text-neutral-text-subtle">Adresse : 12 rue de la Paix, Paris</p>
      </UIStepsContent>
      <UIStepsContent :index="2">
        <p class="txt-caption text-neutral-text-subtle">Carte se terminant par 4242</p>
      </UIStepsContent>
      <UIStepsCompletedContent>
        <p class="txt-label text-success-text">Commande confirmée</p>
      </UIStepsCompletedContent>
    </UISteps>
    <UIProgress :model-value="progressValue" label="Progression" intent="primary" size="sm" />
  </div>
</template>
