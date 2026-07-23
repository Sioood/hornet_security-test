// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

const isDockerDev = process.env.DOCKER === '1'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [resolve('../../packages/ui')],

  experimental: {
    viewTransition: true,
  },

  fonts: {
    families: [{ name: 'Cormorant Garamond', provider: 'google', weights: [500, 600, 700] }],
  },

  app: {
    head: {
      link: [{ href: '/manifest.webmanifest', rel: 'manifest' }],
    },
  },
  css: [resolve('./app/assets/css/main.css')],
  i18n: {
    defaultLocale: 'fr-FR',
    locales: [
      { code: 'fr-FR', file: 'fr-FR/index.ts', language: 'fr-FR', name: 'Français' },
      { code: 'en-US', file: 'en-US/index.ts', language: 'en-US', name: 'English' },
    ],
  },
  pwa: {
    manifest: {
      background_color: '#ffffff',
      description: 'HornetSecurityTest web application',
      display: 'standalone',
      icons: [
        {
          purpose: 'any',
          sizes: 'any',
          src: '/pwa-icon.svg',
          type: 'image/svg+xml',
        },
      ],
      lang: 'fr',
      name: 'HornetSecurityTest',
      short_name: 'HornetSecurityTest',
      start_url: '/',
      theme_color: '#111827',
    },
  },
  runtimeConfig: {
    fakerApiBaseUrl: 'https://fakerapi.it/api/v1',
    fakerApiCooldownMs: 300_000,
    fakerApiTimeout: 700,
    public: {
      siteUrl: 'https://web.com',
    },
  },
  vite: isDockerDev
    ? {
        server: {
          hmr: { clientPort: 3000 },
          watch: { usePolling: true },
        },
      }
    : undefined,
})
