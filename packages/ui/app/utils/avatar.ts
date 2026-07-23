const DICEBEAR_NOTIONISTS_SVG = 'https://api.dicebear.com/9.x/notionists/svg'

export function getDiceBearNotionistsUrl(seed: string): string {
  return `${DICEBEAR_NOTIONISTS_SVG}?seed=${encodeURIComponent(seed)}`
}

export function getInitialsFromName(name: string | undefined | null): string {
  const trimmed = name?.trim()
  if (!trimmed) return ''
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase()
  return `${parts[0]!.charAt(0)}${parts.at(-1)!.charAt(0)}`.toUpperCase()
}

export function getAvatarSeedFromName(name: string | undefined | null): string {
  const trimmed = name?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : ''
}

export function getAnonymousAvatarFallbackText(): string {
  return '??'
}
