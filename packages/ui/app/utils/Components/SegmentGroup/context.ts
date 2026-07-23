import type { ComponentIntent, ComponentSize } from '../contextBase'
import type { SegmentedOrientation, SegmentedVariant } from '../Segmented/variants'
import type { InjectionKey, Ref } from 'vue'

export type SegmentGroupIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type SegmentGroupSize = NonNullable<ComponentSize>

export interface SegmentGroupContext {
  intent: Ref<SegmentGroupIntent>
  size: Ref<SegmentGroupSize>
  orientation: Ref<SegmentedOrientation>
  variant: Ref<SegmentedVariant>
}

export const segmentGroupChromeKey: InjectionKey<SegmentGroupContext> = Symbol('segmentGroupChrome')
