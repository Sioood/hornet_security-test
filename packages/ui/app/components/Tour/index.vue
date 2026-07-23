<script setup lang="ts">
import {
  Tour as ArkTour,
  type TourRootBaseProps as ArkTourRootBaseProps,
  type TourStepDetails,
  type UseTourReturn,
} from '@ark-ui/vue/tour'
import { cva } from 'class-variance-authority'

import { useLayerZIndexRef } from '~/composables/useLayerZIndexRef'
import { resolveActionVariant } from '~ui/app/utils/Components/Tour/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export type { TourStepDetails }

type TourIntent = 'neutral' | 'primary' | 'secondary' | 'accent'

const tourRootCVA = cva('flex flex-col', {
  defaultVariants: {
    intent: 'neutral',
  },
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<TourIntent, string>,
  },
})

const tourBackdropCVA = cva('fixed inset-0', {
  defaultVariants: {
    intent: 'neutral',
  },
  variants: {
    intent: {
      accent: 'bg-accent-bg-inverse/80',
      neutral: 'bg-neutral-bg-inverse/80',
      primary: 'bg-primary-bg-inverse/80',
      secondary: 'bg-secondary-bg-inverse/80',
    } satisfies Record<TourIntent, string>,
  },
})

const tourSpotlightCVA = cva('')

const tourPositionerCVA = cva('fixed', {
  defaultVariants: {
    intent: 'neutral',
  },
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<TourIntent, string>,
  },
})

const tourContentCVA = cva(
  'relative flex flex-col gap-1 border bg-neutral-surface p-5 text-neutral-text shadow-lg outline-none',
  {
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    },
    variants: {
      intent: {
        accent: 'border-accent-border bg-accent-surface text-accent-text',
        neutral: 'border-neutral-border bg-neutral-surface text-neutral-text',
        primary: 'border-primary-border bg-primary-surface text-primary-text',
        secondary: 'border-secondary-border bg-secondary-surface text-secondary-text',
      } satisfies Record<TourIntent, string>,
      size: {
        lg: 'txt-base w-96 p-6',
        md: 'txt-label w-80 p-5',
        sm: 'txt-caption w-64 p-3',
      } satisfies Record<TourSize, string>,
    },
  },
)

const tourArrowCVA = cva('')

const tourArrowTipCVA = cva('border-t border-l border-neutral-border', {
  defaultVariants: {
    intent: 'neutral',
  },
  variants: {
    intent: {
      accent: 'border-accent-border',
      neutral: 'border-neutral-border',
      primary: 'border-primary-border',
      secondary: 'border-secondary-border',
    } satisfies Record<TourIntent, string>,
  },
})

const tourCloseTriggerCVA = cva(
  'absolute top-2 right-2 inline-flex size-6 cursor-pointer items-center justify-center border-none bg-transparent text-neutral-text-subtle transition-colors hover:bg-neutral-fill-subtle',
  {
    defaultVariants: {
      intent: 'neutral',
    },
    variants: {
      intent: {
        accent: 'text-accent-text-subtle hover:bg-accent-fill-subtle',
        neutral: 'text-neutral-text-subtle hover:bg-neutral-fill-subtle',
        primary: 'text-primary-text-subtle hover:bg-primary-fill-subtle',
        secondary: 'text-secondary-text-subtle hover:bg-secondary-fill-subtle',
      } satisfies Record<TourIntent, string>,
    },
  },
)

const tourTitleCVA = cva('txt-h6 m-0 leading-tight font-semibold text-neutral-text', {
  defaultVariants: {
    intent: 'neutral',
  },
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<TourIntent, string>,
  },
})

const tourDescriptionCVA = cva('txt-caption m-0 leading-relaxed text-neutral-text-subtle', {
  defaultVariants: {
    intent: 'neutral',
  },
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<TourIntent, string>,
  },
})

const tourProgressTextCVA = cva('txt-caption text-neutral-text-subtle opacity-80', {
  defaultVariants: {
    intent: 'neutral',
  },
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<TourIntent, string>,
  },
})

const tourControlCVA = cva('mt-3 flex items-center gap-2')

const tourActionTriggerCVA = cva(
  'txt-caption inline-flex cursor-pointer items-center justify-center gap-1.5 border bg-transparent px-3.5 py-1.5 font-medium whitespace-nowrap text-neutral-text transition-colors select-none hover:bg-neutral-fill-subtle',
  {
    defaultVariants: {
      intent: 'neutral',
      variant: 'default',
    },
    variants: {
      intent: {
        accent:
          'border-accent-border bg-transparent text-accent-text hover:bg-accent-fill-subtle disabled:pointer-events-none disabled:opacity-40',
        neutral:
          'border-neutral-border bg-transparent text-neutral-text hover:bg-neutral-fill-subtle disabled:pointer-events-none disabled:opacity-40',
        primary:
          'border-primary-border bg-transparent text-primary-text hover:bg-primary-fill-subtle disabled:pointer-events-none disabled:opacity-40',
        secondary:
          'border-secondary-border bg-transparent text-secondary-text hover:bg-secondary-fill-subtle disabled:pointer-events-none disabled:opacity-40',
      } satisfies Record<TourIntent, string>,
      variant: {
        default:
          'border border-neutral-border bg-transparent text-neutral-text hover:bg-neutral-fill-subtle disabled:pointer-events-none disabled:opacity-40',
        primary: 'border-primary-fill bg-primary-fill text-primary-on-fill hover:bg-primary-fill',
      },
    },
  },
)

export interface UITourSlots {
  root?: ClassValue
  backdrop?: ClassValue
  spotlight?: ClassValue
  positioner?: ClassValue
  content?: ClassValue
  arrow?: ClassValue
  arrowTip?: ClassValue
  closeTrigger?: ClassValue
  title?: ClassValue
  description?: ClassValue
  progressText?: ClassValue
  control?: ClassValue
  actionTrigger?: ClassValue
  primaryActionTrigger?: ClassValue
  progressBar?: ClassValue
}

type TourSize = 'sm' | 'md' | 'lg'

export interface UITourSlotProps {
  currentStep: TourStepDetails | undefined
  stepIndex: number
  totalSteps: number
  progressPercent: number
  status: 'idle' | 'running' | 'paused' | 'complete'
  goToNext: () => void
  goToPrev: () => void
  dismiss: () => void
}

export interface TourProps extends Omit<ArkTourRootBaseProps, 'tour'> {
  /**
   * Pass the return value of `useTour()` to control the tour —
   * the component will be controlled entirely via the Ark API object.
   */
  tour: UseTourReturn['value']
  intent?: TourIntent
  size?: TourSize
  /** Whether to show the backdrop overlay. */
  showBackdrop?: boolean
  /** Whether to show the spotlight highlight. */
  showSpotlight?: boolean
  /** Whether to show the close trigger button. */
  showClose?: boolean
  /** Whether to show the progress text (e.g. "Step 1 of 5"). */
  showProgress?: boolean
  /** Whether to show the progress bar at the bottom of the content. */
  showProgressBar?: boolean
  /** Whether to enable lazy mounting. */
  lazyMount?: boolean
  /** Whether to unmount on exit. */
  unmountOnExit?: boolean
  ui?: Partial<UITourSlots>
}

const props = withDefaults(defineProps<TourProps>(), {
  intent: 'neutral',
  lazyMount: false,
  showBackdrop: true,
  showClose: true,
  showProgress: true,
  showProgressBar: false,
  showSpotlight: true,
  size: 'md',
  ui: undefined,
  unmountOnExit: false,
})

const attrs = useAttrs()

const rootProps = computed(() => ({
  ...pick(props, ['lazyMount', 'unmountOnExit']),
}))

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...arkAttrs.value,
    ...rootProps.value,
    class: cn(
      tourRootCVA({ intent: props.intent }),
      arkAttrs.value.class as ClassValue,
      props.ui?.root,
    ),
  }
  return base
})

const backdropLayerRef = useLayerZIndexRef('modal')
const spotlightLayerRef = useLayerZIndexRef('modal')
const positionerLayerRef = useLayerZIndexRef('modal')
</script>

<template>
  <ArkTour.Root :tour="props.tour" v-bind="rootBindings">
    <ArkTour.Context v-slot="ctx">
      <slot name="backdrop" :ctx>
        <ArkTour.Backdrop
          v-if="showBackdrop"
          :ref="backdropLayerRef"
          :class="cn(tourBackdropCVA({ intent }), ui?.backdrop)"
        />
      </slot>

      <slot name="spotlight" :ctx>
        <ArkTour.Spotlight
          v-if="showSpotlight"
          :ref="spotlightLayerRef"
          :class="cn(tourSpotlightCVA(), ui?.spotlight)"
        />
      </slot>

      <slot name="positioner" :ctx>
        <ArkTour.Positioner
          :ref="positionerLayerRef"
          :class="cn(tourPositionerCVA({ intent }), ui?.positioner)"
        >
          <slot name="content" :ctx>
            <ArkTour.Content :class="cn(tourContentCVA({ intent, size }), ui?.content)">
              <slot name="arrow" :ctx>
                <ArkTour.Arrow :class="cn(tourArrowCVA(), ui?.arrow)">
                  <ArkTour.ArrowTip :class="cn(tourArrowTipCVA({ intent }), ui?.arrowTip)" />
                </ArkTour.Arrow>
              </slot>

              <slot name="close-trigger" :ctx>
                <ArkTour.CloseTrigger v-if="showClose" as-child>
                  <button
                    type="button"
                    :class="cn(tourCloseTriggerCVA({ intent }), ui?.closeTrigger)"
                  >
                    <slot name="close-trigger-icon">
                      <Icon name="tabler:x" class="size-4" />
                    </slot>
                  </button>
                </ArkTour.CloseTrigger>
              </slot>

              <slot name="progress-text" :ctx>
                <ArkTour.ProgressText
                  v-if="showProgress"
                  :class="cn(tourProgressTextCVA({ intent }), ui?.progressText)"
                >
                  {{
                    $t('tour.progressText', {
                      currentStep: ctx.stepIndex + 1,
                      totalSteps: ctx.totalSteps,
                    })
                  }}
                </ArkTour.ProgressText>
              </slot>

              <slot name="title" :ctx>
                <ArkTour.Title :class="cn(tourTitleCVA({ intent }), ui?.title)" />
              </slot>

              <slot name="description" :ctx>
                <ArkTour.Description :class="cn(tourDescriptionCVA({ intent }), ui?.description)" />
              </slot>

              <slot name="control" :ctx>
                <ArkTour.Control :class="cn(tourControlCVA(), ui?.control)">
                  <slot name="actions" :ctx>
                    <ArkTour.Actions v-slot="actions">
                      <ArkTour.ActionTrigger
                        v-for="(action, index) in actions"
                        :key="action.label"
                        as-child
                        :action="action"
                      >
                        <button
                          type="button"
                          :class="
                            cn(
                              tourActionTriggerCVA({
                                intent,
                                variant: resolveActionVariant(action, actions, index),
                              }),
                              ui?.actionTrigger,
                            )
                          "
                        >
                          <slot :name="`action-${action.action}`" :action>
                            {{ action.label }}
                          </slot>
                        </button>
                      </ArkTour.ActionTrigger>
                    </ArkTour.Actions>
                  </slot>
                </ArkTour.Control>
              </slot>

              <slot name="progress-bar" :ctx>
                <div
                  v-if="showProgressBar"
                  :class="cn('absolute right-0 bottom-0 left-0', ui?.progressBar)"
                >
                  <UIProgress
                    :model-value="ctx.getProgressPercent()"
                    size="sm"
                    :intent
                    :ui="{ valueText: 'pr-1' }"
                  />
                </div>
              </slot>
            </ArkTour.Content>
          </slot>
        </ArkTour.Positioner>
      </slot>

      <slot />
    </ArkTour.Context>
  </ArkTour.Root>
</template>
