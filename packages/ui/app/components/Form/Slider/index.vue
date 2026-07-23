<script setup lang="ts">
import {
  Slider as ArkSlider,
  type SliderRootBaseProps as ArkSliderRootBaseProps,
  type SliderRootProviderBaseProps as ArkSliderRootProviderBaseProps,
  type UseSliderReturn,
} from '@ark-ui/vue/slider'
import { cva } from 'class-variance-authority'

import type { UISliderSlots } from '~/utils/Components/Form/context'
import type { FieldProps } from '~ui/app/components/Form/Field.vue'

defineOptions({ inheritAttrs: false })

const sliderRootCVA = cva('flex w-full flex-col', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'h-full items-center',
    } satisfies Record<'horizontal' | 'vertical', string>,
  },
})

const sliderLabelCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<FormSliderIntent, string>,
    size: {
      lg: 'txt-h6',
      md: 'txt-label',
      sm: 'txt-base',
    } satisfies Record<FormSliderSize, string>,
  },
})

const sliderValueTextCVA = cva('text-right font-mono tabular-nums', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<FormSliderIntent, string>,
    size: {
      lg: 'txt-base',
      md: 'txt-caption',
      sm: 'txt-small',
    } satisfies Record<FormSliderSize, string>,
  },
})

const sliderWrapperCVA = cva('flex', {
  variants: {
    orientation: {
      horizontal: 'w-full flex-col',
      vertical: 'h-40',
    } satisfies Record<'horizontal' | 'vertical', string>,
    size: {
      lg: 'mt-4 h-6',
      md: 'mt-3 h-5',
      sm: 'mt-2 h-4',
    } satisfies Record<FormSliderSize, string>,
  },
})

const sliderControlCVA = cva('relative flex touch-none select-none', {
  variants: {
    orientation: {
      horizontal: 'w-full items-center',
      vertical: 'h-full flex-col items-center',
    } satisfies Record<'horizontal' | 'vertical', string>,
    size: {
      lg: 'data-[orientation=vertical]:h-40',
      md: 'data-[orientation=vertical]:h-40',
      sm: 'data-[orientation=vertical]:h-40',
    } satisfies Record<FormSliderSize, string>,
  },
})

const sliderTrackCVA = cva('relative overflow-hidden', {
  variants: {
    intent: {
      accent: 'bg-accent-fill-subtle-hover',
      neutral: 'bg-neutral-fill-subtle-hover',
      primary: 'bg-primary-fill-subtle-hover',
      secondary: 'bg-secondary-fill-subtle-hover',
    } satisfies Record<FormSliderIntent, string>,
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    } satisfies Record<'horizontal' | 'vertical', string>,
    size: {
      lg: 'data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5',
      md: 'data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1',
      sm: 'data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5',
    } satisfies Record<FormSliderSize, string>,
  },
})

const sliderRangeCVA = cva('', {
  variants: {
    intent: {
      accent: 'bg-accent-fill',
      neutral: 'bg-neutral-fill',
      primary: 'bg-primary-fill',
      secondary: 'bg-secondary-fill',
    } satisfies Record<FormSliderIntent, string>,
    orientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    } satisfies Record<'horizontal' | 'vertical', string>,
  },
})

const sliderThumbCVA = cva(
  ['not-data-[disabled]:cursor-pointer data-[disabled]:cursor-not-allowed'],
  {
    variants: {
      intent: {
        accent:
          'data-[disabled]:bg-accent border-accent-border bg-accent-fill disabled:pointer-events-none disabled:opacity-40',
        neutral:
          'data-[disabled]:bg-neutral border-neutral-border bg-neutral-fill disabled:pointer-events-none disabled:opacity-40',
        primary:
          'data-[disabled]:bg-primary border-primary-border bg-primary-fill disabled:pointer-events-none disabled:opacity-40',
        secondary:
          'data-[disabled]:bg-secondary border-secondary-border bg-secondary-fill disabled:pointer-events-none disabled:opacity-40',
      } satisfies Record<FormSliderIntent, string>,
      size: {
        lg: 'size-5 rounded-xs border',
        md: 'size-4 rounded-xs border',
        sm: 'size-3 rounded-xs border',
      } satisfies Record<FormSliderSize, string>,
    },
  },
)

const sliderDraggingIndicatorCVA = cva(['absolute', 'z-50', 'tabular-nums', 'font-mono'], {
  variants: {
    intent: {
      accent: 'bg-accent-surface text-accent-text',
      neutral: 'bg-neutral-surface text-neutral-text',
      primary: 'bg-primary-surface text-primary-text',
      secondary: 'bg-secondary-surface text-secondary-text',
    } satisfies Record<FormSliderIntent, string>,
    size: {
      lg: 'txt-base left-1/2 h-fit w-fit px-3 py-1.5 data-[orientation="horizontal"]:-top-[200%] data-[orientation="vertical"]:-left-[225%]',
      md: 'txt-caption left-1/2 h-fit w-fit px-2 py-1 data-[orientation="horizontal"]:-top-[225%] data-[orientation="vertical"]:-left-[275%]',
      sm: 'txt-small left-1/2 h-fit w-fit px-1 py-0.5 data-[orientation="horizontal"]:-top-[225%] data-[orientation="vertical"]:-left-[275%]',
    } satisfies Record<FormSliderSize, string>,
  },
})

const sliderDraggingIndicatorArrowCVA = cva('absolute border-transparent', {
  variants: {
    intent: {
      accent: 'border-t-accent-surface',
      neutral: 'border-t-neutral-surface',
      primary: 'border-t-primary-surface',
      secondary: 'border-t-secondary-surface',
    } satisfies Record<FormSliderIntent, string>,
    size: {
      lg: 'top-full left-1/2 -translate-x-1/2 border-4 data-[orientation="vertical"]:top-1/2 data-[orientation="vertical"]:-left-full',
      md: 'border-4 data-[orientation="horizontal"]:top-full data-[orientation="horizontal"]:left-1/2 data-[orientation="horizontal"]:-translate-x-1/2 data-[orientation="vertical"]:left-full data-[orientation="vertical"]:translate-y-1/2 data-[orientation="vertical"]:-rotate-90',
      sm: 'top-full left-1/2 -translate-x-1/2 border-4 data-[orientation="vertical"]:top-1/2 data-[orientation="vertical"]:-left-full',
    } satisfies Record<FormSliderSize, string>,
  },
})

const sliderMarkerGroupCVA = cva('flex', {
  variants: {
    orientation: {
      horizontal: 'mt-3 w-full justify-between px-1',
      vertical: 'ml-6 h-40 flex-col justify-between py-1',
    } satisfies Record<'horizontal' | 'vertical', string>,
  },
})

const sliderMarkerCVA = cva(
  'relative flex flex-col items-center duration-200 ease-in-out before:transition-colors',
  {
    variants: {
      intent: {
        accent:
          "text-accent-text-subtle before:bg-neutral-fill-subtle-hover [&[data-is-range='false'][data-state='under-value']::before]:bg-neutral-fill [&[data-state='at-value']::before]:bg-neutral-fill",
        neutral:
          "text-neutral-text-subtle before:bg-neutral-fill-subtle-hover [&[data-is-range='false'][data-state='under-value']::before]:bg-neutral-fill [&[data-state='at-value']::before]:bg-neutral-fill",
        primary:
          "text-primary-text-subtle before:bg-neutral-fill-subtle-hover [&[data-is-range='false'][data-state='under-value']::before]:bg-neutral-fill [&[data-state='at-value']::before]:bg-neutral-fill",
        secondary:
          "text-secondary-text-subtle before:bg-neutral-fill-subtle-hover [&[data-is-range='false'][data-state='under-value']::before]:bg-neutral-fill [&[data-state='at-value']::before]:bg-neutral-fill",
      } satisfies Record<FormSliderIntent, string>,
      size: {
        lg: "txt-base before:absolute before:-top-1 before:left-1/2 before:block before:size-0.5 before:content-['\u200B'] data-[orientation='horizontal']:pt-1 data-[orientation='horizontal']:before:-translate-x-1/2 data-[orientation='vertical']:pl-1 data-[orientation='vertical']:before:top-1/2 data-[orientation='vertical']:before:-left-2 data-[orientation='vertical']:before:-translate-y-1/2",
        md: "txt-caption before:absolute before:-top-1 before:left-1/2 before:block before:size-0.5 before:content-['\u200B'] data-[orientation='horizontal']:pt-1 data-[orientation='horizontal']:before:-translate-x-1/2 data-[orientation='vertical']:pl-1 data-[orientation='vertical']:before:top-1/2 data-[orientation='vertical']:before:-left-2 data-[orientation='vertical']:before:-translate-y-1/2",
        sm: "txt-small before:absolute before:-top-1 before:left-1/2 before:block before:size-0.5 before:content-['\u200B'] data-[orientation='horizontal']:pt-1 data-[orientation='horizontal']:before:-translate-x-1/2 data-[orientation='vertical']:pl-1 data-[orientation='vertical']:before:top-1/2 data-[orientation='vertical']:before:-left-2 data-[orientation='vertical']:before:-translate-y-1/2",
      } satisfies Record<FormSliderSize, string>,
    },
  },
)

export type FormSliderIntent = 'neutral' | 'primary' | 'secondary' | 'accent'
export type FormSliderSize = 'sm' | 'md' | 'lg'

export interface SliderProps
  extends
    Omit<ArkSliderRootBaseProps, 'modelValue'>,
    Omit<ArkSliderRootProviderBaseProps, 'value'>,
    Omit<FieldProps, 'ui' | 'hideLabel' | 'intent' | 'size' | 'ids'> {
  /**
   * Pass the return value of `useSlider()` to enable **RootProvider** mode.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseSliderReturn['value']
  /** Custom format function for ValueText. Receives `(value, index)`. Default: `${value}` */
  formatValue?: (value: number, index: number) => string
  intent?: FormSliderIntent
  size?: FormSliderSize
  ui?: Partial<UISliderSlots>
  /** Mark values to render as `Slider.Marker` children. */
  marks?: number[]
}

const modelValue = defineModel<number[]>({ required: false })

const props = withDefaults(defineProps<SliderProps>(), {
  error: undefined,
  formatValue: undefined,
  helperText: undefined,
  intent: 'neutral',
  label: undefined,
  marks: () => [],
  orientation: 'horizontal',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const attrs = useAttrs()

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() => (isProvider.value ? ArkSlider.RootProvider : ArkSlider.Root))

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  return pick(props, [
    'aria-label',
    'aria-labelledby',
    'asChild',
    'defaultValue',
    'dir',
    'disabled',
    'form',
    'getAriaValueText',
    'getRootNode',
    'id',
    'ids',
    'invalid',
    'max',
    'min',
    'minStepsBetweenThumbs',
    'name',
    'orientation',
    'origin',
    'readOnly',
    'step',
    'thumbAlignment',
    'thumbCollisionBehavior',
    'thumbSize',
  ] as const)
})

const arkAttrs = computed(() =>
  splitArkAttrs(attrs, ['ui', 'label', 'error', 'helperText', 'formatValue', 'marks']),
)

const orientation = computed(() => {
  if (isProvider.value) return undefined
  return props.orientation ?? 'horizontal'
})

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(sliderRootCVA({ orientation: orientation.value })),
  }
  if (!isProvider.value) {
    base.modelValue = modelValue.value
    base['onUpdate:modelValue'] = (v: number[]) => {
      modelValue.value = v
    }
  }
  return base
})

const fieldProps = computed(() => ({
  ...pick(props, [
    'asChild',
    'disabled',
    'error',
    'helperText',
    'id',
    'ids',
    'label',
    'readOnly',
    'required',
  ] as const),
  invalid: props.invalid || String(props.error ?? '').length > 0,
}))

const defaultFormatValue = (v: number, _index: number): string => `${v}`

const formatFn = computed(() => props.formatValue ?? defaultFormatValue)

extendCompodiumMeta({
  defaultProps: {
    defaultValue: [50],
    intent: 'neutral',
    label: 'Slider',
    size: 'md',
  },
})
</script>

<template>
  <UIFormField v-bind="fieldProps" :ui hide-label>
    <component :is="rootComponent" v-bind="rootBindings">
      <ArkSlider.Context v-slot="api">
        <div class="flex items-center justify-between gap-2">
          <ArkSlider.Label :class="cn(sliderLabelCVA({ intent, size }), ui?.label)">
            {{ label }}
          </ArkSlider.Label>
          <ArkSlider.ValueText :class="cn(sliderValueTextCVA({ intent, size }), ui?.valueText)">
            <slot name="value-text" :values="api.value" :format="formatFn">
              {{ api.value.map((v: number, i: number) => formatFn(v, i)).join(' – ') }}
            </slot>
          </ArkSlider.ValueText>
        </div>

        <div :class="sliderWrapperCVA({ orientation: orientation ?? 'horizontal', size })">
          <ArkSlider.Control
            :class="
              cn(sliderControlCVA({ orientation: orientation ?? 'horizontal', size }), ui?.control)
            "
          >
            <ArkSlider.Track
              :class="
                cn(
                  sliderTrackCVA({ intent, orientation: orientation ?? 'horizontal', size }),
                  ui?.track,
                )
              "
            >
              <ArkSlider.Range
                :class="
                  cn(
                    sliderRangeCVA({ intent, orientation: orientation ?? 'horizontal' }),
                    ui?.range,
                  )
                "
              />
            </ArkSlider.Track>

            <ArkSlider.Thumb
              v-for="(_, idx) in api.value"
              :key="idx"
              :index="idx"
              :class="cn(sliderThumbCVA({ intent, size }), ui?.thumb)"
            >
              <slot name="dragging-indicator" :index="idx" :value="api.value[idx]">
                <ArkSlider.DraggingIndicator
                  :class="cn(sliderDraggingIndicatorCVA({ intent, size }), ui?.draggingIndicator)"
                >
                  {{ formatFn(api.value[idx] ?? 0, idx) }}
                  <span
                    :data-orientation="orientation ?? 'horizontal'"
                    :class="cn(sliderDraggingIndicatorArrowCVA({ intent, size }))"
                    aria-hidden="true"
                  />
                </ArkSlider.DraggingIndicator>
              </slot>
              <ArkSlider.HiddenInput />
            </ArkSlider.Thumb>
          </ArkSlider.Control>

          <ArkSlider.MarkerGroup
            v-if="marks.length > 0"
            :class="cn(sliderMarkerGroupCVA({ orientation }), ui?.markerGroup)"
          >
            <ArkSlider.Marker
              v-for="markValue in marks"
              :key="markValue"
              :value="markValue"
              :class="cn(sliderMarkerCVA({ intent, size }), ui?.marker)"
              :data-is-range="api.value?.length === 2"
            >
              <slot name="marker" :value="markValue">
                {{ markValue }}
              </slot>
            </ArkSlider.Marker>
          </ArkSlider.MarkerGroup>
        </div>

        <slot :api="api" />
      </ArkSlider.Context>
    </component>
  </UIFormField>
</template>
