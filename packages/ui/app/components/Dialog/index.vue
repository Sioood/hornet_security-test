<script setup lang="ts">
import {
  Dialog as ArkDialog,
  type DialogRootBaseProps as ArkDialogRootBaseProps,
  type DialogRootProviderBaseProps as ArkDialogRootProviderBaseProps,
  type UseDialogReturn,
} from '@ark-ui/vue/dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { nextTick, watch, type ClassValue } from 'vue'

import { useLayerZIndexRef } from '~/composables/useLayerZIndexRef'

defineOptions({ inheritAttrs: false })

export type DialogIntent = 'neutral' | 'primary' | 'secondary' | 'accent'
export type DialogSize = 'sm' | 'md' | 'lg' | 'full'
export type ScrollBehavior = 'inside' | 'outside'

const dialogBackdropCVA = cva([
  'fixed inset-0',
  'bg-black/60',
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
  'duration-200',
])

const dialogPositionerCVA = cva('fixed inset-0 flex justify-center', {
  variants: {
    scrollBehavior: {
      inside: 'items-center',
      outside: 'items-start overflow-y-auto',
    } satisfies Record<ScrollBehavior, string>,
    size: {
      full: 'max-w-full',
      lg: 'max-w-full p-4 md:p-8',
      md: 'max-w-full p-4 md:p-8',
      sm: 'max-w-full p-4 md:p-8',
    } satisfies Record<DialogSize, string>,
  },
})

const dialogContentCVA = cva(
  [
    'relative mx-auto flex w-full flex-col',
    'shadow-lg',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
    'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
    'duration-200',
  ],
  {
    variants: {
      intent: {
        accent: 'bg-accent-surface',
        neutral: 'bg-neutral-surface',
        primary: 'bg-primary-surface',
        secondary: 'bg-secondary-surface',
      } satisfies Record<DialogIntent, string>,
      scrollBehavior: {
        inside: 'max-h-[calc(100dvh-4rem)]',
        outside: 'my-8',
      } satisfies Record<ScrollBehavior, string>,
      size: {
        full: 'm-2 max-w-full',
        lg: 'm-2 max-w-lg rounded-xs',
        md: 'm-2 max-w-md rounded-xs',
        sm: 'm-2 max-w-sm rounded-xs',
      } satisfies Record<DialogSize, string>,
    },
  },
)

const dialogHeaderCVA = cva('flex shrink-0 items-start justify-between gap-4 p-4', {
  variants: {
    size: {
      full: 'p-4',
      lg: 'p-4',
      md: 'p-4',
      sm: 'p-4',
    } satisfies Record<DialogSize, string>,
  },
})

const dialogTitleCVA = cva('txt-h5', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<DialogIntent, string>,
  },
})

const dialogDescriptionCVA = cva('txt-caption mt-0.5', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<DialogIntent, string>,
  },
})

const dialogFooterCVA = cva('flex shrink-0 justify-end', {
  variants: {
    size: {
      full: 'gap-2 p-4',
      lg: 'gap-2 p-4',
      md: 'gap-2 p-4',
      sm: 'gap-2 p-4',
    } satisfies Record<DialogSize, string>,
  },
})

type DialogCVAProps = VariantProps<typeof dialogContentCVA>

export interface UIDialogSlots {
  backdrop?: ClassValue
  positioner?: ClassValue
  content?: ClassValue
  header?: ClassValue
  body?: ClassValue
  footer?: ClassValue
  title?: ClassValue
  description?: ClassValue
  closeTrigger?: ClassValue
}

interface DialogProps
  extends Omit<ArkDialogRootBaseProps, 'open'>, Omit<ArkDialogRootProviderBaseProps, 'value'> {
  title?: string
  description?: string
  /** Show the × close button in the header. Default: `true`. */
  showCloseTrigger?: boolean
  /** Suppress rendering any trigger element in the DOM (for programmatically-controlled dialogs). Default: `false`. */
  hideTrigger?: boolean
  /**
   * When `true` (default), backdrop and positioner render in `document.body` via `<Teleport>` so
   * `position: fixed` is viewport-relative (avoids transformed ancestors e.g. playgrounds, cards).
   * Set `false` only for rare embedding cases.
   */
  portalled?: boolean
  /** Controls whether the body scrolls (`inside`) or the positioner scrolls (`outside`). Default: `'inside'`. */
  scrollBehavior?: ScrollBehavior
  intent?: DialogIntent
  size?: DialogCVAProps['size']
  ui?: Partial<UIDialogSlots>
  value?: UseDialogReturn['value']
}

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<DialogProps>(), {
  closeOnEscape: true,
  closeOnInteractOutside: true,
  description: '',
  hideTrigger: false,
  intent: 'neutral',
  lazyMount: true,
  modal: true,
  portalled: true,
  scrollBehavior: 'inside',
  showCloseTrigger: true,
  size: 'md',
  title: '',
  ui: undefined,
  unmountOnExit: true,
  value: undefined,
})

const attrs = useAttrs()
const rootAttrs = computed(() => splitArkAttrs(attrs))

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() => (isProvider.value ? ArkDialog.RootProvider : ArkDialog.Root))

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['lazyMount', 'unmountOnExit', 'value'] as const)
  }
  return {
    ...pick(props, [
      'aria-label',
      'closeOnEscape',
      'closeOnInteractOutside',
      'defaultOpen',
      'defaultTriggerValue',
      'finalFocusEl',
      'id',
      'ids',
      'initialFocusEl',
      'lazyMount',
      'modal',
      'persistentElements',
      'preventScroll',
      'restoreFocus',
      'role',
      'trapFocus',
      'triggerValue',
      'unmountOnExit',
    ] as const),
    'onUpdate:open': (val: boolean) => {
      open.value = val
    },
    open: open.value,
  }
})

/**
 * Zag defers return focus with `setTimeout(0)`; in some layouts (e.g. teleported modal +
 * inert siblings) the trap can fall back to the trigger. Re-apply `finalFocusEl` on the next
 * macrotask so the intended target wins after teardown and aria/inert cleanup.
 */
watch(
  open,
  (isOpen, wasOpen) => {
    if (props.value !== undefined) return
    if (wasOpen !== true || isOpen !== false || props.finalFocusEl === undefined) return
    void nextTick(() => {
      setTimeout(() => {
        if (!import.meta.client) return
        const raw = props.finalFocusEl?.()
        const el = raw === null || raw === undefined ? undefined : raw
        el?.focus({ preventScroll: true })
      }, 0)
    })
  },
  { flush: 'post' },
)

const backdropLayerRef = useLayerZIndexRef('modal')
const positionerLayerRef = useLayerZIndexRef('modal')

extendCompodiumMeta({
  defaultProps: {
    description: 'A concise description of the dialog content.',
    title: 'Dialog Title',
  },
})
</script>

<template>
  <component :is="rootComponent" v-bind="{ ...rootAttrs, ...rootProps }">
    <ArkDialog.Context v-slot="dialog">
      <!-- Trigger area -->
      <slot name="triggers" :trigger="ArkDialog.Trigger" :dialog="dialog">
        <ArkDialog.Trigger v-if="!hideTrigger" as-child>
          <slot name="trigger">
            <UIButton type="button" variant="subtle" :intent>{{ $t('open') }}</UIButton>
          </slot>
        </ArkDialog.Trigger>
      </slot>

      <Teleport to="body" :disabled="!portalled">
        <ArkDialog.Backdrop
          v-if="modal"
          :ref="backdropLayerRef"
          :class="cn(dialogBackdropCVA(), ui?.backdrop)"
        />

        <ArkDialog.Positioner
          :ref="positionerLayerRef"
          :class="cn(dialogPositionerCVA({ scrollBehavior }), ui?.positioner)"
        >
          <ArkDialog.Content
            :class="cn(dialogContentCVA({ size, intent, scrollBehavior }), ui?.content)"
          >
            <slot name="header" :dialog="dialog">
              <div :class="cn(dialogHeaderCVA(), ui?.header)">
                <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                  <ArkDialog.Title
                    v-if="title || $slots.title"
                    :class="cn(dialogTitleCVA({ intent }), ui?.title)"
                  >
                    <slot name="title">{{ title }}</slot>
                  </ArkDialog.Title>
                  <ArkDialog.Description
                    v-if="description || $slots.description"
                    :class="cn(dialogDescriptionCVA({ intent }), ui?.description)"
                  >
                    <slot name="description">{{ description }}</slot>
                  </ArkDialog.Description>
                </div>
                <ArkDialog.CloseTrigger
                  v-if="showCloseTrigger"
                  :class="cn('-mt-1 shrink-0', ui?.closeTrigger)"
                >
                  <slot name="close-trigger">
                    <UIButton type="button" size="sm" variant="ghost" icon="tabler:x" :intent />
                  </slot>
                </ArkDialog.CloseTrigger>
              </div>
            </slot>

            <div
              :class="cn('flex-1 p-4', scrollBehavior === 'inside' && 'overflow-y-auto', ui?.body)"
            >
              <slot :dialog="dialog" />
            </div>

            <div v-if="$slots.footer" :class="cn(dialogFooterCVA({ size }), ui?.footer)">
              <slot name="footer" :dialog="dialog" />
            </div>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Teleport>
    </ArkDialog.Context>
  </component>
</template>

<style scoped>
/* Nested dialog: scale down the parent content when a child dialog opens */
:deep([data-part='content'][data-has-nested]) {
  transform: scale(calc(1 - var(--nested-layer-count, 0) * 0.05));
  transition: transform 0.2s ease;
}
</style>
