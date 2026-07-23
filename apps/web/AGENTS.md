# @hornet_security-test/web

## Context

The main Nuxt 4 web application. It is a **thin shell** that extends `@hornet_security-test/ui` (which transitively extends `@hornet_security-test/nuxt-essentials`). All shared UI components, modules, and utilities come from the layers below.

## Architecture

- **Framework:** Nuxt 4 (Vue 3, Nitro server)
- **Layer chain:** `web` → `ui` → `nuxt-essentials`
- **Entry:** `app/app.vue`
- **No server routes yet** — API integration will use `useFetchServerData` from nuxt-essentials when backend is added

### What This App Owns

- App-level `nuxt.config.ts` overrides (locales, runtimeConfig, site URL, security overrides)
- i18n locale files (`i18n/locales/fr-FR/`, `i18n/locales/en-US/`)
- E2E tests (`e2e/`)
- Pages (when added: `app/pages/`)
- App-specific composables/components (when needed)

### What Comes From Layers

- All `UI*` components (from `@hornet_security-test/ui`)
- Tailwind theme, fonts, icons, image optimization (from `@hornet_security-test/ui`)
- Pinia, i18n, SEO, PWA, VueUse, security modules (from `@hornet_security-test/nuxt-essentials`)
- `extractStore` composable (from `@hornet_security-test/nuxt-essentials`)
- `getMessagesWithNamespace` i18n utility (from `@hornet_security-test/nuxt-essentials`)
- Error boundary `error.vue` (from `@hornet_security-test/nuxt-essentials`)

## Conventions

### Components

- Use `UI` prefix for layer components: `<UIButton>`, `<UIMenu>`, `<UIAlert>`
- App-specific components go in `app/components/` (no prefix needed)
- Use `<NuxtImg>` for all images (auto-optimized via `@nuxt/image`)

### i18n

- Default locale: `fr-FR`
- Supported: `fr-FR`, `en-US`
- Translations in YAML: `i18n/locales/{locale}/translations.yaml`
- Namespace files: `i18n/locales/{locale}/{namespace}.json` → accessed as `$t('namespace:key')`
- Run `pnpm i18n:coverage` to check translation completeness

### API Calls

- Use `useFetchServerData` for API calls (when backend is available)
- PWA caches `/api/*` with NetworkFirst strategy (10s timeout, 1h expiration)

### Security

- Security headers inherited from `nuxt-essentials` (disabled in dev)
- Override per-route via `routeRules` or globally in `nuxt.config.ts`
- Set `NUXT_PUBLIC_SITE_URL` env var for production CORS origin

## Dos

- Keep this app thin — shared logic belongs in packages
- Add new locales to both `nuxt.config.ts` `i18n.locales` AND `i18n/locales/{locale}/index.ts`
- Write E2E tests in `e2e/` for critical user flows
- Use `runtimeConfig.public` for client-side env vars
- Use discriminated unions + `assertNever` for complex state handling

## Don'ts

- Don't duplicate components that exist in `@hornet_security-test/ui`
- Don't install modules already provided by layers (check `nuxt-essentials/nuxt.config.ts`)
- Don't hardcode URLs — use `runtimeConfig.public.siteUrl`
- Don't use raw `<img>` — use `<NuxtImg>` for optimization

## Testing Strategy

- **E2E:** Playwright (`pnpm test:e2e`) — tests run against a built preview server
- **Unit/Component:** Inherited from UI package for shared components
- **CI:** E2E runs after build in GitHub Actions

## Key Files

- `nuxt.config.ts` — app config, layer extension, locale setup
- `app/app.vue` — root component
- `i18n/locales/` — translation files
- `e2e/` — Playwright test specs
- `playwright.config.ts` — E2E configuration
