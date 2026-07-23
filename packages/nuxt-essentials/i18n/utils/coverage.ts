/// <reference types="node" />

import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { consola } from 'consola'
import { colorize } from 'consola/utils'
import esMain from 'es-main'
import minimist, { type ParsedArgs } from 'minimist'
import { parse as parseYaml } from 'yaml'

interface Argv extends ParsedArgs {
  f?: string
  ns?: boolean
  k?: boolean
  keys?: boolean
  '--'?: string[]
}

const localeLabels: Record<string, string> = {
  'en-US': 'English',
  'fr-FR': 'Francais',
}

const treeCharacters = {
  CHILD: '├── ',
  DIRECTORY: '│   ',
  EMPTY: '    ',
  LAST_CHILD: '└── ',
} as const

type Messages = Record<string, string>
type RawMessages = Record<string, unknown>
type MessagesByLocale = Record<string, Messages>
type CoverageData = {
  data: { total: number }
  locale: Record<
    string,
    { percentage: number; count: number; missing: number; missingKeys: string[] }
  >
}

const hasSupportedExtension = (filename: string) => /\.(json|ya?ml)$/i.test(filename)

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const flattenMessages = (messages: RawMessages): Messages => {
  const flattened: Messages = {}
  const stack: Array<{ path: string; value: unknown }> = Object.entries(messages).map(
    ([key, value]) => ({
      path: key,
      value,
    }),
  )

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) {
      continue
    }

    if (isPlainObject(current.value)) {
      for (const [nestedKey, nestedValue] of Object.entries(current.value)) {
        stack.push({
          path: `${current.path}.${nestedKey}`,
          value: nestedValue,
        })
      }
      continue
    }

    if (Array.isArray(current.value)) {
      for (let index = 0; index < current.value.length; index++) {
        stack.push({
          path: `${current.path}.${index}`,
          value: current.value[index],
        })
      }
      continue
    }

    flattened[current.path] = String(current.value ?? '')
  }

  return flattened
}

const parseTranslationFile = (filePath: string): Messages => {
  const raw = readFileSync(filePath, 'utf-8')
  const parsed: unknown = /\.json$/i.test(filePath) ? JSON.parse(raw) : parseYaml(raw)

  if (!isPlainObject(parsed)) {
    throw new Error(`Invalid translation content in '${filePath}'.`)
  }
  return flattenMessages(parsed)
}

export const getLocales = (localesPath: string): string[] =>
  readdirSync(localesPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

export const getLocaleNamespaces = ({
  localesPath,
  locale,
}: {
  localesPath: string
  locale: string
}): string[] =>
  readdirSync(join(localesPath, locale))
    .filter(hasSupportedExtension)
    .sort((a, b) => a.localeCompare(b))

type LocaleTree = Array<[string, string[]]>

export const getTreeStructure = ({
  localesPath,
  showNamespaces,
}: {
  localesPath: string
  showNamespaces?: boolean
}): LocaleTree => {
  const locales = getLocales(localesPath)

  const tree: LocaleTree = []

  for (const locale of locales) {
    tree.push([locale, []])

    if (showNamespaces) {
      const namespaces = getLocaleNamespaces({ locale, localesPath })
      tree[tree.length - 1]![1] = namespaces
    }
  }

  return tree
}

export const renderTreeStructure = ({
  tree,
  data,
  showKeys,
}: {
  tree: LocaleTree
  data?: CoverageData
  showKeys?: boolean
}): string[] => {
  const lines: string[] = ['.']

  for (const [locale, namespaces] of tree) {
    const isLocaleLast = tree[tree.length - 1]![0] === locale
    const localeConnector = isLocaleLast ? treeCharacters.LAST_CHILD : treeCharacters.CHILD
    const localeName = localeLabels[locale] ?? locale
    lines.push(`${localeConnector}${locale} (${localeName})`)

    const localeCoverage = data?.locale[locale]
    if (localeCoverage) {
      const coverageBgColor =
        localeCoverage.percentage >= 90
          ? 'bgGreen'
          : localeCoverage.percentage >= 50
            ? 'bgYellow'
            : 'bgRed'

      lines[lines.length - 1] +=
        ` ${colorize(coverageBgColor, ` ${colorize('bold', `${localeCoverage.percentage}%`)} `)}` +
        ` count: ${colorize('bold', String(localeCoverage.count))},` +
        ` missing: ${colorize('bold', colorize(localeCoverage.missing > 0 ? 'red' : 'green', String(localeCoverage.missing)))}`
    }

    const shouldRenderMissingKeys = Boolean(showKeys && localeCoverage?.missingKeys)

    for (let i = 0; i < namespaces.length; i++) {
      const folderConnector = isLocaleLast ? treeCharacters.EMPTY : treeCharacters.DIRECTORY
      const namespace = namespaces[i]!
      const isNamespaceLast = i === namespaces.length - 1 && !shouldRenderMissingKeys
      const connector = isNamespaceLast ? treeCharacters.LAST_CHILD : treeCharacters.CHILD
      lines.push(`${folderConnector}${connector}${namespace}`)
    }

    if (shouldRenderMissingKeys && localeCoverage) {
      const folderConnector = isLocaleLast ? treeCharacters.EMPTY : treeCharacters.DIRECTORY
      lines.push(
        `${folderConnector}${treeCharacters.LAST_CHILD}${colorize('gray', 'missing keys:')}`,
      )
      if (localeCoverage.missingKeys.length === 0) {
        const keyIndent = folderConnector + treeCharacters.EMPTY
        lines.push(`${keyIndent}${treeCharacters.LAST_CHILD}${colorize('green', '(none)')}`)
        continue
      }
      for (let i = 0; i < localeCoverage.missingKeys.length; i++) {
        const key = localeCoverage.missingKeys[i]!
        const isKeyLast = i === localeCoverage.missingKeys.length - 1
        const keyConnector = isKeyLast ? treeCharacters.LAST_CHILD : treeCharacters.CHILD
        const keyIndent = folderConnector + treeCharacters.EMPTY
        lines.push(`${keyIndent}${keyConnector}${colorize('red', key)}`)
      }
    }
  }

  return lines
}

export const getMessagesByLocaleWithNamespace = ({
  locales,
  localesPath,
}: {
  locales: string[]
  localesPath: string
}): MessagesByLocale => {
  const messagesByLocale: MessagesByLocale = {}

  for (const locale of locales) {
    const files = readdirSync(join(localesPath, locale)).filter(hasSupportedExtension)
    messagesByLocale[locale] = {}

    for (const file of files) {
      const namespace = file.replace(/\.(json|ya?ml)$/i, '')
      const messages = parseTranslationFile(join(localesPath, locale, file))

      for (const key of Object.keys(messages)) {
        if (namespace === 'translations') {
          messagesByLocale[locale]![key] = messages[key]!
        } else {
          messagesByLocale[locale]![`${namespace}:${key}`] = messages[key]!
        }
      }
    }
  }

  return messagesByLocale
}

export const getUniqueMessageKeys = (messagesByLocale: MessagesByLocale): string[] => {
  const uniqueMessageKeys = new Set<string>()

  for (const locale of Object.keys(messagesByLocale)) {
    for (const key of Object.keys(messagesByLocale[locale]!)) {
      uniqueMessageKeys.add(key)
    }
  }

  return Array.from(uniqueMessageKeys).sort((a, b) => a.localeCompare(b))
}

export const getCoverageData = ({
  messagesByLocale,
  uniqueMessageKeys,
}: {
  messagesByLocale: MessagesByLocale
  uniqueMessageKeys: string[]
}): CoverageData => {
  const total = uniqueMessageKeys.length

  return {
    data: {
      total,
    },
    locale: Object.fromEntries(
      Object.entries(messagesByLocale).map(([locale, keys]) => {
        const count = Object.keys(keys).length
        const percentage = total === 0 ? 100 : Number(((count / total) * 100).toFixed(2))
        const localeKeys = new Set(Object.keys(keys))
        const missingKeys = uniqueMessageKeys.filter((key) => !localeKeys.has(key))
        return [
          locale,
          {
            count,
            missing: missingKeys.length,
            missingKeys,
            percentage,
          },
        ]
      }),
    ),
  }
}

export const renderCoverage = ({
  localesPath,
  showNamespaces,
  showKeys,
}: {
  localesPath: string
  showNamespaces?: boolean
  showKeys?: boolean
}): void => {
  const locales = getLocales(localesPath)
  consola.start(`Running coverage of locales: ${localesPath}`)

  if (locales.length === 0) {
    consola.warn('No locale directories found.')
    return
  }

  const messagesByLocale = getMessagesByLocaleWithNamespace({ locales, localesPath })
  const coverageData = getCoverageData({
    messagesByLocale,
    uniqueMessageKeys: getUniqueMessageKeys(messagesByLocale),
  })

  const treeRender = renderTreeStructure({
    data: coverageData,
    showKeys,
    tree: getTreeStructure({ localesPath, showNamespaces }),
  })

  consola.log('')
  consola.success(
    `Coverage of ${colorize('bold', String(coverageData.data.total))} unique translations`,
  )
  for (const line of treeRender) {
    consola.log(line)
  }
  consola.log('')
}

if (esMain(import.meta)) {
  const argv: Argv = minimist(process.argv.slice(2), {
    '--': true,
    alias: {
      k: 'keys',
    },
    boolean: ['ns', 'k', 'keys'],
  })

  if (!argv.f) {
    consola.error('Please provide a locales path with -f.')
    consola.error('Usage: pnpm i18n:coverage -- -f ./i18n/locales --ns -k')
    process.exit(1)
  }

  const passthroughArgs = argv['--'] ?? []
  const showNamespaces = Boolean(argv.ns || passthroughArgs.includes('--ns'))
  const showKeys = Boolean(
    argv.keys || argv.k || passthroughArgs.includes('--keys') || passthroughArgs.includes('--k'),
  )

  const localesPath = resolve(argv.f)
  renderCoverage({ localesPath, showKeys, showNamespaces })
}
