import { cva } from 'class-variance-authority'

import { parseChartLegendPlacement } from '@/utils/Components/Chart/legend-placement'

import type {
  ChartAxisVariant,
  ChartIntent,
  ChartLegendAlign,
  ChartLegendPlacement,
  ChartLegendSide,
  ChartSize,
} from './context'

const LEGEND_SIDES = [
  'top',
  'right',
  'bottom',
  'left',
] as const satisfies readonly ChartLegendSide[]
const LEGEND_ALIGNS = ['start', 'center', 'end'] as const satisfies readonly ChartLegendAlign[]

function legendAlignItems(align: ChartLegendAlign): string {
  return (
    {
      center: 'items-center',
      end: 'items-end',
      start: 'items-start',
    } as const
  )[align]
}

function chartRootPlacementClass(side: ChartLegendSide, align: ChartLegendAlign): string {
  switch (side) {
    case 'top':
      return `flex-col ${legendAlignItems(align)}`
    case 'bottom':
      return `flex-col-reverse ${legendAlignItems(align)}`
    case 'left':
      return `flex-row ${legendAlignItems(align)}`
    case 'right':
      return `flex-row-reverse ${legendAlignItems(align)}`
  }
}

function chartLegendPlacementClass(side: ChartLegendSide, align: ChartLegendAlign): string {
  const isVertical = side === 'left' || side === 'right'
  const direction = isVertical ? 'flex-col' : 'flex-row flex-wrap'
  if (isVertical) {
    // Cross-axis: nudge labels toward the chart (left → end, right → start in LTR).
    const crossAlign = side === 'right' ? 'items-start' : 'items-end'
    const mainAlign = (
      {
        center: 'justify-center',
        end: 'justify-end',
        start: 'justify-start',
      } as const
    )[align]
    return `flex ${direction} gap-x-5 gap-y-2 ${crossAlign} ${mainAlign}`
  }
  const mainAlign = (
    {
      center: 'justify-center',
      end: 'justify-end',
      start: 'justify-start',
    } as const
  )[align]
  return `flex ${direction} gap-x-5 gap-y-2 ${mainAlign}`
}

function buildLegendPlacementVariants(
  classFor: (side: ChartLegendSide, align: ChartLegendAlign) => string,
): Record<ChartLegendPlacement, string> {
  const variants = {} as Record<ChartLegendPlacement, string>
  for (const side of LEGEND_SIDES) {
    variants[side] = classFor(side, 'center')
    for (const align of LEGEND_ALIGNS) {
      if (align !== 'center') {
        variants[`${side}-${align}`] = classFor(side, align)
      }
    }
  }
  return variants
}

const chartRootPlacementVariants = buildLegendPlacementVariants(chartRootPlacementClass)
const chartLegendPlacementVariants = buildLegendPlacementVariants(chartLegendPlacementClass)

const chartTooltipCVA = cva('[--vis-tooltip-border-radius:0]', {
  variants: {
    intent: {
      accent:
        '[--vis-tooltip-background-color:var(--color-accent-surface)] [--vis-tooltip-border-color:transparent] [--vis-tooltip-text-color:var(--color-accent-text)]',
      multicolor:
        '[--vis-tooltip-background-color:var(--color-neutral-surface)] [--vis-tooltip-border-color:transparent] [--vis-tooltip-text-color:var(--color-neutral-text)]',
      neutral:
        '[--vis-tooltip-background-color:var(--color-neutral-surface)] [--vis-tooltip-border-color:transparent] [--vis-tooltip-text-color:var(--color-neutral-text)]',
      primary:
        '[--vis-tooltip-background-color:var(--color-primary-surface)] [--vis-tooltip-border-color:transparent] [--vis-tooltip-text-color:var(--color-primary-text)]',
      secondary:
        '[--vis-tooltip-background-color:var(--color-secondary-surface)] [--vis-tooltip-border-color:transparent] [--vis-tooltip-text-color:var(--color-secondary-text)]',
    } satisfies Record<ChartIntent, string>,
    size: {
      lg: 'txt-base [--vis-tooltip-padding:calc(var(--spacing)*1.5)_calc(var(--spacing)*3)]',
      md: 'txt-caption [--vis-tooltip-padding:var(--spacing)_calc(var(--spacing)*2)]',
      sm: 'txt-caption [--vis-tooltip-padding:calc(var(--spacing)*0.5)_var(--spacing)]',
    } satisfies Record<ChartSize, string>,
  },
})

const chartDonutCVA = cva('', {
  variants: {
    intent: {
      accent:
        '[--vis-donut-background-color:var(--color-accent-fill-subtle)] [--vis-donut-central-label-text-color:var(--color-accent-text)] [--vis-donut-central-sub-label-text-color:var(--color-accent-text-subtle)]',
      multicolor:
        '[--vis-donut-background-color:var(--color-neutral-fill-subtle)] [--vis-donut-central-label-text-color:var(--color-neutral-text)] [--vis-donut-central-sub-label-text-color:var(--color-neutral-text-subtle)]',
      neutral:
        '[--vis-donut-background-color:var(--color-neutral-fill-subtle)] [--vis-donut-central-label-text-color:var(--color-neutral-text)] [--vis-donut-central-sub-label-text-color:var(--color-neutral-text-subtle)]',
      primary:
        '[--vis-donut-background-color:var(--color-primary-fill-subtle)] [--vis-donut-central-label-text-color:var(--color-primary-text)] [--vis-donut-central-sub-label-text-color:var(--color-primary-text-subtle)]',
      secondary:
        '[--vis-donut-background-color:var(--color-secondary-fill-subtle)] [--vis-donut-central-label-text-color:var(--color-secondary-text)] [--vis-donut-central-sub-label-text-color:var(--color-secondary-text-subtle)]',
    } satisfies Record<ChartIntent, string>,
    size: {
      lg: '[--vis-donut-central-label-font-size:1.25rem] [--vis-donut-central-sub-label-font-size:0.875rem]',
      md: '[--vis-donut-central-label-font-size:1rem] [--vis-donut-central-sub-label-font-size:0.75rem]',
      sm: '[--vis-donut-central-label-font-size:0.875rem] [--vis-donut-central-sub-label-font-size:0.6875rem]',
    } satisfies Record<ChartSize, string>,
  },
})

const chartAxisCVA = cva('', {
  variants: {
    intent: {
      accent:
        '[--vis-axis-grid-color:var(--color-accent-border-subtle)] [--vis-axis-text-color:var(--color-accent-text)] [--vis-axis-tick-color:var(--color-accent-border-subtle)]',
      multicolor:
        '[--vis-axis-grid-color:var(--color-neutral-border-subtle)] [--vis-axis-text-color:var(--color-neutral-text)] [--vis-axis-tick-color:var(--color-neutral-border-subtle)]',
      neutral:
        '[--vis-axis-grid-color:var(--color-neutral-border-subtle)] [--vis-axis-text-color:var(--color-neutral-text)] [--vis-axis-tick-color:var(--color-neutral-border-subtle)]',
      primary:
        '[--vis-axis-grid-color:var(--color-primary-border-subtle)] [--vis-axis-text-color:var(--color-primary-text)] [--vis-axis-tick-color:var(--color-primary-border-subtle)]',
      secondary:
        '[--vis-axis-grid-color:var(--color-secondary-border-subtle)] [--vis-axis-text-color:var(--color-secondary-text)] [--vis-axis-tick-color:var(--color-secondary-border-subtle)]',
    } satisfies Record<ChartIntent, string>,
    variant: {
      dashed: '[--vis-axis-domain-line-dasharray:none] [--vis-axis-grid-line-dasharray:5_5]',
      default: '',
    } satisfies Record<ChartAxisVariant, string>,
  },
})

/** Layout of chart + legend wrapper from legend placement. */
const chartRootCVA = cva('flex w-full font-mono', {
  defaultVariants: {
    gap: 'md',
    legendPlacement: 'top',
  },
  variants: {
    gap: {
      lg: 'gap-4',
      md: 'gap-3',
      sm: 'gap-2',
    } satisfies Record<ChartSize, string>,
    intent: {
      accent:
        '[--vis-color0:var(--color-accent-300)] [--vis-color1:var(--color-accent-400)] [--vis-color2:var(--color-accent-500)] [--vis-color3:var(--color-accent-600)] [--vis-color4:var(--color-accent-700)] [--vis-color5:var(--color-accent-800)]',
      multicolor:
        '[--vis-color0:var(--color-blue-fill)] [--vis-color1:var(--color-red-fill)] [--vis-color2:var(--color-green-fill)] [--vis-color3:var(--color-purple-fill)] [--vis-color4:var(--color-yellow-fill)] [--vis-color5:var(--color-pink-fill)]',
      neutral:
        '[--vis-color0:var(--color-neutral-300)] [--vis-color1:var(--color-neutral-400)] [--vis-color2:var(--color-neutral-500)] [--vis-color3:var(--color-neutral-600)] [--vis-color4:var(--color-neutral-700)] [--vis-color5:var(--color-neutral-800)]',
      primary:
        '[--vis-color0:var(--color-primary-300)] [--vis-color1:var(--color-primary-400)] [--vis-color2:var(--color-primary-500)] [--vis-color3:var(--color-primary-600)] [--vis-color4:var(--color-primary-700)] [--vis-color5:var(--color-primary-800)]',
      secondary:
        '[--vis-color0:var(--color-secondary-300)] [--vis-color1:var(--color-secondary-400)] [--vis-color2:var(--color-secondary-500)] [--vis-color3:var(--color-secondary-600)] [--vis-color4:var(--color-secondary-700)] [--vis-color5:var(--color-secondary-800)]',
    } satisfies Record<ChartIntent, string>,
    legendPlacement: chartRootPlacementVariants,
  },
})

/** Legend item list layout from placement. */
export const chartLegendCVA = cva('', {
  defaultVariants: {
    legendPlacement: 'top',
    size: 'md',
  },
  variants: {
    legendPlacement: chartLegendPlacementVariants,
    size: {
      lg: 'txt-base',
      md: 'txt-caption',
      sm: 'txt-small',
    } satisfies Record<ChartSize, string>,
  },
})

function chartAxisThemeClasses(options: {
  intent: ChartIntent
  axisVariant?: ChartAxisVariant
}): string {
  return cn(
    chartAxisCVA({ intent: options.intent, variant: options.axisVariant ?? 'default' }),
    '[--vis-font-family:var(--font-mono)]',
  )
}

function chartTooltipThemeClasses(options: { intent: ChartIntent; size: ChartSize }): string {
  return chartTooltipCVA({ intent: options.intent, size: options.size })
}

export function chartDonutThemeClasses(options: { intent: ChartIntent; size: ChartSize }): string {
  return cn(
    chartDonutCVA({ intent: options.intent, size: options.size }),
    chartTooltipThemeClasses(options),
    '[--vis-font-family:var(--font-mono)]',
  )
}

/** Stacked bar: axis + tooltip theme tokens. */
export function chartThemeClasses(options: {
  intent: ChartIntent
  size: ChartSize
  axisVariant?: ChartAxisVariant
}): string {
  return cn(
    chartAxisThemeClasses({ axisVariant: options.axisVariant, intent: options.intent }),
    chartTooltipThemeClasses({ intent: options.intent, size: options.size }),
  )
}

export function chartLegendPlacementClasses({
  size,
  placement = 'top-end',
  intent = 'multicolor',
}: {
  placement: ChartLegendPlacement
  size: ChartSize
  intent: ChartIntent
}): { root: string; legend: string } {
  const { side, align } = parseChartLegendPlacement(placement)
  const placementKey: ChartLegendPlacement = align === 'center' ? side : `${side}-${align}`
  return {
    legend: chartLegendCVA({ legendPlacement: placementKey, size }),
    root: chartRootCVA({ intent, legendPlacement: placementKey }),
  }
}
