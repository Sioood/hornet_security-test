import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { assertNever } from '~nuxt-essentials/app/utils/assert-never'

export type ComponentState = 'default' | 'loading' | 'success' | 'warning' | 'error' | 'info'

export type IconMode = 'leadingAndTrailing' | 'single'

export interface UseComponentIconsInputProps {
  icon?: string
  leading?: boolean
  leadingIcon?: string
  trailing?: boolean
  trailingIcon?: string
  state?: ComponentState
  loadingIcon?: string
  successIcon?: string
  warningIcon?: string
  errorIcon?: string
  infoIcon?: string
  mode?: IconMode
}

export type UseComponentIconsProps = Omit<UseComponentIconsInputProps, 'mode'>

export const useSemanticIcons: Record<Exclude<ComponentState, 'default'>, string> = {
  error: 'tabler:alert-hexagon',
  info: 'tabler:info-circle',
  loading: 'tabler:loader',
  success: 'tabler:circle-check',
  warning: 'tabler:alert-triangle',
}

export function useComponentIcons(componentProps: MaybeRefOrGetter<UseComponentIconsInputProps>) {
  const props = computed(() => toValue(componentProps))
  const mode = computed(() => props.value.mode || 'leadingAndTrailing')
  const state = computed(() => props.value.state ?? 'default')

  const isLeading = computed(
    () =>
      mode.value === 'leadingAndTrailing' &&
      ((props.value.icon && props.value.leading) ||
        (props.value.icon && !props.value.trailing) ||
        (state.value !== 'default' && !props.value.trailing) ||
        !!props.value.leadingIcon),
  )
  const isTrailing = computed(
    () =>
      mode.value === 'leadingAndTrailing' &&
      ((props.value.icon && props.value.trailing) ||
        (state.value !== 'default' && props.value.trailing) ||
        !!props.value.trailingIcon),
  )

  const getStateIcon = (iconState: ComponentState): string => {
    switch (iconState) {
      case 'loading':
        return props.value.loadingIcon || useSemanticIcons.loading
      case 'success':
        return props.value.successIcon || useSemanticIcons.success
      case 'warning':
        return props.value.warningIcon || useSemanticIcons.warning
      case 'error':
        return props.value.errorIcon || useSemanticIcons.error
      case 'info':
        return props.value.infoIcon || useSemanticIcons.info
      case 'default':
        return ''
      default:
        assertNever(state)
    }
  }

  const leadingIconName = computed(() => {
    const stateIcon = getStateIcon(state.value)
    if (stateIcon) return stateIcon

    return props.value.leadingIcon || props.value.icon || ''
  })

  const trailingIconName = computed(() => {
    const stateIcon = getStateIcon(state.value)
    if (stateIcon && !isLeading.value) return stateIcon

    return props.value.trailingIcon || props.value.icon || ''
  })

  const iconName = computed(() => {
    const stateIcon = getStateIcon(state.value)
    if (stateIcon) return stateIcon

    return props.value.icon || props.value.leadingIcon || ''
  })

  const shouldAnimate = computed(() => state.value === 'loading')

  return {
    iconName,
    isLeading,
    isTrailing,
    leadingIconName,
    shouldAnimate,
    trailingIconName,
  }
}
