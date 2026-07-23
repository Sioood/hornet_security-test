<script setup lang="ts">
import {
  Tooltip as ArkTooltip,
  type TooltipRootBaseProps as ArkTooltipRootBaseProps,
  type TooltipRootProviderBaseProps as ArkTooltipRootProviderBaseProps,
  type UseTooltipReturn,
} from '@ark-ui/vue/tooltip'
import { cva, type VariantProps } from 'class-variance-authority'

import { useFloatingLayerPositionerRef } from '~/composables/useLayerZIndexRef'

import type { ClassValue } from 'vue'

type TooltipIntent =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
type TooltipSize = 'md'

interface UITooltipSlots {
  content?: ClassValue
  arrow?: ClassValue
  arrowTip?: ClassValue
}

type TooltipTriggerValueSource = { triggerValue?: string | null }

function tooltipTriggerValue(tooltip: unknown): string | null {
  return (tooltip as TooltipTriggerValueSource).triggerValue ?? null
}

defineOptions({ inheritAttrs: false })

const tooltipContentCVA = cva(
  [
    'tooltipContent',
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
    'w-[min(var(--available-width),max-content)] max-w-[min(var(--available-width),28rem)]',
  ],
  {
    variants: {
      intent: {
        accent: 'bg-accent-surface text-accent-text',
        error: 'bg-error-surface text-error-text',
        info: 'bg-info-surface text-info-text',
        neutral: 'bg-neutral-surface text-neutral-text',
        primary: 'bg-primary-surface text-primary-text',
        secondary: 'bg-secondary-surface text-secondary-text',
        success: 'bg-success-surface text-success-text',
        warning: 'bg-warning-surface text-warning-text',
      } satisfies Record<TooltipIntent, string>,
      size: {
        md: 'txt-caption rounded-xs px-2 py-1',
      } satisfies Record<TooltipSize, string>,
    },
  },
)

const tooltipArrowCVA = cva(['tooltipArrow', 'flex items-center justify-center'], {
  variants: {
    intent: {
      accent: '[--arrow-background:var(--color-accent-surface)]',
      error: '[--arrow-background:var(--color-error-surface)]',
      info: '[--arrow-background:var(--color-info-surface)]',
      neutral: '[--arrow-background:var(--color-neutral-surface)]',
      primary: '[--arrow-background:var(--color-primary-surface)]',
      secondary: '[--arrow-background:var(--color-secondary-surface)]',
      success: '[--arrow-background:var(--color-success-surface)]',
      warning: '[--arrow-background:var(--color-warning-surface)]',
    } satisfies Record<TooltipIntent, string>,
    size: {
      md: '[--arrow-size:calc(var(--spacing)*2)]',
    } satisfies Record<TooltipSize, string>,
  },
})
const tooltipArrowTipCVA = cva(['tooltipArrowTip', 'size-full'])

type TooltipCVAProps = VariantProps<typeof tooltipContentCVA>

interface TooltipProps
  extends Omit<ArkTooltipRootBaseProps, 'open'>, Omit<ArkTooltipRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useTooltip()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model:open`.
   */
  value?: UseTooltipReturn['value']
  content?: string
  followCursor?: boolean
  intent?: TooltipCVAProps['intent']
  size?: TooltipCVAProps['size']
  ui?: Partial<UITooltipSlots>
}

const open = defineModel<boolean>('open', { required: false })

const props = withDefaults(defineProps<TooltipProps>(), {
  closeDelay: 100,
  content: '',
  followCursor: false,
  intent: 'neutral',
  openDelay: 300,
  size: 'md',
  ui: undefined,
  value: undefined,
})

const anchorRect = ref<DOMRect | null>(null)

const attrs = useAttrs()
const arkAttrs = computed(() => splitArkAttrs(attrs))

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() => (isProvider.value ? ArkTooltip.RootProvider : ArkTooltip.Root))

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }

  const basePositioning = props.positioning ?? {}
  const positioning = props.followCursor
    ? {
        ...basePositioning,
        getAnchorRect: () => anchorRect.value,
        gutter: basePositioning.gutter ?? 8,
        placement: basePositioning.placement ?? 'top-start',
      }
    : basePositioning

  const base: Record<string, unknown> = {
    ...pick(props, [
      'closeDelay',
      'defaultOpen',
      'defaultTriggerValue',
      'disabled',
      'id',
      'ids',
      'interactive',
      'openDelay',
      'triggerValue',
    ]),
    positioning,
  }

  if (open.value !== undefined) {
    base.open = open.value
    base['onUpdate:open'] = (next: boolean) => {
      open.value = next
    }
  }

  return base
})

const rootBindings = computed(() => ({
  ...arkAttrs.value,
  ...rootProps.value,
}))

const positionerRef = useFloatingLayerPositionerRef()

function handleTriggerPointerMove(
  event: PointerEvent,
  tooltip: { reposition: (options?: Record<string, unknown>) => void },
) {
  if (!props.followCursor) return
  anchorRect.value = new DOMRect(event.clientX, event.clientY, 1, 1)
  tooltip.reposition()
}
</script>

<template>
  <component :is="rootComponent" v-bind="rootBindings">
    <ArkTooltip.Context v-slot="tooltip">
      <slot
        name="triggers"
        :trigger="ArkTooltip.Trigger"
        :tooltip="tooltip"
        :trigger-value="tooltipTriggerValue(tooltip)"
        :on-trigger-pointer-move="(event: PointerEvent) => handleTriggerPointerMove(event, tooltip)"
      >
        <ArkTooltip.Trigger @pointermove="handleTriggerPointerMove($event, tooltip)">
          <slot name="trigger">
            <span class="inline-flex">Hover me</span>
          </slot>
        </ArkTooltip.Trigger>
      </slot>
      <ArkTooltip.Positioner :ref="positionerRef" class="origin-(--transform-origin)">
        <ArkTooltip.Content :class="cn(tooltipContentCVA({ intent, size }), ui?.content)">
          <slot name="content" :tooltip="tooltip" :trigger-value="tooltipTriggerValue(tooltip)">
            {{ content }}
          </slot>
          <ArkTooltip.Arrow :class="cn(tooltipArrowCVA({ intent, size }), ui?.arrow)">
            <ArkTooltip.ArrowTip :class="cn(tooltipArrowTipCVA(), ui?.arrowTip)" />
          </ArkTooltip.Arrow>
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Context>
  </component>
</template>
