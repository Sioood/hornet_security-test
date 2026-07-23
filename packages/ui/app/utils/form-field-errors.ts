/** Standard Schema issue shape often returned by Zod `~standard` validators. */
export interface StandardSchemaIssueLike {
  message?: string
  path?: unknown
}

function isStandardSchemaIssueLike(v: unknown): v is StandardSchemaIssueLike {
  return typeof v === 'object' && v !== null && 'message' in v
}

function uniqueStringsPreserveOrder(parts: readonly string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of parts) {
    if (!p || seen.has(p)) continue
    seen.add(p)
    out.push(p)
  }
  return out
}

/** Flatten TanStack `meta.errors` for display; collapses duplicate messages (e.g. change + blur). */
export function formatFieldErrors(errors: readonly unknown[]): string {
  const parts: string[] = []
  const stack: unknown[] = []
  for (let i = errors.length - 1; i >= 0; i--) stack.push(errors[i])

  while (stack.length > 0) {
    const item = stack.pop()
    if (item === null || item === undefined) continue
    if (typeof item === 'string') {
      parts.push(item)
      continue
    }
    if (Array.isArray(item)) {
      for (let i = item.length - 1; i >= 0; i--) stack.push(item[i])
      continue
    }
    if (typeof item === 'object' && 'message' in item) {
      const msg = (item as { message: unknown }).message
      if (typeof msg === 'string') {
        parts.push(msg)
        continue
      }
    }
    if (isStandardSchemaIssueLike(item) && typeof item.message === 'string') {
      parts.push(item.message)
    }
  }

  return uniqueStringsPreserveOrder(parts).join(', ')
}
