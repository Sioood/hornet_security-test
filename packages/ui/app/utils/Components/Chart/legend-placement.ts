import type {
  ChartLegendAlign,
  ChartLegendPlacement,
  ChartLegendSide,
} from '@/utils/Components/Chart/context'

export function parseChartLegendPlacement(placement: ChartLegendPlacement): {
  side: ChartLegendSide
  align: ChartLegendAlign
} {
  const [side, align] = placement.split('-') as [ChartLegendSide, ChartLegendAlign | undefined]
  return {
    align: align ?? 'center',
    side,
  }
}
