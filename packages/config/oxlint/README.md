# @hornet_security-test/oxlint

Shared Oxlint config for the monorepo.

## Presets

| File                     | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| `base.oxlintrc.json`     | TypeScript + general JS rules                  |
| `vue.oxlintrc.json`      | Vue 3 Composition API (`<script setup>`) rules |
| `tailwind.oxlintrc.json` | Tailwind class linting (`oxlint-tailwindcss`)  |
| `.oxlintrc.json`         | Package entry (extends `base` only)            |

## Usage

Root (TypeScript / config only):

```json
{
  "extends": ["./node_modules/@hornet_security-test/oxlint/base.oxlintrc.json"]
}
```

Nuxt apps / layers (`nuxt-essentials`, `ui`, `web`):

```json
{
  "extends": [
    "./node_modules/@hornet_security-test/oxlint/base.oxlintrc.json",
    "./node_modules/@hornet_security-test/oxlint/vue.oxlintrc.json",
    "./node_modules/@hornet_security-test/oxlint/tailwind.oxlintrc.json"
  ],
  "settings": {
    "tailwindcss": { "entryPoint": "app/assets/css/main.css" }
  }
}
```

Paths in `extends` are resolved relative to the consuming `.oxlintrc.json`.

## Scripts

- `pnpm lint`: runs `oxlint`.
- `pnpm format`: formats files with `oxfmt`.
- `pnpm format:check`: validates formatting with `oxfmt`.
