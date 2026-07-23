<script setup lang="ts">
// oxlint-disable no-console
import { useTour, waitForElement, waitForEvent, type TourStepDetails } from '@ark-ui/vue/tour'
import { ref } from 'vue'

const activeScenario = ref<
  | 'basic'
  | 'progress'
  | 'skip'
  | 'keyboard'
  | 'waitClick'
  | 'waitInput'
  | 'waitElement'
  | 'async'
  | 'events'
  | 'mixed'
>('basic')

// ─── Basic Tour ──────────────────────────────────────────────
const basicSteps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Commencer' }],
    description: "Découvrons ensemble les fonctionnalités principales de l'application.",
    id: 'welcome',
    title: 'Bienvenue !',
    type: 'dialog',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description: 'Cliquez ici pour ajouter vos fichiers au projet.',
    id: 'upload',
    target: () => document.querySelector<HTMLElement>('#basic-upload'),
    title: 'Téléverser des fichiers',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description: 'Enregistrez vos modifications pour conserver votre progression.',
    id: 'save',
    target: () => document.querySelector<HTMLElement>('#basic-save'),
    title: 'Sauvegarder',
    type: 'tooltip',
  },
  {
    actions: [{ action: 'dismiss', label: 'Fermer' }],
    description: 'Vous connaissez maintenant les bases. Bonne utilisation !',
    id: 'complete',
    title: 'Terminé !',
    type: 'dialog',
  },
]

const basicTour = useTour({ steps: basicSteps })

// ─── Progress Bar Tour ───────────────────────────────────────
const progressSteps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Suivant' }],
    description: 'Observez la barre de progression en bas du panneau.',
    id: 'p1',
    target: () => document.querySelector<HTMLElement>('#progress-1'),
    title: 'Étape 1 sur 4',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description: 'La barre avance à chaque étape.',
    id: 'p2',
    target: () => document.querySelector<HTMLElement>('#progress-2'),
    title: 'Étape 2 sur 4',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description: 'Encore un petit effort !',
    id: 'p3',
    target: () => document.querySelector<HTMLElement>('#progress-3'),
    title: 'Étape 3 sur 4',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'dismiss', label: 'Terminer' },
    ],
    description: 'Vous avez complété toutes les étapes.',
    id: 'p4',
    target: () => document.querySelector<HTMLElement>('#progress-4'),
    title: 'Étape 4 sur 4',
    type: 'tooltip',
  },
]

const progressTour = useTour({ steps: progressSteps })

// ─── Skip Tour ───────────────────────────────────────────────
const skipSteps: TourStepDetails[] = [
  {
    actions: [
      { action: 'dismiss', label: 'Ignorer' },
      { action: 'next', label: 'Suivant' },
    ],
    description: 'Vous pouvez ignorer cette visite à tout moment avec le bouton Ignorer.',
    id: 's1',
    target: () => document.querySelector<HTMLElement>('#skip-1'),
    title: 'Première fonctionnalité',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'dismiss', label: 'Ignorer' },
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description: 'Continuez ou ignorez pour terminer la visite.',
    id: 's2',
    target: () => document.querySelector<HTMLElement>('#skip-2'),
    title: 'Deuxième fonctionnalité',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'dismiss', label: 'Terminer' },
    ],
    description: "C'est la dernière étape de la visite.",
    id: 's3',
    target: () => document.querySelector<HTMLElement>('#skip-3'),
    title: 'Dernière étape',
    type: 'tooltip',
  },
]

const skipTour = useTour({ steps: skipSteps })

// ─── Keyboard Navigation Tour ────────────────────────────────
const keyboardSteps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Suivant' }],
    description: "Appuyez sur la flèche droite pour passer à l'étape suivante.",
    id: 'k1',
    target: () => document.querySelector<HTMLElement>('#key-1'),
    title: 'Navigation clavier',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description: "Appuyez sur la flèche gauche pour revenir à l'étape précédente.",
    id: 'k2',
    target: () => document.querySelector<HTMLElement>('#key-2'),
    title: 'Revenir en arrière',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'dismiss', label: 'Terminer' },
    ],
    description: 'Appuyez sur Échap pour fermer la visite à tout moment.',
    id: 'k3',
    target: () => document.querySelector<HTMLElement>('#key-3'),
    title: 'Fermer la visite',
    type: 'tooltip',
  },
]

const keyboardTour = useTour({ keyboardNavigation: true, steps: keyboardSteps })

// ─── Wait for Click Tour ─────────────────────────────────────
const waitClickSteps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Commencer' }],
    description:
      'Cette visite vous guidera à travers des actions. Vous devez compléter chaque étape pour continuer.',
    id: 'wc-intro',
    title: 'Tutoriel interactif',
    type: 'dialog',
  },
  {
    description: 'Cliquez sur le bouton "Ajouter un élément" pour continuer.',
    effect({ next, target, show }) {
      show()
      const [promise, cancel] = waitForEvent(target, 'click')
      promise.then(() => next())
      return cancel
    },
    id: 'wc-add',
    target: () => document.querySelector<HTMLElement>('#wc-add-btn'),
    title: 'Cliquez sur "Ajouter"',
    type: 'tooltip',
  },
  {
    description: 'Maintenant, cliquez sur le bouton "Modifier".',
    effect({ next, target, show }) {
      show()
      const [promise, cancel] = waitForEvent(target, 'click')
      promise.then(() => next())
      return cancel
    },
    id: 'wc-edit',
    target: () => document.querySelector<HTMLElement>('#wc-edit-btn'),
    title: 'Cliquez sur "Modifier"',
    type: 'tooltip',
  },
  {
    actions: [{ action: 'dismiss', label: 'Terminer' }],
    description: 'Vous avez terminé toutes les étapes interactives.',
    id: 'wc-complete',
    title: 'Bravo !',
    type: 'dialog',
  },
]

const waitClickTour = useTour({ steps: waitClickSteps })

// ─── Wait for Input Tour ─────────────────────────────────────
const waitInputSteps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Commencer' }],
    description: 'Apprenez à remplir le formulaire en suivant les étapes guidées.',
    id: 'wi-intro',
    title: 'Tutoriel formulaire',
    type: 'dialog',
  },
  {
    description: 'Tapez votre nom dans le champ pour continuer (min. 2 caractères).',
    effect({ next, target, show }) {
      show()
      const [promise, cancel] = waitForEvent<HTMLInputElement>(target, 'input', {
        predicate: (el) => el.value.trim().length >= 2,
      })
      promise.then(() => next())
      return cancel
    },
    id: 'wi-name',
    target: () => document.querySelector<HTMLInputElement>('#wi-name-input'),
    title: 'Entrez votre nom',
    type: 'tooltip',
  },
  {
    description: 'Maintenant, entrez une adresse email valide.',
    effect({ next, target, show }) {
      show()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const [promise, cancel] = waitForEvent<HTMLInputElement>(target, 'input', {
        predicate: (el) => emailRegex.test(el.value),
      })
      promise.then(() => next())
      return cancel
    },
    id: 'wi-email',
    target: () => document.querySelector<HTMLInputElement>('#wi-email-input'),
    title: 'Entrez votre email',
    type: 'tooltip',
  },
  {
    description: "Cochez la case pour accepter les conditions d'utilisation.",
    effect({ next, target, show }) {
      show()
      const [promise, cancel] = waitForEvent<HTMLInputElement>(target, 'change', {
        predicate: (el) => el.checked,
      })
      promise.then(() => next())
      return cancel
    },
    id: 'wi-terms',
    target: () => document.querySelector<HTMLInputElement>('#wi-terms-checkbox'),
    title: 'Acceptez les conditions',
    type: 'tooltip',
  },
  {
    actions: [{ action: 'dismiss', label: 'Terminer' }],
    description: 'Vous avez réussi à remplir le formulaire.',
    id: 'wi-complete',
    title: 'Formulaire complété !',
    type: 'dialog',
  },
]

const waitInputTour = useTour({ steps: waitInputSteps })

// ─── Wait for Element Tour ───────────────────────────────────
const waitElementItems = ref<string[]>(['Élément 1', 'Élément 2'])

const waitElementSteps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Commencer' }],
    description:
      'Cette visite montre comment attendre des éléments qui apparaissent dynamiquement.',
    id: 'we-intro',
    title: 'Éléments dynamiques',
    type: 'dialog',
  },
  {
    description: 'Cliquez sur le bouton pour ajouter un nouvel élément à la liste.',
    effect({ next, target, show }) {
      show()
      const [promise, cancel] = waitForEvent(target, 'click')
      promise.then(() => next())
      return cancel
    },
    id: 'we-add',
    target: () => document.querySelector<HTMLElement>('#we-add-btn'),
    title: 'Ajoutez un élément',
    type: 'tooltip',
  },
  {
    actions: [{ action: 'next', label: 'Suivant' }],
    description: "La visite a attendu que cet élément apparaisse avant d'afficher cette étape.",
    effect({ show }) {
      const [promise, cancel] = waitForElement(
        () => document.querySelector<HTMLElement>('[data-item="new"]'),
        {
          timeout: 5000,
        },
      )
      promise.then(() => show())
      return () => cancel()
    },
    id: 'we-new',
    target: () => document.querySelector<HTMLElement>('[data-item="new"]'),
    title: 'Nouvel élément ajouté !',
    type: 'tooltip',
  },
  {
    actions: [{ action: 'dismiss', label: 'Terminer' }],
    description: 'Vous avez appris à utiliser waitForElement pour le contenu dynamique.',
    id: 'we-complete',
    title: 'Visite terminée',
    type: 'dialog',
  },
]

const waitElementTour = useTour({ steps: waitElementSteps })

const addWaitElementItem = () => {
  waitElementItems.value = [
    ...waitElementItems.value,
    `Élément ${waitElementItems.value.length + 1}`,
  ]
}

// ─── Async Tour ──────────────────────────────────────────────
const asyncSteps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Suivant' }],
    description: "Cette visite charge des données avant d'afficher une étape.",
    id: 'async-intro',
    title: 'Chargement asynchrone',
    type: 'dialog',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description: 'Récupération des données utilisateur...',
    effect({ show, update }) {
      const controller = new AbortController()

      fetch('https://api.github.com/users/segunadebayo', { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          update({
            description: `${data.public_repos} dépôts publics et ${data.followers} abonnés.`,
            title: `Bienvenue, ${data.name || data.login} !`,
          })
          show()
        })
        .catch(() => {
          update({
            description: 'Impossible de charger les données. Veuillez réessayer.',
            title: 'Profil utilisateur',
          })
          show()
        })

      return () => controller.abort()
    },
    id: 'async-user',
    target: () => document.querySelector<HTMLElement>('#async-user-card'),
    title: 'Chargement...',
    type: 'tooltip',
  },
  {
    actions: [{ action: 'dismiss', label: 'Terminer' }],
    description: "L'étape asynchrone a chargé les données depuis l'API GitHub.",
    id: 'async-complete',
    title: 'Visite terminée',
    type: 'dialog',
  },
]

const asyncTour = useTour({ steps: asyncSteps })

// ─── Events Tour ─────────────────────────────────────────────
const eventLogs = ref<string[]>([])

const addEventLog = (message: string) => {
  eventLogs.value = [...eventLogs.value, message]
}

const eventSteps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Suivant' }],
    description: "Observez le journal d'événements ci-dessous pendant la navigation.",
    id: 'e1',
    target: () => document.querySelector<HTMLElement>('#event-1'),
    title: 'Première étape',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description: "Chaque changement d'étape déclenche un événement.",
    id: 'e2',
    target: () => document.querySelector<HTMLElement>('#event-2'),
    title: 'Deuxième étape',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'dismiss', label: 'Terminer' },
    ],
    description: 'Terminez la visite pour voir le changement de statut.',
    id: 'e3',
    target: () => document.querySelector<HTMLElement>('#event-3'),
    title: 'Dernière étape',
    type: 'tooltip',
  },
]

const eventTour = useTour({
  onStatusChange(details) {
    addEventLog(`Statut : ${details.status}`)
  },
  onStepChange(details) {
    addEventLog(`Étape changée : ${details.stepId}`)
  },
  steps: eventSteps,
})

// ─── Mixed Types Tour ────────────────────────────────────────
const mixedSteps: TourStepDetails[] = [
  {
    actions: [{ action: 'next', label: 'Commencer' }],
    description:
      "Cette visite montre les différents types d'étapes : dialogue, tooltip et flottant.",
    id: 'm-welcome',
    title: 'Bienvenue !',
    type: 'dialog',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description: 'Cette étape apparaît comme un tooltip ancré à un élément spécifique.',
    id: 'm-tooltip',
    target: () => document.querySelector<HTMLElement>('#mixed-target'),
    title: 'Étape Tooltip',
    type: 'tooltip',
  },
  {
    actions: [
      { action: 'prev', label: 'Précédent' },
      { action: 'next', label: 'Suivant' },
    ],
    description:
      "Cette étape flotte à une position fixe sur l'écran, indépendante de tout élément cible.",
    id: 'm-floating',
    placement: 'bottom-end',
    title: 'Étape flottante',
    type: 'floating',
  },
  {
    actions: [{ action: 'dismiss', label: 'Terminer' }],
    description: "Vous avez vu tous les types d'étapes disponibles.",
    id: 'm-complete',
    title: 'Visite terminée !',
    type: 'dialog',
  },
]

const mixedTour = useTour({ steps: mixedSteps })

// ─── Scenario management ─────────────────────────────────────
const scenarios = [
  { id: 'basic' as const, label: 'Basique' },
  { id: 'progress' as const, label: 'Barre de progression' },
  { id: 'skip' as const, label: 'Ignorer' },
  { id: 'keyboard' as const, label: 'Navigation clavier' },
  { id: 'waitClick' as const, label: 'Attendre un clic' },
  { id: 'waitInput' as const, label: 'Attendre une saisie' },
  { id: 'waitElement' as const, label: 'Attendre un élément' },
  { id: 'async' as const, label: 'Asynchrone' },
  { id: 'events' as const, label: 'Événements' },
  { id: 'mixed' as const, label: 'Types mixtes' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Scenario selector -->
    <div class="flex flex-wrap gap-2">
      <UIButton
        v-for="scenario in scenarios"
        :key="scenario.id"
        :variant="activeScenario === scenario.id ? 'default' : 'subtle'"
        :intent="activeScenario === scenario.id ? 'primary' : 'neutral'"
        size="sm"
        @click="activeScenario = scenario.id"
      >
        {{ scenario.label }}
      </UIButton>
    </div>

    <!-- Scenario content -->
    <div class="flex flex-col gap-4">
      <!-- Basic scenario -->
      <div v-if="activeScenario === 'basic'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="basicTour.start()"
        >
          Lancer la visite
        </UIButton>
        <div class="flex gap-3">
          <UICardBase id="basic-upload" class="flex items-center gap-2">
            <Icon name="tabler:upload" class="size-5" />
            <span class="txt-label">Téléverser</span>
          </UICardBase>
          <UICardBase id="basic-save" class="flex items-center gap-2">
            <Icon name="tabler:device-floppy" class="size-5" />
            <span class="txt-label">Sauvegarder</span>
          </UICardBase>
        </div>
        <UITour show-progress-bar :tour="basicTour" intent="neutral" size="md" />
      </div>

      <!-- Progress scenario -->
      <div v-if="activeScenario === 'progress'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="progressTour.start()"
        >
          Lancer la visite avec barre de progression
        </UIButton>
        <div class="flex flex-wrap gap-3">
          <UICardBase id="progress-1" class="txt-label">Étape 1</UICardBase>
          <UICardBase id="progress-2" class="txt-label">Étape 2</UICardBase>
          <UICardBase id="progress-3" class="txt-label">Étape 3</UICardBase>
          <UICardBase id="progress-4" class="txt-label">Étape 4</UICardBase>
        </div>
        <UITour :tour="progressTour" intent="neutral" size="md" show-progress-bar />
      </div>

      <!-- Skip scenario -->
      <div v-if="activeScenario === 'skip'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="skipTour.start()"
        >
          Lancer la visite avec option ignorer
        </UIButton>
        <div class="flex gap-3">
          <UICardBase id="skip-1" class="txt-label">Élément 1</UICardBase>
          <UICardBase id="skip-2" class="txt-label">Élément 2</UICardBase>
          <UICardBase id="skip-3" class="txt-label">Élément 3</UICardBase>
        </div>
        <UITour :tour="skipTour" intent="neutral" size="md" />
      </div>

      <!-- Keyboard scenario -->
      <div v-if="activeScenario === 'keyboard'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="keyboardTour.start()"
        >
          Lancer la visite (flèches + Échap)
        </UIButton>
        <UIAlert
          type="info"
          title="Navigation clavier"
          description="Utilisez les flèches pour naviguer, Échap pour fermer"
        />
        <div class="flex gap-3">
          <UICardBase id="key-1" class="txt-label">Étape 1</UICardBase>
          <UICardBase id="key-2" class="txt-label">Étape 2</UICardBase>
          <UICardBase id="key-3" class="txt-label">Étape 3</UICardBase>
        </div>
        <UITour :tour="keyboardTour" intent="neutral" size="md" />
      </div>

      <!-- Wait for Click scenario -->
      <div v-if="activeScenario === 'waitClick'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="waitClickTour.start()"
        >
          Lancer la visite interactive
        </UIButton>
        <div class="flex gap-3">
          <UIButton id="wc-add-btn" variant="default" intent="primary" icon="tabler:plus">
            Ajouter un élément
          </UIButton>
          <UIButton id="wc-edit-btn" variant="subtle" intent="neutral" icon="tabler:pencil">
            Modifier
          </UIButton>
        </div>
        <UITour :tour="waitClickTour" intent="neutral" size="md" />
      </div>

      <!-- Wait for Input scenario -->
      <div v-if="activeScenario === 'waitInput'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="waitInputTour.start()"
        >
          Lancer le tutoriel formulaire
        </UIButton>
        <UICardBase class="max-w-sm">
          <div class="flex flex-col gap-4">
            <UIFormInput
              id="wi-name-input"
              label="Nom"
              placeholder="Entrez votre nom"
              icon="tabler:user"
            />
            <UIFormInput
              id="wi-email-input"
              label="Email"
              type="email"
              placeholder="Entrez votre email"
              icon="tabler:mail"
            />
            <div class="flex items-center gap-2">
              <UISwitch id="wi-terms-checkbox" />
              <label for="wi-terms-checkbox" class="txt-caption text-neutral-text">
                J'accepte les conditions d'utilisation
              </label>
            </div>
          </div>
        </UICardBase>
        <UITour :tour="waitInputTour" intent="neutral" size="md" />
      </div>

      <!-- Wait for Element scenario -->
      <div v-if="activeScenario === 'waitElement'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="waitElementTour.start()"
        >
          Lancer la visite (éléments dynamiques)
        </UIButton>
        <UIButton
          id="we-add-btn"
          variant="subtle"
          intent="neutral"
          icon="tabler:plus"
          @click="addWaitElementItem"
        >
          Ajouter un élément
        </UIButton>
        <UICardBase>
          <div class="flex flex-col gap-2">
            <div
              v-for="(item, index) in waitElementItems"
              :key="item"
              class="flex items-center justify-between"
              :data-item="
                index === waitElementItems.length - 1 && waitElementItems.length > 2
                  ? 'new'
                  : undefined
              "
            >
              <span class="txt-label text-neutral-text">{{ item }}</span>
              <UIBadge
                v-if="index === waitElementItems.length - 1 && waitElementItems.length > 2"
                intent="primary"
                label="Nouveau"
              />
            </div>
          </div>
        </UICardBase>
        <UITour :tour="waitElementTour" intent="neutral" size="md" />
      </div>

      <!-- Async scenario -->
      <div v-if="activeScenario === 'async'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="asyncTour.start()"
        >
          Lancer la visite asynchrone
        </UIButton>
        <UICardBase id="async-user-card" class="flex items-center gap-3">
          <Icon name="tabler:user-circle" class="size-8 text-neutral-text-subtle" />
          <span class="txt-label text-neutral-text">Carte profil utilisateur</span>
        </UICardBase>
        <UITour :tour="asyncTour" intent="neutral" size="md" />
      </div>

      <!-- Events scenario -->
      <div v-if="activeScenario === 'events'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="eventTour.start()"
        >
          Lancer la visite avec journal d'événements
        </UIButton>
        <div class="flex gap-3">
          <UICardBase id="event-1" class="txt-label">Étape 1</UICardBase>
          <UICardBase id="event-2" class="txt-label">Étape 2</UICardBase>
          <UICardBase id="event-3" class="txt-label">Étape 3</UICardBase>
        </div>
        <UICardBase class="max-h-32 overflow-y-auto">
          <div class="flex flex-col gap-1">
            <strong class="txt-caption text-neutral-text">Journal d'événements :</strong>
            <div v-if="eventLogs.length === 0" class="text-neutral-text-subtle">
              Lancez la visite pour voir les événements
            </div>
            <div v-for="(log, i) in eventLogs" :key="i" class="font-mono text-neutral-text-subtle">
              {{ log }}
            </div>
          </div>
        </UICardBase>
        <UITour :tour="eventTour" intent="neutral" size="md" />
      </div>

      <!-- Mixed Types scenario -->
      <div v-if="activeScenario === 'mixed'" class="flex flex-col gap-4">
        <UIButton
          variant="default"
          intent="primary"
          icon="tabler:sparkles"
          @click="mixedTour.start()"
        >
          Lancer la visite (types mixtes)
        </UIButton>
        <UICardBase id="mixed-target" class="txt-label">Élément cible</UICardBase>
        <UITour :tour="mixedTour" intent="neutral" size="md" />
      </div>
    </div>
  </div>
</template>
