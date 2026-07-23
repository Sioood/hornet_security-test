<script setup lang="ts">
import {
  Drawer as ArkDrawer,
  type DrawerRootBaseProps as ArkDrawerRootBaseProps,
  type DrawerRootProviderBaseProps as ArkDrawerRootProviderBaseProps,
  type UseDrawerReturn,
} from '@ark-ui/vue/drawer'
import { cva } from 'class-variance-authority'

import { useLayerZIndexRef } from '~/composables/useLayerZIndexRef'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export type DrawerIntent = 'neutral' | 'primary' | 'secondary' | 'accent'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full'
export type DrawerSwipeDirection = 'up' | 'down' | 'start' | 'end'

type ArkSwipeDirection = 'up' | 'down' | 'left' | 'right'

const swipeDirectionMap: Record<DrawerSwipeDirection, ArkSwipeDirection> = {
  down: 'down',
  end: 'right',
  start: 'left',
  up: 'up',
}

const drawerBackdropCVA = cva([
  'fixed inset-0 bg-black/50',
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
  'data-[state=closed]:duration-300 data-[state=open]:duration-500',
  'data-[state=closed]:ease-[cubic-bezier(0.4,0,0.2,1)] data-[state=open]:ease-[cubic-bezier(0.32,0.72,0,1)]',
])

/**
 * Outer layer (ArkDrawer.Content): owns `transform` for snap/drag/close.
 *
 * - Snap-to-snap: `data-[state=open]:transition-[transform]` — only active
 *   when open so the close animation never fights a live transition.
 *   Ark also inlines `transitionDuration: "0s"` during drag to suppress it.
 * - Close animation: `data-[state=closed]:animate-[ui-drawer-slide-out-*]`.
 *   CSS Animations override Ark's inline `transform` (cascade: Animations >
 *   Author normal). The `from` keyframe reads CSS variables so the animation
 *   always starts from the exact current snap/drag position. The presence
 *   machine enforces `animation-fill-mode: forwards`, keeping the element
 *   off-screen after the animation even after Ark clears the variables.
 * - `group` enables `group-data-[...]` modifiers on the inner body div.
 */
const drawerContentRootCVA = cva(
  [
    'group relative flex w-full flex-col outline-none',
    // Snap-to-snap transition — only while open (state=closed deactivates it,
    // so the close animation never competes with a running transition)
    'data-[state=open]:transition-[transform]',
    'data-[state=open]:duration-500',
    'data-[state=open]:ease-[cubic-bezier(0.32,0.72,0,1)]',
    // Suppress transition during drag (Ark also inlines transitionDuration:0s)
    'data-[dragging]:transition-none!',
  ],
  {
    variants: {
      size: {
        full: 'max-h-[99svh]',
        lg: 'max-h-[90svh]',
        md: 'max-h-[75svh]',
        sm: 'max-h-[50svh]',
      } satisfies Record<DrawerSize, string>,
      swipeDirection: {
        down: [
          'h-full data-[state=closed]:animate-[ui-drawer-slide-out-down_0.3s_cubic-bezier(0.4,0,0.2,1)_forwards]',
        ],
        end: [
          'h-full max-h-none w-auto',
          'data-[state=closed]:animate-[ui-drawer-slide-out-end_0.3s_cubic-bezier(0.4,0,0.2,1)_forwards]',
        ],
        start: [
          'h-full max-h-none w-auto',
          'data-[state=closed]:animate-[ui-drawer-slide-out-start_0.3s_cubic-bezier(0.4,0,0.2,1)_forwards]',
        ],
        up: [
          'h-auto data-[state=closed]:animate-[ui-drawer-slide-out-up_0.3s_cubic-bezier(0.4,0,0.2,1)_forwards]',
        ],
      } satisfies Record<DrawerSwipeDirection, string[]>,
    },
  },
)

/**
 * Inner body: open animation + layout/background.
 *
 * Open animation uses the CSS `translate` property (CSS Transforms Level 2),
 * which is completely separate from `transform`. This means it never conflicts
 * with Ark's inline `transform` or the outer's `transition: transform`.
 * Combined with the outer's transition (which may fire on open due to
 * --drawer-translate-y changing from 0 → snapOffset), the visuals add up
 * correctly: outer(0→H) + inner(100svh→0) = combined(100svh→H). ✓
 *
 * `animation-play-state: paused` during drag freezes the completed open
 * animation at `translate: 0 0` without cancelling it, preventing restarts.
 */
const drawerBodyCVA = cva(
  [
    'relative flex size-full min-h-0 min-w-0 shadow-xl',
    'group-data-[dragging]:[animation-play-state:paused]',
  ],
  {
    variants: {
      intent: {
        accent: 'bg-accent-surface',
        neutral: 'bg-neutral-surface',
        primary: 'bg-primary-surface',
        secondary: 'bg-secondary-surface',
      } satisfies Record<DrawerIntent, string>,
      swipeDirection: {
        down: [
          'drawer-bleed-down flex-col',
          'group-data-[state=open]:animate-[ui-drawer-body-slide-in-down_0.5s_cubic-bezier(0.32,0.72,0,1)_both]',
        ],
        end: [
          'drawer-bleed-end flex-row',
          'group-data-[state=open]:animate-[ui-drawer-body-slide-in-end_0.5s_cubic-bezier(0.32,0.72,0,1)_both]',
        ],
        start: [
          'drawer-bleed-start flex-row-reverse',
          'group-data-[state=open]:animate-[ui-drawer-body-slide-in-start_0.5s_cubic-bezier(0.32,0.72,0,1)_both]',
        ],
        up: [
          'drawer-bleed-up flex-col-reverse',
          'group-data-[state=open]:animate-[ui-drawer-body-slide-in-up_0.5s_cubic-bezier(0.32,0.72,0,1)_both]',
        ],
      } satisfies Record<DrawerSwipeDirection, string[]>,
    },
  },
)

const drawerGrabberCVA = cva(
  'flex shrink-0 cursor-grab touch-none items-center justify-center select-none active:cursor-grabbing',
  {
    defaultVariants: { swipeDirection: 'down' },
    variants: {
      swipeDirection: {
        down: 'w-full py-2',
        end: 'h-full w-4 px-1',
        start: 'h-full w-4 px-1',
        up: 'w-full py-2',
      } satisfies Record<DrawerSwipeDirection, string>,
    },
  },
)

const drawerGrabberIndicatorCVA = cva('bg-neutral-border-inverse transition-colors duration-150', {
  defaultVariants: { swipeDirection: 'down' },
  variants: {
    swipeDirection: {
      down: 'h-1 w-10',
      end: 'h-10 w-1',
      start: 'h-10 w-1',
      up: 'h-1 w-10',
    } satisfies Record<DrawerSwipeDirection, string>,
  },
})

const drawerTitleCVA = cva('txt-h5', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<DrawerIntent, string>,
  },
})

const drawerDescriptionCVA = cva('txt-caption mt-0.5', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<DrawerIntent, string>,
  },
})

export interface UIDrawerSlots {
  backdrop?: ClassValue
  positioner?: ClassValue
  content?: ClassValue
  body?: ClassValue
  grabber?: ClassValue
  grabberIndicator?: ClassValue
  header?: ClassValue
  scrollBody?: ClassValue
  footer?: ClassValue
  title?: ClassValue
  description?: ClassValue
  closeTrigger?: ClassValue
}

interface DrawerProps
  extends
    Omit<ArkDrawerRootBaseProps, 'open' | 'swipeDirection'>,
    Omit<ArkDrawerRootProviderBaseProps, 'value'> {
  title?: string
  description?: string
  showCloseTrigger?: boolean
  hideTrigger?: boolean
  draggable?: boolean
  showGrabber?: boolean
  portalled?: boolean
  scrollable?: boolean
  size?: DrawerSize
  intent?: DrawerIntent
  swipeDirection?: DrawerSwipeDirection
  ui?: Partial<UIDrawerSlots>
  value?: UseDrawerReturn['value']
}

const open = defineModel<boolean>('open')

const props = withDefaults(defineProps<DrawerProps>(), {
  closeOnEscape: true,
  closeOnInteractOutside: true,
  defaultSnapPoint: 0.5,
  description: '',
  draggable: true,
  hideTrigger: false,
  intent: 'neutral',
  lazyMount: false,
  modal: true,
  portalled: true,
  preventDragOnScroll: true,
  preventScroll: true,
  scrollable: false,
  showCloseTrigger: true,
  showGrabber: true,
  size: 'md',
  snapPoints: () => [0.25, 0.5, 1],
  swipeDirection: 'down',
  title: '',
  ui: undefined,
  unmountOnExit: false,
  value: undefined,
})

const arkAttrs = computed(() => splitArkAttrs(useAttrs()))

const isProvider = computed(() => props.value !== undefined)
const rootComponent = computed(() => (isProvider.value ? ArkDrawer.RootProvider : ArkDrawer.Root))

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['lazyMount', 'unmountOnExit', 'value'] as const)
  }

  const base: Record<string, unknown> = {
    ...pick(props, [
      'closeOnEscape',
      'closeOnInteractOutside',
      'closeThreshold',
      'defaultOpen',
      'defaultSnapPoint',
      'finalFocusEl',
      'id',
      'ids',
      'initialFocusEl',
      'lazyMount',
      'modal',
      'preventDragOnScroll',
      'preventScroll',
      'restoreFocus',
      'role',
      'snapPoint',
      'snapToSequentialPoints',
      'swipeVelocityThreshold',
      'trapFocus',
      'unmountOnExit',
    ] as const),
    snapPoints: props.snapPoints,
    swipeDirection: swipeDirectionMap[props.swipeDirection],
  }

  if (open.value !== undefined) {
    base.open = open.value
    base.onOpenChange = (details: { open: boolean }) => {
      open.value = details.open
    }
  }

  return base
})

const rootBindings = computed(() => ({
  ...arkAttrs.value,
  ...rootProps.value,
}))

const backdropLayerRef = useLayerZIndexRef('modal')
const positionerLayerRef = useLayerZIndexRef('modal')
</script>

<template>
  <!-- NOTES KNOWN ISSUE: when closing with closeThreshold or swipeVelocityThreshold, with Root the closing animation is going to the last know snap point instead of doing the animation from the current position when pointer up. With RootProvider, the animation is correct. -->
  <component :is="rootComponent" v-bind="rootBindings">
    <ArkDrawer.Context v-slot="drawer">
      <slot name="triggers" :trigger="ArkDrawer.Trigger" :drawer>
        <ArkDrawer.Trigger v-if="!hideTrigger" as-child>
          <slot name="trigger">
            <UIButton type="button" variant="subtle" :intent>{{ $t('open') }}</UIButton>
          </slot>
        </ArkDrawer.Trigger>
      </slot>

      <Teleport to="body" :disabled="!portalled">
        <ClientOnly>
          <ArkDrawer.Backdrop
            v-if="modal"
            :ref="backdropLayerRef"
            :class="cn(drawerBackdropCVA(), ui?.backdrop)"
          />

          <ArkDrawer.Positioner
            :ref="positionerLayerRef"
            :class="
              cn(
                'fixed inset-0 flex items-end justify-center',
                'data-[swipe-direction=up]:items-start',
                'data-[swipe-direction=left]:items-stretch data-[swipe-direction=left]:justify-start',
                'data-[swipe-direction=right]:items-stretch data-[swipe-direction=right]:justify-end',
                ui?.positioner,
              )
            "
          >
            <ArkDrawer.Content
              :draggable
              :class="cn(drawerContentRootCVA({ swipeDirection, size }), ui?.content)"
            >
              <div :class="cn(drawerBodyCVA({ intent, swipeDirection }), ui?.body)">
                <!--
                Grabber is the FIRST child so flex direction controls its side:
                down → flex-col  → top edge
                up   → flex-col-reverse → bottom edge
                start → flex-row-reverse → right edge (visible edge of left panel)
                end  → flex-row  → left edge (visible edge of right panel)
              -->
                <ArkDrawer.Grabber
                  v-if="showGrabber && draggable"
                  :class="cn(drawerGrabberCVA({ swipeDirection }), ui?.grabber)"
                >
                  <ArkDrawer.GrabberIndicator
                    :class="cn(drawerGrabberIndicatorCVA({ swipeDirection }), ui?.grabberIndicator)"
                  />
                </ArkDrawer.Grabber>

                <div class="flex min-w-0 flex-col overflow-hidden">
                  <slot name="header" :drawer>
                    <div
                      :class="cn('flex shrink-0 items-start justify-between gap-4 p-4', ui?.header)"
                    >
                      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                        <ArkDrawer.Title
                          v-if="title || $slots.title"
                          :class="cn(drawerTitleCVA({ intent }), ui?.title)"
                        >
                          <slot name="title">{{ title }}</slot>
                        </ArkDrawer.Title>
                        <ArkDrawer.Description
                          v-if="description || $slots.description"
                          :class="cn(drawerDescriptionCVA({ intent }), ui?.description)"
                        >
                          <slot name="description">{{ description }}</slot>
                        </ArkDrawer.Description>
                      </div>
                      <ArkDrawer.CloseTrigger
                        v-if="showCloseTrigger"
                        :class="cn('-mt-1 shrink-0', ui?.closeTrigger)"
                      >
                        <slot name="close-trigger">
                          <UIButton type="button" variant="ghost" icon="tabler:x" :intent />
                        </slot>
                      </ArkDrawer.CloseTrigger>
                    </div>
                  </slot>

                  <div
                    :class="
                      cn(
                        'min-h-0 p-4',
                        scrollable && 'h-full! overflow-y-auto overscroll-contain',
                        ui?.scrollBody,
                      )
                    "
                  >
                    <slot :drawer />
                  </div>

                  <div
                    v-if="$slots.footer"
                    :class="cn('flex shrink-0 justify-end gap-2 p-4', ui?.footer)"
                  >
                    <slot name="footer" :drawer />
                  </div>
                </div>
              </div>
            </ArkDrawer.Content>
          </ArkDrawer.Positioner>
        </ClientOnly>
      </Teleport>
    </ArkDrawer.Context>
  </component>
</template>

<style scoped>
/*
  Bleed pseudo-elements: extend the drawer's background behind the viewport
  edge to prevent a gap during overdrag. Position relative to the inner body div.
  Cannot be done with Tailwind (::after + position + background-color: inherit).
*/

.drawer-bleed-down::after,
.drawer-bleed-up::after,
.drawer-bleed-start::after,
.drawer-bleed-end::after {
  content: '';
  position: absolute;
  background-color: inherit;
  pointer-events: none;
}

.drawer-bleed-down::after {
  inset-inline: 0;
  top: 100%;
  height: 3rem;
}

.drawer-bleed-up::after {
  inset-inline: 0;
  bottom: 100%;
  height: 3rem;
}

.drawer-bleed-start::after {
  inset-block: 0;
  right: 100%;
  width: 3rem;
}

.drawer-bleed-end::after {
  inset-block: 0;
  left: 100%;
  width: 3rem;
}
</style>
