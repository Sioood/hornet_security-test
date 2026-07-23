import type { Linter } from 'eslint'

export type Awaitable<T> = T | Promise<T>

export type Rules = Record<string, Linter.RuleEntry<unknown[]> | undefined>

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Linter.Config

export interface OptionsHasTypeScript {
  hasTypescript?: boolean
  tsconfigRootDir?: string
}

export interface OptionsConfig {
  /**
   * Enable oxlint support.
   * Can be a boolean, a path to a config file, or a config object.
   *
   * @default true
   */
  oxlint?: boolean | string | Record<string, unknown>

  /**
   * Enable typescript support.
   *
   * @default true
   */
  typescript?: boolean

  /**
   * Absolute path to the directory containing the tsconfig.json.
   * Required in monorepos with ESLint v10+ to avoid multi-root ambiguity.
   */
  tsconfigRootDir?: string

  /**
   * Enable imports support.
   *
   * @default true
   */
  imports?: boolean

  /**
   * Enable vue support.
   *
   * @default false
   */
  vue?: boolean

  /**
   * Enable jsonc support.
   *
   * @default true
   */
  jsonc?: boolean

  /**
   * Enable yml support.
   *
   * @default true
   */
  yml?: boolean

  /**
   * Enable markdown support.
   *
   * @default true
   */
  markdown?: boolean
}

export type FlatConfig = TypedFlatConfigItem
export type FlatConfigs = FlatConfig[]

export function defineConfig(config: FlatConfig | FlatConfigs): FlatConfigs {
  return Array.isArray(config) ? config : [config]
}
