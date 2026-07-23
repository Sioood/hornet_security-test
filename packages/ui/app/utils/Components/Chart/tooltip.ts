import { omitUndefinedValues, pickDefined } from '@/utils/object'

import type { ChartTooltipProps } from '@/utils/Components/Chart/context'
import type { TooltipConfigInterface } from '@unovis/ts'

const CHART_TOOLTIP_PROP_KEYS = [
  'components',
  'container',
  'followCursor',
  'allowHover',
  'horizontalPlacement',
  'horizontalShift',
  'verticalPlacement',
  'verticalShift',
  'triggers',
  'attributes',
  'className',
  'hideDelay',
  'showDelay',
] as const satisfies readonly (keyof TooltipConfigInterface)[]

export function buildChartTooltipVisBind(props: ChartTooltipProps): TooltipConfigInterface {
  return omitUndefinedValues(pickDefined(props, CHART_TOOLTIP_PROP_KEYS)) as TooltipConfigInterface
}
