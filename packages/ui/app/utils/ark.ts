import { omit } from './object'

/**
 * Strips UI-specific keys (e.g. `ui`) from `useAttrs()` so the remaining
 * attributes can be safely forwarded to an Ark UI root element.
 *
 * @example
 * const arkAttrs = computed(() => splitArkAttrs(useAttrs()))
 * // then: v-bind="arkAttrs"
 */
export function splitArkAttrs(
  attrs: Record<string, unknown>,
  exclude: string[] = ['ui'],
): Record<string, unknown> {
  return omit(attrs as Record<string, unknown>, exclude as (keyof typeof attrs)[])
}
