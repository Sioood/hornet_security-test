type Messages = Record<string, string>
type NamespaceFiles = Record<string, () => Promise<Messages | { default: Messages }>>

export const prefixKeys = (prefix: string, obj: Messages) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [`${prefix}:${key}`, value]))

const normalizeMessages = (name: string, data: Messages | { default: Messages }): Messages => {
  if (typeof data === 'object' && data !== null && 'default' in data) {
    const inner = data.default
    if (typeof inner === 'object' && inner !== null) return inner as Messages
    throw new Error(`Namespace "${name}" has invalid default export`)
  }
  return data as Messages
}

export const getMessagesWithNamespace = async (files: NamespaceFiles) => {
  const entries = Object.entries(files)

  const messagesArray = await Promise.all(
    entries.map(async ([name, loadFn]) => {
      const loaded = await loadFn()
      const messages = normalizeMessages(name, loaded)
      return name === 'translations' ? messages : prefixKeys(name, messages)
    }),
  )

  return Object.assign({}, ...messagesArray) as Messages
}
