# @hornet_security-test/nuxt-essentials

The foundational Nuxt layer providing shared modules, security, i18n, and PWA configuration for all HornetSecurityTest applications.

## Usage

Extend this package in your Nuxt layer or app:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@hornet_security-test/nuxt-essentials'],
})
```

## Scripts

| Script                         | Description                    |
| ------------------------------ | ------------------------------ |
| `pnpm test`                    | Run unit tests                 |
| `pnpm test:coverage`           | Tests with coverage            |
| `pnpm mutation`                | Mutation testing (Stryker)     |
| `pnpm i18n:coverage`           | Check translation completeness |
| `pnpm i18n:coverage:namespace` | Coverage per namespace         |

## Modules Included

| Module           |     Auto-configured      |
| ---------------- | :----------------------: |
| `@nuxtjs/i18n`   |  Default locale `fr-FR`  |
| `@nuxtjs/seo`    |    Site meta, sitemap    |
| `@pinia/nuxt`    |     State management     |
| `@vite-pwa/nuxt` |    Offline-first PWA     |
| `@vueuse/nuxt`   |   Composable utilities   |
| `nuxt-security`  | CSP, CORS, rate limiting |

## Security

Security is **disabled in development** to allow Nuxt DevTools. In production, the following protections are active:

| Protection      | Configuration                            |
| --------------- | ---------------------------------------- |
| CSP             | Nonce-based `script-src`, strict-dynamic |
| CORS            | Origin from `NUXT_PUBLIC_SITE_URL` env   |
| HSTS            | 1 year, preload, includeSubdomains       |
| Rate limiting   | 100 req / 5 min                          |
| Request size    | 2MB body, 8MB uploads                    |
| SRI             | Enabled for all assets                   |
| X-Frame-Options | DENY                                     |

### Override in Your App

```ts
// apps/web/nuxt.config.ts
export default defineNuxtConfig({
  security: {
    headers: {
      contentSecurityPolicy: {
        // Allow your API and CDN
        'connect-src': ["'self'", 'https://api.myapp.com'],
        'img-src': ["'self'", 'https://cdn.myapp.com', 'data:'],
      },
    },
    corsHandler: {
      origin: 'https://myapp.com',
    },
  },
})
```

## i18n

### Adding a Locale

1. Create `i18n/locales/{locale}/index.ts`
2. Add translations in `translations.yaml` or namespaced JSON files
3. Register in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  i18n: {
    locales: [
      { code: 'fr-FR', language: 'fr-FR', name: 'Français', file: 'fr-FR/index.ts' },
      { code: 'en-US', language: 'en-US', name: 'English', file: 'en-US/index.ts' },
    ],
  },
})
```

### Translation Files

```yaml
# i18n/locales/fr-FR/translations.yaml (unprefixed keys)
hello: Bonjour
goodbye: Au revoir
```

```jsonc
// i18n/locales/fr-FR/auth.json (prefixed as auth:key)
{ "login": "Connexion", "logout": "Déconnexion" }
```

Access: `$t('hello')`, `$t('auth:login')`

## Composables

### `extractStore()`

Ergonomic Pinia store destructuring with full reactivity:

```ts
const store = useMyStore()
const { count, doubled, increment } = extractStore(store)
// `count` and `doubled` are reactive refs
// `increment` is a plain function
```

## Error Handling

A global `error.vue` provides consistent error pages:

- **404** — "Page not found"
- **403** — "Access denied"
- **500** — "Something went wrong"

Override by placing your own `error.vue` in the consuming app's `app/` directory.

## Mutation Testing

```bash
pnpm mutation        # Run incremental mutation testing
pnpm mutation:open   # Same + opens HTML report
```

Targets: `i18n/utils/**/*.ts`, `app/composables/**/*.ts`
