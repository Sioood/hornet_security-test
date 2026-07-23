import type { ChartLegendSeries } from '@/utils/Components/Chart/context'

export interface TrafficSourceRecord {
  label: string
  value: number
}

export const trafficSourceData: TrafficSourceRecord[] = [
  { label: 'Organic search', value: 42 },
  { label: 'Direct', value: 28 },
  { label: 'Referral', value: 18 },
  { label: 'Social', value: 12 },
]

export const trafficSourceSeries: ChartLegendSeries[] = [
  { color: 'var(--vis-color0)', key: 'organic', label: 'Organic search' },
  { color: 'var(--vis-color1)', key: 'direct', label: 'Direct' },
  { color: 'var(--vis-color2)', key: 'referral', label: 'Referral' },
  { color: 'var(--vis-color3)', key: 'social', label: 'Social' },
]

export const value = (d: TrafficSourceRecord) => d.value

export function formatTrafficPercent(value: number): string {
  return `${value}%`
}
