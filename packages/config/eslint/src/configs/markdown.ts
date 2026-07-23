import { pluginMarkdown } from '../plugins.ts'
import { defineConfig } from '../types.ts'

/**
 * Markdown fenced blocks become virtual files (`README.md/0_0.js`, `doc.md/1_0.json`, …).
 * JSON examples in docs are often illustrative (comments, multiple root objects) and are not
 * valid single-file JSON/JSONC — the default TS/JS pipeline then reports "Unexpected token '{'".
 */
const MARKDOWN_EMBEDDED_JSON_GLOBS = [
  '**/*.md/*.json',
  '**/*.md/**/*.json',
  '**/*.md/*.jsonc',
  '**/*.md/**/*.jsonc',
  '**/*.md/*.json5',
  '**/*.md/**/*.json5',
] as const

export const markdown = defineConfig([
  ...pluginMarkdown.configs.recommended,
  {
    ignores: [...MARKDOWN_EMBEDDED_JSON_GLOBS],
  },
])
