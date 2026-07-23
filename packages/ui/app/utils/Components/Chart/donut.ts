import { omitUndefinedValues, pickDefined } from '@/utils/object'

import type { DonutConfigInterface, NumericAccessor } from '@unovis/ts'

const CHART_DONUT_VIS_PROP_KEYS = [
  'angleRange',
  'arcWidth',
  'attributes',
  'backgroundAngleRange',
  'centralLabel',
  'centralLabelOffsetX',
  'centralLabelOffsetY',
  'centralSubLabel',
  'centralSubLabelWrap',
  'color',
  'cornerRadius',
  'duration',
  'emptySegmentAngle',
  'events',
  'id',
  'padAngle',
  'radius',
  'showBackground',
  'showEmptySegments',
  'sortFunction',
] as const satisfies readonly (keyof Omit<DonutConfigInterface<unknown>, 'value'>)[]

/** Explicit members so Vue registers Unovis passthrough props at runtime (mapped types are not expanded). */
export interface ChartDonutVisPassthrough<T = unknown> {
  angleRange?: DonutConfigInterface<T>['angleRange']
  arcWidth?: DonutConfigInterface<T>['arcWidth']
  attributes?: DonutConfigInterface<T>['attributes']
  backgroundAngleRange?: DonutConfigInterface<T>['backgroundAngleRange']
  centralLabel?: DonutConfigInterface<T>['centralLabel']
  centralLabelOffsetX?: DonutConfigInterface<T>['centralLabelOffsetX']
  centralLabelOffsetY?: DonutConfigInterface<T>['centralLabelOffsetY']
  centralSubLabel?: DonutConfigInterface<T>['centralSubLabel']
  centralSubLabelWrap?: DonutConfigInterface<T>['centralSubLabelWrap']
  color?: DonutConfigInterface<T>['color']
  cornerRadius?: DonutConfigInterface<T>['cornerRadius']
  duration?: DonutConfigInterface<T>['duration']
  emptySegmentAngle?: DonutConfigInterface<T>['emptySegmentAngle']
  events?: DonutConfigInterface<T>['events']
  id?: DonutConfigInterface<T>['id']
  padAngle?: DonutConfigInterface<T>['padAngle']
  radius?: DonutConfigInterface<T>['radius']
  showBackground?: DonutConfigInterface<T>['showBackground']
  showEmptySegments?: DonutConfigInterface<T>['showEmptySegments']
  sortFunction?: DonutConfigInterface<T>['sortFunction']
}

export type ChartDonutVisPassthroughProps<T> = Pick<
  ChartDonutVisPassthrough<T>,
  (typeof CHART_DONUT_VIS_PROP_KEYS)[number]
>

export function pickChartDonutVisProps<T>(
  source: ChartDonutVisPassthrough<T>,
): ChartDonutVisPassthroughProps<T> {
  return pickDefined(source, CHART_DONUT_VIS_PROP_KEYS) as ChartDonutVisPassthroughProps<T>
}

export function buildChartDonutVisBind<T>(options: {
  passthrough: ChartDonutVisPassthroughProps<T>
  value: NumericAccessor<T>
  color?: DonutConfigInterface<T>['color']
}): DonutConfigInterface<T> {
  const { passthrough, value, color } = options
  return omitUndefinedValues({
    value,
    ...pickDefined(passthrough, CHART_DONUT_VIS_PROP_KEYS),
    ...(color !== undefined && color !== null ? { color } : {}),
  }) as DonutConfigInterface<T>
}
