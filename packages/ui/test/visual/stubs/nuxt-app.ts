import type { AnchorHTMLAttributes } from 'vue'

export type NuxtLinkProps = AnchorHTMLAttributes & {
  to?: string | Record<string, unknown>
  href?: string
  external?: boolean
  target?: string
  rel?: string
  custom?: boolean
}
