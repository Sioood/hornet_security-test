import { omitUndefinedValues, pickDefined } from '@/utils/object'

import type { ChartAxisProps, ChartAxisType } from '@/utils/Components/Chart/context'
import type { AxisConfigInterface } from '@unovis/ts'

/** Keys forwarded from `ChartAxisProps` to `VisAxis` (excludes `show` and `ui`). */
const CHART_AXIS_OPTIONAL_PROP_KEYS = [
  'position',
  'fullSize',
  'label',
  'labelFontSize',
  'labelMargin',
  'labelTextFitMode',
  'labelTextTrimType',
  'labelColor',
  'gridLine',
  'tickLine',
  'domainLine',
  'minMaxTicksOnly',
  'minMaxTicksOnlyShowGridLines',
  'minMaxTicksOnlyWhenWidthIsLess',
  'tickFormat',
  'tickValues',
  'numTicks',
  'tickTextFitMode',
  'tickTextWidth',
  'tickTextSeparator',
  'tickTextForceWordBreak',
  'tickTextTrimType',
  'tickTextFontSize',
  'tickTextAlign',
  'tickTextColor',
  'tickTextAngle',
  'tickTextHideOverlapping',
  'tickPadding',
  'x',
  'y',
  'id',
  'color',
  'xScale',
  'yScale',
  'excludeFromDomainCalculation',
  'duration',
  'events',
  'attributes',
] as const satisfies readonly (keyof AxisConfigInterface<Record<string, unknown>>)[]

export function buildChartAxisVisBind<T extends Record<string, unknown>>(
  axisProps: ChartAxisProps<T>,
  type: ChartAxisType,
): AxisConfigInterface<T> {
  return omitUndefinedValues({
    type,
    ...pickDefined(axisProps, CHART_AXIS_OPTIONAL_PROP_KEYS),
  }) as AxisConfigInterface<T>
}
