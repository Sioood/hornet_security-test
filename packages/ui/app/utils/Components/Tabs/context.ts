import type { NuxtLinkProps } from '#app'
import type {
  SegmentedIntent,
  SegmentedOrientation,
  SegmentedSize,
  SegmentedVariant,
} from '../Segmented/variants'
import type { InjectionKey, Ref } from 'vue'

export type TabsIntent = SegmentedIntent
export type TabsSize = SegmentedSize
/** @lintignore Public tabs orientation alias */
export type TabsOrientation = SegmentedOrientation
export type TabsVariant = SegmentedVariant

/** Layout of icon + label inside each tab trigger (`stacked` = icon above label). */
export type TabsTriggerLayout = 'inline' | 'stacked'

export interface TabsContext {
  intent: Ref<TabsIntent>
  size: Ref<TabsSize>
  orientation: Ref<TabsOrientation>
  variant: Ref<TabsVariant>
  triggerLayout: Ref<TabsTriggerLayout>
}

export const tabsChromeKey: InjectionKey<TabsContext> = Symbol('tabsChrome')

export interface UITabOption {
  disabled?: boolean
  value: string
  label?: string
  /** When `true`, the text label is not rendered (icon-only triggers). */
  hideLabel?: boolean
  /** Tabler icon name (e.g. `tabler:home`). Rendered before the label when using the `options` prop. */
  icon?: string
  /** Renders the trigger as a `NuxtLink` (`TabTrigger` uses `asChild`). For router-driven tabs. */
  to?: NuxtLinkProps['to']
  /** Overrides root `triggerLayout` for this option. */
  triggerLayout?: TabsTriggerLayout
}
