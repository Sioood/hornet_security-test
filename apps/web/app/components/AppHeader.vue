<script setup lang="ts">
import type { AppThemePreference } from '../composables/useAppColorMode'

const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const { preference, setTheme } = useAppColorMode()

const isLibraryActive = computed(() => route.path.startsWith('/books'))

const localeOptions = computed(() =>
  locales.value.map((availableLocale) => ({
    label: availableLocale.code === 'fr-FR' ? 'FR' : 'EN',
    value: availableLocale.code,
  })),
)

const themeOptions = computed(() => [
  { label: t('themeAuto'), value: 'auto' },
  { label: t('themeLightShort'), value: 'light' },
  { label: t('themeDarkShort'), value: 'dark' },
])

const localeSelection = computed({
  get: () => locale.value,
  set: (code: (typeof locales.value)[number]['code']) => {
    navigateTo(switchLocalePath(code))
  },
})

const themeSelection = computed({
  get: () => preference.value,
  set: (value: string) => {
    setTheme(value as AppThemePreference)
  },
})
</script>

<template>
  <header
    class="border-b border-neutral-border-subtle/70 bg-neutral-surface-subtle/90 backdrop-blur-md"
  >
    <div
      class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-5 lg:px-10 lg:py-6"
    >
      <div class="flex min-w-0 flex-col gap-1">
        <UILink
          intent="neutral"
          styled
          to="/books"
          :ui="{
            root: 'font-display txt-h2 text-neutral-text no-underline transition-colors hover:text-primary-text',
          }"
          variant="ghost"
        >
          {{ $t('appName') }}
        </UILink>
        <p class="txt-caption text-neutral-text-muted">{{ $t('appTagline') }}</p>
      </div>

      <nav :aria-label="$t('navMain')">
        <UILink
          :aria-current="isLibraryActive ? 'page' : undefined"
          intent="neutral"
          to="/books"
          :ui="{
            root: isLibraryActive
              ? 'txt-label font-medium text-neutral-text no-underline'
              : 'txt-label text-neutral-text-muted no-underline transition-colors hover:text-neutral-text',
          }"
          variant="ghost"
        >
          {{ $t('navLibrary') }}
        </UILink>
      </nav>

      <div class="flex flex-wrap items-center gap-4">
        <nav :aria-label="$t('navLanguage')">
          <UISegmentGroup
            v-model="localeSelection"
            :options="localeOptions"
            size="sm"
            variant="pill"
          />
        </nav>

        <nav :aria-label="$t('navTheme')">
          <UISegmentGroup
            v-model="themeSelection"
            :options="themeOptions"
            size="sm"
            variant="pill"
          />
        </nav>
      </div>
    </div>
  </header>
</template>
