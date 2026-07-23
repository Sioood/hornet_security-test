// Classic `zod` entry runs `config(en())` when first loaded. Import it before applying
// i18n locale so a later `import { z } from 'zod'` in a chunk cannot overwrite French.
import 'zod'
import { config } from 'zod/v4/core'
import * as zLocales from 'zod/v4/locales'

type LocalePack = (typeof zLocales)['en']

/** BCP 47 tags that map to a non–ISO-639-1 Zod locale export (e.g. `frCA`, not `fr`). */
const SPECIAL: Record<string, keyof typeof LANG> = {
  'fr-CA': 'frCA',
}

/** Add entries when new `i18n.locales` are added to the app. */
const LANG = {
  en: zLocales.en,
  fr: zLocales.fr,
  frCA: zLocales.frCA,
} as const satisfies Record<string, LocalePack>

/** Map vue-i18n locale codes (BCP 47) to Zod’s built-in `zod/locales` packs. */
export function applyZodLocaleFromI18n(i18nLocale: string) {
  const tag = i18nLocale.trim().replaceAll('_', '-')
  const specialKey = SPECIAL[tag]
  const langKey = (tag.split('-')[0]?.toLowerCase() ?? 'en') as keyof typeof LANG
  const factory = (specialKey ? LANG[specialKey] : LANG[langKey]) ?? LANG.en
  config(factory())
}
