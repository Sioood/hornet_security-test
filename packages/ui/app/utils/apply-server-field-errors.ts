/**
 * Map API / server validation errors onto TanStack Form field meta.
 * Call after a failed submit (e.g. HTTP 422) to surface messages per field.
 */
export function applyServerFieldErrors(
  form: {
    setFieldMeta: (field: string, updater: (prev: unknown) => Record<string, unknown>) => void
  },
  errors: Record<string, string | string[] | undefined>,
): void {
  for (const [path, message] of Object.entries(errors)) {
    if (message === undefined) continue
    const list = (Array.isArray(message) ? message : [message]).filter(Boolean)
    if (list.length === 0) continue
    form.setFieldMeta(path, (prev) => {
      const base = typeof prev === 'object' && prev !== null ? { ...prev } : {}
      return { ...base, errors: list }
    })
  }
}
