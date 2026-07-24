import { getMessagesWithNamespace } from '~nuxt-essentials/i18n/utils/namespace'

import namespace from './namespace.json'
import translations from './translations.yaml'

export default defineI18nLocale(
  async () =>
    await getMessagesWithNamespace({
      namespace: async () => namespace,
      translations: async () => translations,
    }),
)
