import { omitUndefinedValues, pickDefined } from '@/utils/object'

import type { ChartSingleContainerProps } from '@/utils/Components/Chart/context'
import type { SingleContainerConfigInterface } from '@unovis/ts'

const CHART_SINGLE_CONTAINER_PROP_KEYS = [
  'duration',
  'margin',
  'padding',
  'sizing',
  'width',
  'height',
  'svgDefs',
  'ariaLabel',
  'onRenderComplete',
] as const satisfies readonly (keyof SingleContainerConfigInterface<unknown>)[]

export function buildChartSingleContainerVisBind<T>(
  props: ChartSingleContainerProps<T>,
): SingleContainerConfigInterface<T> {
  return omitUndefinedValues(
    pickDefined(props, CHART_SINGLE_CONTAINER_PROP_KEYS),
  ) as SingleContainerConfigInterface<T>
}
