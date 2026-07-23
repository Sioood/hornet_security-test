# PWA Overrides Cookbook

`@hornet_security-test/nuxt-essentials` enables PWA by default through `@vite-pwa/nuxt`.
Each app extending this layer can still override or disable any option in its own `nuxt.config.ts`.

## 1) Disable PWA for internal/admin apps

Use this when installability and offline support are not needed.

```ts
export default defineNuxtConfig({
  extends: ['../../packages/ui'],
  pwa: {
    disable: true,
  },
})
```

## 2) Customize app manifest per app

Use this for app-specific branding and install metadata.

```ts
export default defineNuxtConfig({
  extends: ['../../packages/ui'],
  pwa: {
    manifest: {
      name: 'HornetSecurityTest Backoffice',
      short_name: 'Backoffice',
      description: 'Internal administration portal',
      theme_color: '#0f172a',
      background_color: '#ffffff',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },
})
```

## 3) Override caching for dynamic endpoints

Use this for per-app runtime behavior without changing the shared defaults.

```ts
export default defineNuxtConfig({
  extends: ['../../packages/ui'],
  pwa: {
    workbox: {
      runtimeCaching: [
        {
          urlPattern: '/api/.*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-network-first',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 15,
            },
          },
        },
        {
          urlPattern: '/images/.*',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'images-swr',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
      ],
    },
  },
})
```

## Notes

- Favor `NetworkFirst` for frequently changing API data to avoid stale screens.
- Keep broad offline-first strategies limited to static assets unless there is a strong product need.
- Keep `pwa.client.installPrompt` enabled only when you plan to provide a dedicated install UX.
- `navigateFallback` is intentionally omitted from the shared defaults — Nuxt SSR apps do not precache `/` as a static shell, which causes Workbox `non-precached-url` errors.
