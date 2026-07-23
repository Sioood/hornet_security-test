/**
 * Compile-time exhaustiveness check for discriminated unions.
 * Use in the `default` branch of a switch or the final `else` of an if-chain
 * to guarantee all union members are handled.
 *
 * @example
 * switch (entry.type) {
 *   case 'item': return handleItem(entry)
 *   case 'separator': return handleSeparator(entry)
 *   default: assertNever(entry)
 * }
 */
export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unhandled discriminated union member: ${JSON.stringify(value)}`)
}
