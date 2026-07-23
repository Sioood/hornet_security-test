import localTranslations from './translations.yaml'

import { getMessagesWithNamespace } from '~nuxt-essentials/i18n/utils/namespace'

export default defineI18nLocale(async () => {
  const localMessages = await getMessagesWithNamespace({
    translations: async () => localTranslations,
  })

  return Object.assign({}, localMessages)
})
