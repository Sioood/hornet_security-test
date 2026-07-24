<script setup lang="ts">
const expandedPanels = ref<string[]>(['shipping'])

const faqItems = [
  {
    content: 'Les commandes partent sous 24 h ouvrées. Livraison standard en 3 à 5 jours.',
    trigger: 'Quels sont les délais de livraison ?',
    value: 'shipping',
  },
  {
    content: 'Contactez le support sous 30 jours. L’étiquette retour est envoyée par e-mail.',
    trigger: 'Comment retourner un article ?',
    value: 'returns',
  },
  {
    content: 'Carte bancaire, virement SEPA et paiement en plusieurs fois éligible.',
    trigger: 'Quels moyens de paiement acceptez-vous ?',
    value: 'payment',
  },
] as const
</script>

<template>
  <div class="flex flex-col gap-3">
    <UIAccordion v-model="expandedPanels" collapsible multiple>
      <UIAccordionItem v-for="item in faqItems" :key="item.value" :value="item.value">
        <UIAccordionItemTrigger>
          <span class="txt-label">{{ item.trigger }}</span>
          <UIAccordionItemIndicator />
        </UIAccordionItemTrigger>
        <UIAccordionItemContent>
          <p class="txt-caption text-neutral-text-subtle">{{ item.content }}</p>
        </UIAccordionItemContent>
      </UIAccordionItem>
    </UIAccordion>
    <UILink to="mailto:support@hornet_security-test.dev" class="txt-caption">
      Contacter le support
    </UILink>
  </div>
</template>
