<script setup lang="ts">
import { ref } from 'vue'

const upvotePressed = ref(false)
const downvotePressed = ref(false)
const bookmarkPressed = ref(false)
const crewOpen = ref(false)
const awardsOpen = ref(false)
const activeNav = ref('accueil')

const movie = {
  awards: [
    "Nomination à l'Oscar de la meilleure actrice (Ellen Burstyn)",
    '37 récompenses et 68 nominations internationales',
  ],
  casting: [
    'Ellen Burstyn',
    'Jared Leto',
    'Jennifer Connelly',
    'Marlon Wayans',
    'Christopher McDonald',
    'Mark Margolis',
  ],
  category: 'Films > Drame',
  classification: 'Interdit -12',
  country: 'États-Unis',
  director: 'Darren Aronofsky',
  festival: 'Cannes 2000 (hors compétition)',
  genre: 'Drame',
  imdb: '8.3/10',
  imdbUrl: 'https://www.imdb.com/fr/title/tt0180093/',
  language: 'VFF, VO',
  metascore: '71',
  music: 'Clint Mansell',
  originalTitle: 'Requiem for a Dream',
  posterUrl:
    'https://m.media-amazon.com/images/M/MV5BOTdiNzJlOWUtNWMwNS00NmFlLWI0YTEtZmI3YjIzZWUyY2Y3XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX101_CR0,0,101,150_.jpg',
  runtime: '1 h 42 min',
  synopsis:
    "À Coney Island, Sara Goldfarb, veuve recluse accro à la télévision, rêve de participer à son émission favorite. Son fils Harry, sa petite amie Marion et leur ami Tyrone vivent dans l'euphorie de l'héroïne jusqu'à ce que leurs addictions les entraînent dans une spirale d'illusions, de désespoir et d'autodestruction.",
  title: 'Requiem for a Dream',
  tmdbUrl: 'https://www.themoviedb.org/movie/641',
  writers: 'Hubert Selby Jr., Darren Aronofsky',
  year: '2000',
}

const navTabs = [
  { chevron: false, icon: 'tabler:home', label: 'Accueil', value: 'accueil' },
  { chevron: false, icon: 'tabler:search', label: 'Parcourir', value: 'parcourir' },
  { chevron: false, icon: 'tabler:flame', label: 'Top', value: 'top' },
  { chevron: false, icon: 'tabler:heart', label: 'Favoris', value: 'favoris' },
  { chevron: false, icon: 'tabler:history', label: 'Histoire', value: 'histoire' },
  { chevron: false, icon: 'tabler:settings', label: 'Paramètres', value: 'paramètres' },
  { chevron: false, icon: 'tabler:help', label: 'Aide', value: 'aide' },
  { chevron: false, icon: 'tabler:mail', label: 'Contact', value: 'contact' },
  { chevron: false, icon: 'tabler:shield', label: 'Politique', value: 'politique' },
  { chevron: false, icon: 'tabler:file-check', label: 'Conditions', value: 'conditions' },
  { chevron: false, icon: 'tabler:file-text', label: 'Mentions', value: 'mentions' },
] as const

const metadataTags = [
  { label: 'Genre', value: movie.genre },
  { label: 'Langue', value: movie.language },
  { label: 'Durée', value: movie.runtime },
  { label: 'Pays', value: movie.country },
] as const

type StatTone = 'default' | 'success' | 'error' | 'accent'

const statRows: ReadonlyArray<ReadonlyArray<{ label: string; value: string; tone: StatTone }>> = [
  [
    { label: 'IMDb', tone: 'accent', value: movie.imdb },
    { label: 'METASCORE', tone: 'default', value: movie.metascore },
    { label: 'DURÉE', tone: 'default', value: movie.runtime },
  ],
  [
    { label: 'ANNÉE', tone: 'default', value: movie.year },
    { label: 'CLASSIFICATION', tone: 'default', value: movie.classification },
    { label: 'PAYS', tone: 'default', value: movie.country },
  ],
]

const filmInfoRows = [
  [
    { label: 'Titre original', value: movie.originalTitle },
    { label: 'Réalisateur', value: movie.director },
    { label: 'Scénario', value: movie.writers },
  ],
  [
    { label: 'Musique', value: movie.music },
    { label: 'Festival', value: movie.festival },
    { label: 'Sortie', value: '6 octobre 2000' },
  ],
] as const

const prevMovie = 'American Beauty (1999)'
const nextMovie = 'Memento (2000)'

const statValueClass: Record<StatTone, string> = {
  accent: 'text-accent-text',
  default: 'text-neutral-text',
  error: 'text-error-text',
  success: 'text-success-text',
}

const collapsibleTriggerUi = {
  indicator: 'sr-only',
  trigger: 'border-0 px-4 py-3',
}
</script>

<template>
  <div class="flex min-h-screen bg-neutral-bg text-neutral-text">
    <aside
      class="fixed z-40 flex h-full w-64 flex-col border-r border-neutral-border-subtle bg-neutral-bg"
    >
      <div class="border-b border-neutral-border-subtle p-4">
        <h1 class="txt-h6 font-mono font-bold tracking-wider text-neutral-text">Ställning TV</h1>
        <div class="mt-3 flex items-center justify-between">
          <span class="txt-caption text-neutral-text-subtle">siod</span>
          <div class="flex gap-1">
            <UIButton variant="ghost" intent="neutral" size="sm" aria-label="Notifications">
              <Icon name="tabler:bell" class="size-4" />
            </UIButton>
            <UIButton variant="ghost" intent="neutral" size="sm" aria-label="Déconnexion">
              <Icon name="tabler:logout" class="size-4" />
            </UIButton>
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto">
        <UITabsRoot
          v-model="activeNav"
          orientation="vertical"
          variant="pill"
          intent="neutral"
          size="sm"
          :ui="{ root: 'size-full' }"
        >
          <UITabsList :ui="{ root: 'flex w-full flex-col p-1 border-none bg-neutral-bg' }">
            <UITabsTrigger
              v-for="tab in navTabs"
              :key="tab.value"
              :value="tab.value"
              class="flex w-full items-center justify-start gap-2"
            >
              <Icon :name="tab.icon" class="size-4" />
              <span class="flex-1 text-left">{{ tab.label }}</span>
              <Icon
                v-if="tab.chevron"
                name="tabler:chevron-right"
                class="size-4 text-neutral-text-subtle"
              />
            </UITabsTrigger>
            <UITabsIndicator />
          </UITabsList>
        </UITabsRoot>
      </nav>

      <div class="border-t border-neutral-border-subtle p-4">
        <div class="flex items-center gap-2">
          <div class="size-2 animate-pulse bg-success-fill" />
          <span class="txt-caption text-neutral-text-subtle">Service online</span>
        </div>
        <span class="txt-caption text-neutral-text-subtle">v1.0.0</span>
      </div>
    </aside>

    <main class="ml-56 flex-1 px-32 py-6">
      <div class="mb-6 flex gap-4">
        <UIButton
          variant="ghost"
          intent="neutral"
          class="w-full justify-start rounded-none px-4 py-3"
        >
          <Icon name="tabler:chevron-left" class="size-4 shrink-0" />
          <div class="min-w-0 text-left">
            <span class="txt-label block text-neutral-text">PRÉCÉDENT</span>
            <span class="txt-caption block truncate text-neutral-text-subtle">{{ prevMovie }}</span>
          </div>
        </UIButton>
        <UIButton
          variant="ghost"
          intent="neutral"
          class="w-full justify-end rounded-none px-4 py-3"
        >
          <div class="min-w-0 text-right">
            <span class="txt-label block text-neutral-text">SUIVANT</span>
            <span class="txt-caption block truncate text-neutral-text-subtle">{{ nextMovie }}</span>
          </div>
          <Icon name="tabler:chevron-right" class="size-4 shrink-0" />
        </UIButton>
      </div>

      <UICardBase variant="subtle" intent="neutral" size="lg" class="mb-6">
        <div class="flex gap-6">
          <div class="w-48 shrink-0">
            <NuxtImg
              :src="movie.posterUrl"
              :alt="`Affiche de ${movie.title}`"
              width="192"
              height="288"
              class="aspect-2/3 w-full border border-neutral-border-subtle object-cover"
            />
          </div>

          <div class="flex-1 space-y-4">
            <div>
              <h2 class="txt-h3 text-neutral-text">
                {{ movie.title }}
                <span class="text-neutral-text-subtle">({{ movie.year }})</span>
              </h2>
              <p class="txt-caption mt-1 text-neutral-text-subtle">
                {{ movie.originalTitle }} — {{ movie.festival }}
              </p>
            </div>

            <UIBadge :label="movie.category" intent="orange" />

            <div class="flex flex-wrap gap-2">
              <UIBadge
                v-for="tag in metadataTags"
                :key="tag.label"
                :label="`${tag.label}: ${tag.value}`"
                intent="neutral"
              />
            </div>

            <div class="grid grid-cols-3 gap-2">
              <UICardBase
                v-for="(cell, index) in statRows.flat()"
                :key="index"
                variant="default"
                intent="neutral"
                size="sm"
              >
                <span class="txt-label block text-neutral-text-subtle">{{ cell.label }}</span>
                <span class="txt-caption" :class="statValueClass[cell.tone]">{{ cell.value }}</span>
              </UICardBase>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <UICardBase
                v-for="(cell, index) in filmInfoRows.flat()"
                :key="index"
                variant="default"
                intent="neutral"
                size="sm"
              >
                <span class="txt-label block text-neutral-text-subtle">{{ cell.label }}</span>
                <span class="txt-caption text-neutral-text">{{ cell.value }}</span>
              </UICardBase>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <span class="txt-label text-neutral-text-subtle">Noter ce film :</span>
              <UIToggle v-model:pressed="upvotePressed" size="sm" variant="subtle" intent="neutral">
                <template #on>
                  <div class="flex items-center gap-1">
                    <Icon name="tabler:thumb-up-filled" class="size-3" />
                    <span>J'aime</span>
                  </div>
                </template>
                <template #off>
                  <div class="flex items-center gap-1">
                    <Icon name="tabler:thumb-up" class="size-3" />
                    <span>J'aime</span>
                  </div>
                </template>
              </UIToggle>
              <UIToggle
                v-model:pressed="downvotePressed"
                size="sm"
                variant="subtle"
                intent="neutral"
              >
                <template #on>
                  <div class="flex items-center gap-1">
                    <Icon name="tabler:thumb-down-filled" class="size-3" />
                    <span>Je n'aime pas</span>
                  </div>
                </template>
                <template #off>
                  <div class="flex items-center gap-1">
                    <Icon name="tabler:thumb-down" class="size-3" />
                    <span>Je n'aime pas</span>
                  </div>
                </template>
              </UIToggle>
            </div>

            <UIDivider intent="neutral" />

            <div class="flex flex-wrap gap-2">
              <UIButton intent="accent" leading-icon="tabler:player-play">
                Voir la bande-annonce
              </UIButton>
              <UIToggle
                v-model:pressed="bookmarkPressed"
                variant="subtle"
                intent="neutral"
                size="md"
              >
                <template #on>
                  <div class="flex items-center gap-1">
                    <Icon name="tabler:bookmark-filled" class="size-4" />
                    <span>Marque-page</span>
                  </div>
                </template>
                <template #off>
                  <div class="flex items-center gap-1">
                    <Icon name="tabler:bookmark" class="size-4" />
                    <span>Marque-page</span>
                  </div>
                </template>
              </UIToggle>
            </div>

            <div class="flex flex-wrap gap-2">
              <UIButton
                variant="subtle"
                size="sm"
                intent="accent"
                leading-icon="tabler:device-tv"
                :to="movie.imdbUrl"
                target="_blank"
              >
                IMDb
              </UIButton>
              <UIButton
                variant="subtle"
                size="sm"
                intent="info"
                leading-icon="tabler:device-tv"
                :to="movie.tmdbUrl"
                target="_blank"
              >
                TMDB
              </UIButton>
              <UIButton variant="subtle" size="sm" intent="neutral" leading-icon="tabler:share">
                Partager
              </UIButton>
            </div>

            <UIDivider intent="neutral" />

            <div class="grid grid-cols-2 gap-6">
              <div>
                <h3 class="txt-label mb-2 text-neutral-text-subtle">SYNOPSIS</h3>
                <p class="txt-base leading-relaxed text-neutral-text">
                  {{ movie.synopsis }}
                </p>
              </div>
              <div>
                <h3 class="txt-label mb-2 text-neutral-text-subtle">DISTRIBUTION</h3>
                <div class="flex flex-wrap gap-2">
                  <UIBadge
                    v-for="actor in movie.casting"
                    :key="actor"
                    :label="actor"
                    intent="neutral"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </UICardBase>

      <UICardBase
        variant="subtle"
        intent="neutral"
        size="lg"
        class="divide-y divide-neutral-border-subtle overflow-hidden p-0"
      >
        <UICollapsible v-model="crewOpen" :ui="collapsibleTriggerUi">
          <template #title>
            <div class="flex items-center gap-2 font-mono">
              <Icon
                :name="crewOpen ? 'tabler:chevron-down' : 'tabler:chevron-right'"
                class="size-4 text-neutral-text-subtle"
              />
              <span class="txt-h6 text-neutral-text">Équipe artistique</span>
            </div>
          </template>
          <ul class="txt-base space-y-2 px-4 pb-4 text-neutral-text-subtle">
            <li><span class="text-neutral-text">Réalisation :</span> {{ movie.director }}</li>
            <li><span class="text-neutral-text">Scénario :</span> {{ movie.writers }}</li>
            <li><span class="text-neutral-text">Musique :</span> {{ movie.music }}</li>
          </ul>
        </UICollapsible>

        <UICollapsible v-model="awardsOpen" :ui="collapsibleTriggerUi">
          <template #title>
            <div class="flex items-center gap-2 font-mono">
              <Icon
                :name="awardsOpen ? 'tabler:chevron-down' : 'tabler:chevron-right'"
                class="size-4 text-neutral-text-subtle"
              />
              <span class="txt-h6 text-neutral-text">Distinctions</span>
              <UIBadge :label="String(movie.awards.length)" intent="neutral" />
            </div>
          </template>
          <ul class="txt-base list-disc space-y-1 px-4 pb-4 pl-8 text-neutral-text">
            <li v-for="award in movie.awards" :key="award">{{ award }}</li>
          </ul>
        </UICollapsible>
      </UICardBase>
    </main>
  </div>
</template>
