import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import ViteYaml from '@modyfi/vite-plugin-yaml'
import { createResolver } from '@nuxt/kit'

const require = createRequire(import.meta.url)
const { resolve } = createResolver(import.meta.url)
const piniaEsmEntry = join(dirname(require.resolve('pinia/package.json')), 'dist/pinia.mjs')

const isDev = process.env.NODE_ENV !== 'production'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-security',
  ],

  alias: {
    '~nuxt-essentials': resolve('./'),
    pinia: piniaEsmEntry,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  i18n: {
    defaultLocale: 'fr-FR',
    // ISO 639-1 + ISO 3166-1
    locales: [{ code: 'fr-FR', file: 'fr-FR/index.ts', language: 'fr-FR', name: 'Français' }],
  },
  nitro: {
    rollupConfig: {
      plugins: [ViteYaml()],
    },
  },
  pwa: {
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
    },
    manifest: {
      background_color: '#ffffff',
      description: 'HornetSecurityTest application',
      display: 'standalone',
      name: 'HornetSecurityTest App',
      short_name: 'HornetSecurityTest',
      theme_color: '#111827',
    },
    registerType: 'prompt',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
      runtimeCaching: [
        {
          // Keep dynamic API responses fresh while still leveraging cache on flaky networks.
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-network-first',
            expiration: {
              maxAgeSeconds: 60 * 60,
              maxEntries: 100,
            },
            networkTimeoutSeconds: 10,
          },
          urlPattern: '/api/.*',
        },
      ],
    },
  },
  // /** Public keys are overridden at runtime by `NUXT_PUBLIC_*` (see `.env.example`). */
  runtimeConfig: {
    public: {
      siteUrl: 'http://localhost:3000',
    },
  },
  security: {
    corsHandler: {
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      preflight: { statusCode: 204 },
    },
    enabled: !isDev,
    headers: {
      contentSecurityPolicy: {
        'base-uri': ["'none'"],
        'connect-src': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'manifest-src': ["'self'"],
        'object-src': ["'none'"],
        'script-src': ["'self'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'upgrade-insecure-requests': true,
        'worker-src': ["'self'"],
      },
      crossOriginEmbedderPolicy: 'credentialless',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin',
      permissionsPolicy: {
        camera: [],
        'display-capture': [],
        fullscreen: ['self'],
        geolocation: [],
        microphone: [],
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      strictTransportSecurity: {
        includeSubdomains: true,
        maxAge: 31536000,
        preload: true,
      },
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
    },
    hidePoweredBy: true,
    nonce: true,
    rateLimiter: {
      headers: true,
      interval: 300000,
      throwError: true,
      tokensPerInterval: 100,
    },
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2_000_000,
      maxUploadFileRequestInBytes: 8_000_000,
      throwError: true,
    },
    sri: true,
    strict: true,
  },
  site: {
    description: 'Welcome to Nuxt Essentials!',
    name: 'Nuxt Essentials',
    url: 'https://nuxt-essentials.com',
  },
  vite: {
    plugins: [ViteYaml()],
  },
})
