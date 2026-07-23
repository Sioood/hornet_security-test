import { twMerge } from 'tailwind-merge'
import { normalizeClass, type ClassValue } from 'vue'

export function cn(...inputs: ClassValue[]) {
  const classes = inputs.map((i) => normalizeClass(i)).filter((s) => s.length > 0)
  return classes.length === 0 ? '' : twMerge(...classes)
}
