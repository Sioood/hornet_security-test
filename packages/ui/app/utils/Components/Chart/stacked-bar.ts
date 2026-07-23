import { omitUndefinedValues, pickDefined } from '@/utils/object'

import type { NumericAccessor, StackedBarConfigInterface } from '@unovis/ts'

const CHART_STACKED_BAR_VIS_PROP_KEYS = [
  'attributes',
  'barMaxWidth',
  'barMinHeight1Px',
  'barMinHeightZeroValue',
  'barPadding',
  'barWidth',
  'color',
  'cursor',
  'dataStep',
  'duration',
  'events',
  'excludeFromDomainCalculation',
  'id',
  'orientation',
  'roundedCorners',
  'xScale',
  'yScale',
] as const satisfies readonly (keyof Omit<
  StackedBarConfigInterface<Record<string, unknown>>,
  'x' | 'y'
>)[]

export interface ChartStackedBarVisPassthrough<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  attributes?: StackedBarConfigInterface<T>['attributes']
  barMaxWidth?: StackedBarConfigInterface<T>['barMaxWidth']
  barMinHeight1Px?: StackedBarConfigInterface<T>['barMinHeight1Px']
  barMinHeightZeroValue?: StackedBarConfigInterface<T>['barMinHeightZeroValue']
  barPadding?: StackedBarConfigInterface<T>['barPadding']
  barWidth?: StackedBarConfigInterface<T>['barWidth']
  color?: StackedBarConfigInterface<T>['color']
  cursor?: StackedBarConfigInterface<T>['cursor']
  dataStep?: StackedBarConfigInterface<T>['dataStep']
  duration?: StackedBarConfigInterface<T>['duration']
  events?: StackedBarConfigInterface<T>['events']
  excludeFromDomainCalculation?: StackedBarConfigInterface<T>['excludeFromDomainCalculation']
  id?: StackedBarConfigInterface<T>['id']
  orientation?: StackedBarConfigInterface<T>['orientation']
  roundedCorners?: StackedBarConfigInterface<T>['roundedCorners']
  xScale?: StackedBarConfigInterface<T>['xScale']
  yScale?: StackedBarConfigInterface<T>['yScale']
}

export type ChartStackedBarVisPassthroughProps<T extends Record<string, unknown>> = Pick<
  ChartStackedBarVisPassthrough<T>,
  (typeof CHART_STACKED_BAR_VIS_PROP_KEYS)[number]
>

export function pickChartStackedBarVisProps<T extends Record<string, unknown>>(
  source: ChartStackedBarVisPassthrough<T>,
): ChartStackedBarVisPassthroughProps<T> {
  return pickDefined(
    source,
    CHART_STACKED_BAR_VIS_PROP_KEYS,
  ) as ChartStackedBarVisPassthroughProps<T>
}

export function buildChartStackedBarVisBind<T extends Record<string, unknown>>(options: {
  passthrough: ChartStackedBarVisPassthroughProps<T>
  x: NumericAccessor<T>
  y: NumericAccessor<T>[]
  color?: StackedBarConfigInterface<T>['color']
}): StackedBarConfigInterface<T> {
  const { passthrough, x, y, color } = options
  return omitUndefinedValues({
    x,
    y,
    ...pickDefined(passthrough, CHART_STACKED_BAR_VIS_PROP_KEYS),
    ...(color !== undefined ? { color } : {}),
  }) as StackedBarConfigInterface<T>
}
