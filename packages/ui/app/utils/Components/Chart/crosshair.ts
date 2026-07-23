import { omitUndefinedValues, pickDefined } from '@/utils/object'

import type { ChartCrosshairProps } from '@/utils/Components/Chart/context'
import type { CrosshairConfigInterface } from '@unovis/ts'

const CHART_CROSSHAIR_PROP_KEYS = [
  'x',
  'y',
  'color',
  'strokeColor',
  'strokeWidth',
  'yStacked',
  'baseline',
  'template',
  'hideWhenFarFromPointer',
  'hideWhenFarFromPointerDistance',
  'snapToData',
  'getCircles',
  'onCrosshairMove',
  'forceShowAt',
  'skipRangeCheck',
  'id',
  'xScale',
  'yScale',
  'excludeFromDomainCalculation',
  'duration',
  'events',
  'attributes',
] as const satisfies readonly (keyof CrosshairConfigInterface<Record<string, unknown>>)[]

export function buildChartCrosshairVisBind<T extends Record<string, unknown>>(
  props: ChartCrosshairProps<T>,
): CrosshairConfigInterface<T> {
  return omitUndefinedValues({
    ...pickDefined(props, CHART_CROSSHAIR_PROP_KEYS),
    // Crosshair `x` is the category/time accessor; it must not widen the value axis in horizontal charts.
    excludeFromDomainCalculation: props.excludeFromDomainCalculation ?? true,
  }) as CrosshairConfigInterface<T>
}
