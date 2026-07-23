// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'
const { resolve } = createResolver(import.meta.url)

const isVitest = process.env.VITEST === 'true'
const isProduction = process.env.NODE_ENV === 'production'
const enableCompodium = !isVitest && !isProduction

// // https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [resolve('../nuxt-essentials')],
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    ...(enableCompodium ? ['@compodium/nuxt'] : []),
    '@nuxt/image',
    'v-gsap-nuxt',
  ],

  alias: { '~ui': resolve('./') },
  components: [
    {
      path: resolve('./app/components'),
      prefix: 'UI',
    },
  ],
  css: [resolve('./app/assets/css/main.css')],
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Spline Sans Mono', provider: 'google' },
    ],
  },
  i18n: {
    defaultLocale: 'fr-FR',
    // ISO 639-1 + ISO 3166-1
    locales: [{ code: 'fr-FR', file: 'fr-FR/index.ts', language: 'fr-FR', name: 'Français' }],
  },
  icon: {
    mode: 'svg',
    size: '1rem',
  },
  image: {
    densities: [1, 2],
    domains: ['api.dicebear.com'],
    format: ['avif', 'webp'],
    quality: 80,
    screens: {
      '2xl': 1536,
      lg: 1024,
      md: 768,
      sm: 640,
      xl: 1280,
      xs: 320,
    },
  },
  imports: enableCompodium
    ? undefined
    : {
        presets: [
          {
            from: resolve('./app/utils/extend-compodium-meta-stub.ts'),
            imports: ['extendCompodiumMeta'],
          },
        ],
      },
  runtimeConfig: {
    public: {
      siteUrl: 'https://ui.com',
    },
  },
  ...(enableCompodium
    ? {
        compodium: {
          dir: 'app/compodium/',
          includeLibraryCollections: true,
        },
      }
    : {}),
  site: {
    description: 'UI component library',
    name: 'UI',
    url: 'https://ui.com',
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
