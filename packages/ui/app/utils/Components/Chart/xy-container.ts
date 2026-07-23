import { omitUndefinedValues, pickDefined } from '@/utils/object'

import type { ChartXYContainerProps } from '@/utils/Components/Chart/context'
import type { XYContainerConfigInterface } from '@unovis/ts'

const CHART_XY_CONTAINER_PROP_KEYS = [
  'components',
  'xScale',
  'xDomain',
  'xDomainMinConstraint',
  'xDomainMaxConstraint',
  'xRange',
  'yScale',
  'yDomain',
  'yDomainMinConstraint',
  'yDomainMaxConstraint',
  'yRange',
  'yDirection',
  'xAxis',
  'yAxis',
  'autoMargin',
  'tooltip',
  'crosshair',
  'preventEmptyDomain',
  'scaleByDomain',
  'annotations',
  'clipPathExtend',
  'onRenderComplete',
  'duration',
  'margin',
  'padding',
  'sizing',
  'width',
  'height',
  'svgDefs',
  'ariaLabel',
] as const satisfies readonly (keyof XYContainerConfigInterface<Record<string, unknown>>)[]

export function buildChartXYContainerVisBind<T extends Record<string, unknown>>(
  props: ChartXYContainerProps<T>,
): XYContainerConfigInterface<T> {
  return omitUndefinedValues(
    pickDefined(props, CHART_XY_CONTAINER_PROP_KEYS),
  ) as XYContainerConfigInterface<T>
}
