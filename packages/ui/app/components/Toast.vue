<script setup lang="ts">
import { Toast as ArkToast, Toaster as ArkToaster, type ToasterBaseProps } from '@ark-ui/vue/toast'
import { cva, type VariantProps } from 'class-variance-authority'

import {
  useComponentIcons,
  type ComponentState,
  type UseComponentIconsProps,
} from '~ui/app/composables/useComponentIcons'

import { useLayerZIndexRef } from '~/composables/useLayerZIndexRef'

import type { ClassValue } from 'vue'

type ToastIntent =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
type ToastSize = 'md'

const toaster = useToast()

const toastRootCVA = cva(
  'z-index-(--z-index) relative h-(--height) translate-x-(--x) translate-y-(--y) scale-(--scale) flex-col overflow-hidden border opacity-(--opacity) transition-all duration-300 ease-in-out will-change-[transform,opacity]',
  {
    variants: {
      intent: {
        accent: 'border-accent-border bg-accent-surface text-accent-text',
        error: 'border-error-border bg-error-surface text-error-text',
        info: 'border-info-border bg-info-surface text-info-text',
        neutral: 'border-neutral-border bg-neutral-surface text-neutral-text',
        primary: 'border-primary-border bg-primary-surface text-primary-text',
        secondary: 'border-secondary-border bg-secondary-surface text-secondary-text',
        success: 'border-success-border bg-success-surface text-success-text',
        warning: 'border-warning-border bg-warning-surface text-warning-text',
      } satisfies Record<ToastIntent, string>,
      size: {
        md: 'min-w-64 rounded-xs p-2 pr-12',
      } satisfies Record<ToastSize, string>,
    },
  },
)

type ToastRootCVAProps = VariantProps<typeof toastRootCVA>

const toastTitleCVA = cva('inline-flex gap-2', {
  variants: {
    size: {
      md: 'txt-base',
    } satisfies Record<ToastSize, string>,
  },
})

const toastDescriptionCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      error: 'text-error-text-subtle',
      info: 'text-info-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
      success: 'text-success-text-subtle',
      warning: 'text-warning-text-subtle',
    } satisfies Record<ToastIntent, string>,
    size: {
      md: 'txt-caption',
    } satisfies Record<ToastSize, string>,
  },
})

const toastErrorCVA = cva('', {
  variants: {
    size: {
      md: 'absolute top-2 right-2',
    } satisfies Record<ToastSize, string>,
  },
})

const toastActionCVA = cva('', {
  variants: {
    size: {
      md: 'mt-2',
    } satisfies Record<ToastSize, string>,
  },
})

interface UIToastSlots {
  root?: ClassValue
  title?: ClassValue
  description?: ClassValue
  action?: ClassValue
  closeTrigger?: ClassValue
}
export interface ToastProps extends Omit<ToasterBaseProps, 'toaster'>, UseComponentIconsProps {
  size?: ToastRootCVAProps['size']
  ui?: Partial<UIToastSlots>
}

const props = withDefaults(defineProps<ToastProps>(), {
  size: 'md',
  ui: undefined,
})

const toasterProps = computed(() => pick(props, ['asChild'] as const))

const iconCache = new Map<string, ReturnType<typeof useComponentIcons>>()

const resolveToastMeta = (type: string | undefined) => {
  const cacheKey = type ?? '__neutral__'
  if (!iconCache.has(cacheKey)) {
    iconCache.set(cacheKey, useComponentIcons({ mode: 'single', state: type as ComponentState }))
  }
  return {
    iconName: iconCache.get(cacheKey)!.iconName,
    intent: getType(type),
    shouldAnimate: iconCache.get(cacheKey)!.shouldAnimate,
  }
}

const getType = (type: string | undefined): ToastRootCVAProps['intent'] | undefined => {
  const possibleTypes = ['primary', 'secondary', 'accent', 'info', 'warning', 'error', 'success']
  if (!type || !possibleTypes.includes(type)) {
    return 'neutral'
  }
  return type as ToastRootCVAProps['intent']
}

const toastLayerRef = useLayerZIndexRef('toast')
</script>

<template>
  <Teleport v-if="toaster" to="body">
    <ArkToaster v-slot="toast" :ref="toastLayerRef" :toaster="toaster" v-bind="toasterProps">
      <ArkToast.Root
        :class="
          cn(
            toastRootCVA({
              intent: getType(toast.meta?.type ?? toast.type),
              size,
            }),
            ui?.root,
          )
        "
      >
        <ArkToast.Title :class="cn(toastTitleCVA({ size }), ui?.title)">
          <Icon
            :name="resolveToastMeta(toast.meta?.type ?? toast.type).iconName.value"
            :class="{
              'animate-spin': resolveToastMeta(toast.meta?.type ?? toast.type).shouldAnimate.value,
            }"
          />
          {{ toast.title }}
        </ArkToast.Title>
        <ArkToast.Description
          v-if="toast.description"
          :class="
            cn(
              toastDescriptionCVA({ intent: getType(toast.meta?.type ?? toast.type), size }),
              ui?.description,
            )
          "
        >
          {{ toast.description }}
        </ArkToast.Description>

        <slot :toast="toast" />

        <ArkToast.ActionTrigger
          v-if="toast.action"
          :class="cn(toastActionCVA({ size }), ui?.action)"
        >
          <UIButton size="sm" :intent="getType(toast.meta?.type ?? toast.type)">
            {{ toast.action.label }}
          </UIButton>
        </ArkToast.ActionTrigger>

        <ArkToast.CloseTrigger
          v-if="toast.closable"
          :class="cn(toastErrorCVA({ size }), ui?.closeTrigger)"
        >
          <UIButton
            size="sm"
            variant="ghost"
            icon="tabler:x"
            :intent="getType(toast.meta?.type ?? toast.type)"
          />
        </ArkToast.CloseTrigger>
      </ArkToast.Root>
    </ArkToaster>
  </Teleport>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  :deep(.toastRoot) {
    transition-duration: 0ms !important;
  }
}
</style>
