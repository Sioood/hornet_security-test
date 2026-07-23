export type BookSpineIntent = 'accent' | 'info' | 'neutral' | 'primary' | 'secondary' | 'warning'

export interface BookSpineClasses {
  background: string
  text: string
}

export interface BookSpineStyle {
  classes: BookSpineClasses
  heightRem: number
  intent: BookSpineIntent
  titleMaxWidthPx: number
  widthRem: number
}

const SPINE_INTENTS: readonly BookSpineIntent[] = [
  'primary',
  'accent',
  'secondary',
  'neutral',
  'info',
  'warning',
]

const SPINE_INTENT_CLASSES: Record<BookSpineIntent, BookSpineClasses> = {
  accent: {
    background: 'bg-accent-fill',
    text: 'text-accent-on-fill',
  },
  info: {
    background: 'bg-info-fill',
    text: 'text-info-on-fill',
  },
  neutral: {
    background: 'bg-neutral-fill',
    text: 'text-neutral-on-fill',
  },
  primary: {
    background: 'bg-primary-fill',
    text: 'text-primary-on-fill',
  },
  secondary: {
    background: 'bg-secondary-fill',
    text: 'text-secondary-on-fill',
  },
  warning: {
    background: 'bg-warning-fill',
    text: 'text-warning-on-fill',
  },
}

function seededUnit(seed: number, stream: number): number {
  const value = Math.sin(seed * 12.9898 + stream * 78.233) * 43_758.5453
  return value - Math.floor(value)
}

export function getBookSpineStyle(bookId: number): BookSpineStyle {
  const intent =
    SPINE_INTENTS[Math.floor(seededUnit(bookId, 1) * SPINE_INTENTS.length)] ?? 'primary'
  const widthRem = 1.35 + seededUnit(bookId, 2) * 1.55
  const heightRem = 8.75 + seededUnit(bookId, 3) * 5.25

  return {
    classes: SPINE_INTENT_CLASSES[intent],
    heightRem: Math.round(heightRem * 100) / 100,
    intent,
    titleMaxWidthPx: Math.round(heightRem * 0.9 * 16),
    widthRem: Math.round(widthRem * 100) / 100,
  }
}
