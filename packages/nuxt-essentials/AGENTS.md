# @hornet_security-test/nuxt-essentials

## Context

The foundational Nuxt layer that provides **shared modules, configuration, and utilities** for all HornetSecurityTest applications. It is the base of the layer chain and is never consumed directly by end users — only by other packages/apps via `extends`.

## Architecture

- **Type:** Nuxt 4 layer (base layer in the extension chain)
- **Role:** Module aggregator + shared utilities + i18n infrastructure + security
- **Consumed by:** `@hornet_security-test/ui` (directly), `@hornet_security-test/web` (transitively via UI)

### Modules Provided

| Module           | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `@nuxt/eslint`   | ESLint integration (standalone: false)     |
| `@nuxtjs/i18n`   | Internationalization                       |
| `@nuxtjs/seo`    | SEO meta, sitemap, robots                  |
| `@pinia/nuxt`    | State management                           |
| `@vite-pwa/nuxt` | Progressive Web App                        |
| `@vueuse/nuxt`   | VueUse composables auto-import             |
| `nuxt-security`  | Security headers, CSP, CORS, rate limiting |

### Security Configuration

The `nuxt-security` module is **disabled in development** (`enabled: !isDev`) to prevent DevTools/HMR conflicts. In production:

- **CSP:** Strict nonce-based `script-src`, no `unsafe-eval`
- **CORS:** Origin from `NUXT_PUBLIC_SITE_URL` env var
- **HSTS:** 1 year + preload + includeSubdomains
- **Rate limiting:** 100 requests / 5 min per IP
- **Request size:** 2MB body, 8MB uploads
- **SRI:** Subresource Integrity for scripts/styles
- **X-Frame-Options:** DENY

Override in consuming apps:

```ts
// apps/web/nuxt.config.ts
export default defineNuxtConfig({
  security: {
    headers: {
      contentSecurityPolicy: {
        'connect-src': ["'self'", 'https://api.example.com'],
      },
    },
  },
})
```

### Key Directories

```
app/
├── app.vue                -- Minimal demo template
├── error.vue              -- Global error boundary (404, 403, 500)
└── composables/
    └── store.ts           -- extractStore() Pinia helper

i18n/
├── locales/
│   └── fr-FR/             -- Base locale translations
│       ├── index.ts       -- Locale entry point
│       ├── translations.yaml
│       └── namespace.json
└── utils/
    ├── namespace.ts       -- getMessagesWithNamespace(), prefixKeys()
    └── coverage.ts        -- i18n coverage CLI tool

test/
├── composables/           -- Tests for extractStore
└── i18n/utils/            -- Tests for namespace + coverage utilities
```

### Aliases

- `~nuxt-essentials` resolves to this package root (configured in `nuxt.config.ts`)
- Used by downstream packages: `import { x } from '~nuxt-essentials/i18n/utils/namespace'`

## Conventions

### i18n

- Default locale: `fr-FR` (apps override with additional locales)
- File named `translations.yaml` → keys are unprefixed
- Any other file → keys prefixed with filename: `{namespace}:{key}`
- `getMessagesWithNamespace()` handles async loading + prefix logic
- YAML and JSON both supported for translation files

### State Management

- Pinia is configured but no stores are defined here
- `extractStore()` wraps a Pinia store with `storeToRefs` via Proxy for ergonomic destructuring
- Stores should be defined in the consuming app/package

### PWA

- Register type: `prompt` (user chooses when to install)
- API caching: NetworkFirst for `/api/*` (10s network timeout, 1h cache)
- Override PWA settings in consuming app's `nuxt.config.ts` (see `docs/pwa-overrides.md`)

### Error Handling

- `error.vue` provides a global error boundary for 404, 403, and generic errors
- Uses `clearError({ redirect: '/' })` to recover
- Styled with design system tokens for consistency

## Dos

- Add new shared Nuxt modules here (not in UI or web)
- Keep the i18n coverage CLI (`hornet_security-test-i18n-coverage`) functional for all packages
- Test i18n utilities thoroughly (flatten, namespace, coverage math)
- Document PWA/security overrides in `docs/`
- Run `pnpm mutation` to validate test quality for composables

## Don'ts

- Don't define UI components here — they belong in `@hornet_security-test/ui`
- Don't add app-specific logic — this is infrastructure only
- Don't pin module versions in package.json — use `catalog:` from workspace
- Don't use `useState` for non-serializable data (use WeakMap pattern like `useToast`)
- Don't set `security.enabled: true` in dev — it breaks DevTools

## Testing Strategy

- **Unit tests:** Vitest in Node environment
- **Mutation testing:** Stryker (incremental) on `i18n/utils` and `app/composables`
- **Coverage:** Restricted to `i18n/utils/**/*.ts` and `app/composables/**/*.ts`
- **Fixtures:** `test/i18n/utils/__fixtures__/` contains sample locale directories

## Common Pitfalls

- `@ts-expect-error` on `pwa` config is intentional — `@vite-pwa/nuxt` types are incomplete
- `@modyfi/vite-plugin-yaml` must be added to both `vite.plugins` AND `nitro.rollupConfig.plugins`
- `eslint.config.standalone: false` means ESLint defers to the consuming project's config
- The `app.vue` here is a demo fixture, not production UI — consuming apps override it
- `yaml.d.ts` declares YAML imports as `Record<string, string>` (flat) — runtime flattening happens in coverage.ts
- Security is disabled in dev (`NODE_ENV !== 'production'`) — test production security in CI/staging
