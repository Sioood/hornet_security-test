import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { consola } from 'consola'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import {
  getCoverageData,
  getLocaleNamespaces,
  getMessagesByLocaleWithNamespace,
  getTreeStructure,
  getUniqueMessageKeys,
  renderCoverage,
  renderTreeStructure,
} from '../../../i18n/utils/coverage'

const fixturesLocalesPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'i18n',
  'utils',
  '__fixtures__',
  'locales',
)

describe('getMessagesByLocaleWithNamespace', () => {
  it('throws when a YAML translation file is not an object', () => {
    const root = mkdtempSync(join(tmpdir(), 'stallning-i18n-bad-yaml-'))
    const localeDir = join(root, 'en-US')
    mkdirSync(localeDir)
    writeFileSync(join(localeDir, 'broken.yml'), 'null\n')
    try {
      expect(() =>
        getMessagesByLocaleWithNamespace({ locales: ['en-US'], localesPath: root }),
      ).toThrow(/Invalid translation content/)
    } finally {
      rmSync(root, { force: true, recursive: true })
    }
  })

  it('merges translations without prefix and namespaces json keys with prefix', () => {
    const messages = getMessagesByLocaleWithNamespace({
      locales: ['en-US'],
      localesPath: fixturesLocalesPath,
    })

    expect(messages['en-US']).toEqual({
      app: 'App title',
      hello: 'Hello from en',
      'ui:submit': 'Submit',
    })
    expect(Object.keys(messages['en-US']!).some((k) => k.includes('README'))).toBe(false)
  })

  it('loads multiple locales from fixtures with YAML and JSON mix', () => {
    const messages = getMessagesByLocaleWithNamespace({
      locales: ['en-US', 'fr-FR'],
      localesPath: fixturesLocalesPath,
    })

    expect(messages['en-US']).toMatchObject({
      hello: 'Hello from en',
      'ui:submit': 'Submit',
    })
    expect(messages['fr-FR']).toEqual({
      hello: 'Bonjour',
      'ui:submit': 'Envoyer',
    })
  })

  it('flattens nested YAML/JSON leaves and array entries', () => {
    const root = mkdtempSync(join(tmpdir(), 'stallning-i18n-nested-'))
    const localeDir = join(root, 'en-US')
    mkdirSync(localeDir)
    writeFileSync(
      join(localeDir, 'pwa.yaml'),
      [
        'offlineReady:',
        "  title: 'Offline ready'",
        "  description: 'Works offline'",
        'updateAvailable:',
        "  title: 'Update available'",
        "  description: 'Reload required'",
        "  reloadLabel: 'Reload'",
      ].join('\n'),
    )
    writeFileSync(
      join(localeDir, 'ui.json'),
      JSON.stringify({
        form: {
          fields: [
            {
              label: 'Name',
            },
          ],
        },
      }),
    )
    try {
      const messages = getMessagesByLocaleWithNamespace({ locales: ['en-US'], localesPath: root })

      expect(messages['en-US']).toMatchObject({
        'pwa:offlineReady.description': 'Works offline',
        'pwa:offlineReady.title': 'Offline ready',
        'pwa:updateAvailable.description': 'Reload required',
        'pwa:updateAvailable.reloadLabel': 'Reload',
        'pwa:updateAvailable.title': 'Update available',
        'ui:form.fields.0.label': 'Name',
      })
    } finally {
      rmSync(root, { force: true, recursive: true })
    }
  })
})

describe('getUniqueMessageKeys', () => {
  it('collects all unique keys across locales', () => {
    const messagesByLocale = {
      'en-US': { hello: 'Hello', 'ui:button': 'Button' },
      'fr-FR': { hello: 'Bonjour', 'ui:button': 'Bouton' },
    }

    const keys = getUniqueMessageKeys(messagesByLocale)
    expect(keys).toEqual(['hello', 'ui:button'])
  })

  it('deduplicates keys across locales', () => {
    const messagesByLocale = {
      'en-US': { shared: 'EN value' },
      'fr-FR': { shared: 'FR value' },
    }

    const keys = getUniqueMessageKeys(messagesByLocale)
    expect(keys).toHaveLength(1)
    expect(keys[0]).toBe('shared')
  })

  it('returns sorted keys', () => {
    const messagesByLocale = {
      'en-US': { alpha: 'a', beta: 'b', zebra: 'z' },
    }

    const keys = getUniqueMessageKeys(messagesByLocale)
    expect(keys).toEqual(['alpha', 'beta', 'zebra'])
  })

  it('handles empty input', () => {
    const messagesByLocale = {}
    const keys = getUniqueMessageKeys(messagesByLocale)
    expect(keys).toEqual([])
  })
})

describe('getCoverageData', () => {
  it('calculates correct percentage for full coverage', () => {
    const messagesByLocale = {
      'en-US': { hello: 'Hello', world: 'World' },
    }
    const uniqueKeys = ['hello', 'world']

    const data = getCoverageData({ messagesByLocale, uniqueMessageKeys: uniqueKeys })

    expect(data.data.total).toBe(2)
    expect(data.locale['en-US']!.percentage).toBe(100)
    expect(data.locale['en-US']!.count).toBe(2)
    expect(data.locale['en-US']!.missing).toBe(0)
    expect(data.locale['en-US']!.missingKeys).toEqual([])
  })

  it('calculates correct percentage for partial coverage', () => {
    const messagesByLocale = {
      'fr-FR': { hello: 'Bonjour' },
    }
    const uniqueKeys = ['hello', 'world']

    const data = getCoverageData({ messagesByLocale, uniqueMessageKeys: uniqueKeys })

    expect(data.locale['fr-FR']!.percentage).toBe(50)
    expect(data.locale['fr-FR']!.count).toBe(1)
    expect(data.locale['fr-FR']!.missing).toBe(1)
    expect(data.locale['fr-FR']!.missingKeys).toEqual(['world'])
  })

  it('handles multiple locales with different coverage', () => {
    const messagesByLocale = {
      'en-US': { hello: 'Hello', world: 'World' },
      'fr-FR': { hello: 'Bonjour' },
    }
    const uniqueKeys = ['hello', 'world']

    const data = getCoverageData({ messagesByLocale, uniqueMessageKeys: uniqueKeys })

    expect(data.locale['en-US']!.percentage).toBe(100)
    expect(data.locale['fr-FR']!.percentage).toBe(50)
  })

  it('handles empty locale', () => {
    const messagesByLocale = {
      empty: {},
    }
    const uniqueKeys = ['hello']

    const data = getCoverageData({ messagesByLocale, uniqueMessageKeys: uniqueKeys })

    expect(data.locale['empty']!.percentage).toBe(0)
    expect(data.locale['empty']!.count).toBe(0)
    expect(data.locale['empty']!.missing).toBe(1)
  })

  it('when unique key list is empty, total is zero and each locale reports 100%', () => {
    const data = getCoverageData({
      messagesByLocale: {
        'en-US': { bar: 'b', foo: 'a' },
      },
      uniqueMessageKeys: [],
    })

    expect(data.data.total).toBe(0)
    expect(data.locale['en-US']!.percentage).toBe(100)
    expect(data.locale['en-US']!.missing).toBe(0)
    expect(data.locale['en-US']!.missingKeys).toEqual([])
  })

  it('when there are no locales and no keys, total is zero', () => {
    const data = getCoverageData({
      messagesByLocale: {},
      uniqueMessageKeys: [],
    })

    expect(data.data.total).toBe(0)
    expect(Object.keys(data.locale)).toHaveLength(0)
  })
})

describe('getLocaleNamespaces', () => {
  it('lists only json/yaml translation files, sorted', () => {
    const ns = getLocaleNamespaces({ locale: 'en-US', localesPath: fixturesLocalesPath })
    expect(ns).toContain('translations.yaml')
    expect(ns).toContain('ui.json')
    expect(ns.some((f) => f.includes('README'))).toBe(false)
    const sorted = [...ns].sort((a, b) => a.localeCompare(b))
    expect(ns).toEqual(sorted)
  })
})

describe('getTreeStructure', () => {
  it('leaves namespace lists empty when showNamespaces is false', () => {
    const tree = getTreeStructure({ localesPath: fixturesLocalesPath, showNamespaces: false })
    expect(tree.length).toBeGreaterThan(0)
    expect(tree.every(([, namespaces]) => namespaces.length === 0)).toBe(true)
  })

  it('fills namespace filenames when showNamespaces is true', () => {
    const tree = getTreeStructure({ localesPath: fixturesLocalesPath, showNamespaces: true })
    const en = tree.find(([locale]) => locale === 'en-US')
    expect(en?.[1].length).toBeGreaterThan(0)
    expect(en?.[1].some((f) => f.includes('translations'))).toBe(true)
  })
})

describe('renderTreeStructure', () => {
  const sampleTree: ReturnType<typeof getTreeStructure> = [
    ['en-US', []],
    ['fr-FR', []],
  ]

  it('includes percentage in output for high coverage locale', () => {
    const lines = renderTreeStructure({
      data: {
        data: { total: 2 },
        locale: {
          'en-US': { count: 2, missing: 0, missingKeys: [], percentage: 92 },
        },
      },
      tree: sampleTree,
    })
    expect(lines.some((l) => l.includes('92%'))).toBe(true)
  })

  it('includes percentage and missing count for partial coverage locale', () => {
    const lines = renderTreeStructure({
      data: {
        data: { total: 2 },
        locale: {
          'en-US': { count: 1, missing: 1, missingKeys: ['a'], percentage: 75 },
        },
      },
      tree: [['en-US', []]],
    })
    expect(lines.some((l) => l.includes('75%'))).toBe(true)
    expect(lines.some((l) => l.includes('missing:'))).toBe(true)
  })

  it('includes percentage for low coverage locale', () => {
    const lines = renderTreeStructure({
      data: {
        data: { total: 2 },
        locale: {
          'en-US': { count: 1, missing: 1, missingKeys: ['x'], percentage: 30 },
        },
      },
      tree: [['en-US', []]],
    })
    expect(lines.some((l) => l.includes('30%'))).toBe(true)
  })

  it('prints missing keys when showKeys is true', () => {
    const lines = renderTreeStructure({
      data: {
        data: { total: 1 },
        locale: {
          'fr-FR': { count: 0, missing: 1, missingKeys: ['only.in.en'], percentage: 0 },
        },
      },
      showKeys: true,
      tree: [['fr-FR', []]],
    })
    expect(lines.some((l) => l.includes('only.in.en'))).toBe(true)
  })

  it('prints missing keys section with none when showKeys is true and locale is complete', () => {
    const lines = renderTreeStructure({
      data: {
        data: { total: 1 },
        locale: {
          'fr-FR': { count: 1, missing: 0, missingKeys: [], percentage: 100 },
        },
      },
      showKeys: true,
      tree: [['fr-FR', []]],
    })
    expect(lines.some((l) => l.includes('missing keys:'))).toBe(true)
    expect(lines.some((l) => l.includes('(none)'))).toBe(true)
  })
})

describe('renderCoverage', () => {
  let emptyLocalesDir: string

  beforeAll(() => {
    emptyLocalesDir = mkdtempSync(join(tmpdir(), 'stallning-i18n-empty-'))
  })

  afterAll(() => {
    rmSync(emptyLocalesDir, { force: true, recursive: true })
  })

  it('warns and skips rendering when no locale directories exist', () => {
    const warn = vi.spyOn(consola, 'warn').mockImplementation(() => {})
    const start = vi.spyOn(consola, 'start').mockImplementation(() => {})
    renderCoverage({ localesPath: emptyLocalesDir })
    expect(start).toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith('No locale directories found.')
    warn.mockRestore()
    start.mockRestore()
  })

  it('logs a tree for fixture locales', () => {
    const log = vi.spyOn(consola, 'log').mockImplementation(() => {})
    const start = vi.spyOn(consola, 'start').mockImplementation(() => {})
    const success = vi.spyOn(consola, 'success').mockImplementation(() => {})
    renderCoverage({ localesPath: fixturesLocalesPath, showNamespaces: true })
    expect(start).toHaveBeenCalled()
    expect(success).toHaveBeenCalled()
    expect(log.mock.calls.length).toBeGreaterThan(0)
    log.mockRestore()
    start.mockRestore()
    success.mockRestore()
  })
})
