import type {
  AxisConfigInterface,
  CrosshairConfigInterface,
  SingleContainerConfigInterface,
  TooltipConfigInterface,
  XYContainerConfigInterface,
} from '@unovis/ts'
import type { ClassValue } from 'vue'

export type ChartIntent = 'multicolor' | 'neutral' | 'primary' | 'secondary' | 'accent'
export type ChartSize = 'sm' | 'md' | 'lg'
export type ChartAxisType = 'x' | 'y'
export type ChartAxisVariant = 'default' | 'dashed'

export type ChartLegendSide = 'top' | 'right' | 'bottom' | 'left'
export type ChartLegendAlign = 'start' | 'center' | 'end'

/** e.g. `top`, `top-start`, `bottom-center`, `left`, `right-end` */
export type ChartLegendPlacement = ChartLegendSide | `${ChartLegendSide}-${ChartLegendAlign}`

export interface ChartLegendSeries {
  key: string
  label: string
  color?: string
}

/** Shared layout props for composite chart components (`UIChartStackedBar`, `UIChartDonut`, …). */
export interface ChartShellProps {
  height?: number
  width?: number | string
  ariaLabel?: string | null
  intent?: ChartIntent | { axis: ChartIntent; data: ChartIntent }
  size?: ChartSize
  legend?: ChartLegendConfig
  tooltip?: ChartTooltipProps
  valueFormatter?: (value: number, seriesItem: ChartLegendSeries) => string
}

export interface UIChartXYContainerSlots {
  root?: ClassValue
}

export interface UIChartSingleContainerSlots {
  root?: ClassValue
}

export interface UIChartCrosshairSlots {
  root?: ClassValue
}

export interface UIChartTooltipSlots {
  root?: ClassValue
}

export interface UIChartLegendSlots {
  root?: ClassValue
  item?: ClassValue
  swatch?: ClassValue
}

export interface UIChartStackedBarSlots {
  root?: ClassValue
  legend?: ClassValue
  chart?: ClassValue
}

export interface UIChartDonutSlots {
  root?: ClassValue
  legend?: ClassValue
  chart?: ClassValue
}

export interface UIChartAxisSlots {
  root?: ClassValue
}

export interface ChartXYContainerProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends /* @vue-ignore */ XYContainerConfigInterface<T> {
  data?: T[]
  ui?: Partial<UIChartXYContainerSlots>
}

export interface ChartSingleContainerProps<T = unknown>
  extends /* @vue-ignore */ SingleContainerConfigInterface<T> {
  data?: T[]
  ui?: Partial<UIChartSingleContainerSlots>
}

/**
 * https://unovis.dev/docs/auxiliary/Crosshair
 *
 * When using `yStacked` (stacked bar/area), you must also set `x` — otherwise Unovis
 * will not use the container’s inferred x accessor and the crosshair will not track hover.
 *
 * `excludeFromDomainCalculation` defaults to `true` in `buildChartCrosshairVisBind` so the
 * crosshair category accessor does not pollute the value axis domain on horizontal charts.
 *
 * Unovis crosshair lines are vertical (X-snapped) only. `UIChartStackedBar` disables crosshair
 * when `orientation="horizontal"` and uses bar-row tooltip triggers instead.
 */
export interface ChartCrosshairProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends /* @vue-ignore */ CrosshairConfigInterface<T> {
  show?: boolean
  ui?: Partial<UIChartCrosshairSlots>
}

/** https://unovis.dev/docs/auxiliary/Tooltip */
export interface ChartTooltipProps extends /* @vue-ignore */ TooltipConfigInterface {
  show?: boolean
  ui?: Partial<UIChartTooltipSlots>
}

export interface ChartAxisProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends /* @vue-ignore */ Omit<AxisConfigInterface<T>, 'type'> {
  show?: boolean
  ui?: Partial<UIChartAxisSlots>
}

export interface ChartAxesConfig<T extends Record<string, unknown> = Record<string, unknown>> {
  variant?: ChartAxisVariant
  x?: ChartAxisProps<T>
  y?: ChartAxisProps<T>
}

interface ChartLegendConfig {
  show?: boolean
  placement?: ChartLegendPlacement
  ui?: Partial<UIChartLegendSlots>
}
