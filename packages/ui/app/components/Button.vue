<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { mergeProps, type ClassValue, type ComponentPublicInstance } from 'vue'

import { buttonCVA as button } from '~/utils/Components/Button/variants'
import {
  useComponentIcons,
  type UseComponentIconsProps,
  type ComponentState,
} from '~ui/app/composables/useComponentIcons'
import { cn } from '~ui/app/utils/cn'

import Link from './Link.vue'

import type { NuxtLinkProps } from '#app'

defineOptions({ inheritAttrs: false })

type ButtonCVAProps = VariantProps<typeof button>

const buttonIconCVA = cva('shrink-0', {
  variants: {
    size: {
      lg: 'size-4',
      md: 'size-3',
      sm: 'size-2.5',
    },
  },
})

export interface UIButtonSlots {
  root?: ClassValue
  leadingIcon?: ClassValue
  trailingIcon?: ClassValue
}

export interface ButtonProps extends /* @vue-ignore */ NuxtLinkProps, UseComponentIconsProps {
  to?: NuxtLinkProps['to']
  /**
   * text to display in the button
   * used if no slot is provided
   */
  text?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: ButtonCVAProps['variant']
  intent?: ButtonCVAProps['intent']
  size?: ButtonCVAProps['size']
  handleLoadingState?: boolean
  state?: ComponentState
  /** Receives the DOM click event when provided (Ark/Radix triggers pass `MouseEvent`). */
  onClick?: (event?: MouseEvent) => void | Promise<void>
  autoResetDelay?: number
  onStateChange?: (state: ComponentState) => void
  ui?: Partial<UIButtonSlots>
}

export interface UIButtonExpose {
  getControlElement: () => HTMLElement | null
  focus: () => void
}

const props = withDefaults(defineProps<ButtonProps>(), {
  autoResetDelay: 3500,
  disabled: false,
  handleLoadingState: false,
  intent: 'primary',
  onClick: undefined,
  onStateChange: undefined,
  size: 'md',
  state: 'default',
  text: '',
  to: undefined,
  type: 'button',
  ui: undefined,
  variant: 'default',
})

const internalState = ref<ComponentState>(props.state || 'default')

const effectiveState = computed(() => internalState.value || props.state)

const propsWithState = computed(() => ({ ...props, state: effectiveState.value }))

const { isLeading, isTrailing, leadingIconName, trailingIconName, shouldAnimate } =
  useComponentIcons(propsWithState)

const iconClass = (slotClass: ClassValue | undefined) =>
  cn(buttonIconCVA({ size: props.size }), { 'animate-spin': shouldAnimate.value }, slotClass)

const linkProps = computed(
  () => props as Omit<typeof props, keyof ButtonProps | keyof UseComponentIconsProps>,
)

const attrs = useAttrs()

const buttonRootAttrs = computed(() => {
  const { class: _cls, ...rest } = attrs as Record<string, unknown> & { class?: unknown }
  return rest
})

const handleClick = async (event: MouseEvent) => {
  if (!props.onClick || props.to || internalState.value !== 'default' || props.disabled) return

  if (!props.handleLoadingState) {
    await Promise.resolve(props.onClick(event))
    return
  }

  internalState.value = 'loading'
  props.onStateChange?.('loading')
  try {
    await props.onClick(event)

    internalState.value = 'success'
    props.onStateChange?.('success')
  } catch {
    internalState.value = 'error'
    props.onStateChange?.('error')
  }

  if (
    props.autoResetDelay &&
    (internalState.value === 'success' || internalState.value === 'error')
  ) {
    setTimeout(() => {
      internalState.value = 'default'
      props.onStateChange?.('default')
    }, props.autoResetDelay)
  }
}

const rootRef = ref<ComponentPublicInstance | HTMLElement | null>(null)

const controlElement = computed((): HTMLElement | null => {
  const r = rootRef.value
  if (!r) return null
  if (r instanceof HTMLElement) return r
  const el = (r as ComponentPublicInstance).$el
  return el instanceof HTMLElement ? el : null
})

defineExpose({
  focus: (): void => {
    controlElement.value?.focus()
  },
  getControlElement: (): HTMLElement | null => controlElement.value,
} satisfies UIButtonExpose)

extendCompodiumMeta({
  defaultProps: {
    disabled: false,
    errorIcon: 'tabler:alert-hexagon',
    icon: 'tabler:scribble',
    intent: 'primary',
    leading: true,
    loadingIcon: 'tabler:loader',
    size: 'md',
    state: 'default',
    successIcon: 'tabler:circle-check',
    text: 'Button',
    trailing: true,
    variant: 'default',
    warningIcon: 'tabler:alert-triangle',
  },
})
</script>

<template>
  <component
    :is="to ? Link : 'button'"
    ref="rootRef"
    v-bind="
      mergeProps(
        buttonRootAttrs,
        to
          ? { ...linkProps, disabled }
          : {
              type,
              disabled: props.disabled || effectiveState === 'loading',
              onClick: handleClick,
            },
      )
    "
    :class="
      cn(
        button({
          variant,
          intent: ['success', 'error'].includes(effectiveState)
            ? (effectiveState as 'success' | 'error')
            : intent,
          size,
          disabled: disabled || effectiveState !== 'default',
        }),
        attrs.class,
        ui?.root,
      )
    "
  >
    <Icon v-if="isLeading" :name="leadingIconName" :class="iconClass(ui?.leadingIcon)" />
    <slot>
      {{ text }}
    </slot>
    <Icon v-if="isTrailing" :name="trailingIconName" :class="iconClass(ui?.trailingIcon)" />
  </component>
</template>
