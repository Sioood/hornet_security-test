<script setup lang="ts">
import {
  ToggleGroup as ArkToggleGroup,
  type ToggleGroupRootBaseProps as ArkToggleGroupRootBaseProps,
  type ToggleGroupRootProviderBaseProps as ArkToggleGroupRootProviderBaseProps,
  type UseToggleGroupReturn,
} from '@ark-ui/vue/toggle-group'
import { cva } from 'class-variance-authority'

import type { ClassValue } from 'vue'
import type {
  ToggleGroupOrientation,
  ToggleIntent,
  ToggleSize,
  ToggleVariant,
  UIToggleGroupSlots,
} from '~/utils/Components/Toggle/context'

export type { UIToggleGroupSlots } from '~/utils/Components/Toggle/context'

defineOptions({ inheritAttrs: false })

const groupRootCVA = cva('join', {
  variants: {
    orientation: {
      horizontal: 'join-horizontal',
      vertical: 'join-vertical',
    } satisfies Record<ToggleGroupOrientation, string>,
  },
})

export interface ToggleGroupOption {
  disabled?: boolean
  icon?: string
  title?: string
  value: string
}

interface ToggleGroupProps
  extends ArkToggleGroupRootBaseProps, Omit<ArkToggleGroupRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useToggleGroup()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseToggleGroupReturn['value']
  activeBackground?: boolean
  iconOnly?: boolean
  intent?: ToggleIntent
  options?: ToggleGroupOption[]
  size?: ToggleSize
  ui?: Partial<UIToggleGroupSlots>
  variant?: ToggleVariant
}

const modelValue = defineModel<string[]>({ required: false })

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  activeBackground: false,
  iconOnly: false,
  intent: 'primary',
  options: () => [],
  orientation: 'horizontal',
  size: 'sm',
  ui: undefined,
  value: undefined,
  variant: 'default',
})

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkToggleGroup.RootProvider : ArkToggleGroup.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  return pick(props, [
    'asChild',
    'defaultValue',
    'deselectable',
    'disabled',
    'id',
    'ids',
    'loopFocus',
    'multiple',
    'orientation',
    'rovingFocus',
  ] as const)
})

const attrs = useAttrs()
const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootClass = computed(() =>
  cn(
    groupRootCVA({ orientation: props.orientation }),
    arkAttrs.value.class as ClassValue,
    props.ui?.root,
  ),
)

const coalescedValue = computed(() => modelValue.value ?? [])

function handleModelValueUpdate(next: string[] | null) {
  modelValue.value = next ?? []
}

function handleValueChange(details: { value: string[] }) {
  modelValue.value = details.value
}

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: rootClass.value,
  }

  if (!isProvider.value) {
    base.modelValue = coalescedValue.value
    base['onUpdate:modelValue'] = handleModelValueUpdate
    base.onValueChange = handleValueChange
  }

  return base
})

function isOptionPressed(optionValue: string) {
  return coalescedValue.value.includes(optionValue)
}
</script>

<template>
  <component :is="rootComponent" v-bind="rootBindings">
    <ArkToggleGroup.Item
      v-for="option in options"
      :key="option.value"
      as-child
      :value="option.value"
      :disabled="disabled || option.disabled"
    >
      <UIToggle
        group-item
        :pressed="isOptionPressed(option.value)"
        :active-background="activeBackground"
        :disabled="disabled || option.disabled"
        :icon-only="iconOnly"
        :intent
        :size
        :variant
        :ui="{ root: ui?.item }"
      >
        <template #on>
          <slot name="item" :option="option" :pressed="true">
            <Icon v-if="option.icon" :name="option.icon" class="size-4 shrink-0" />
            <span v-if="option.title">{{ option.title }}</span>
          </slot>
        </template>
        <template #off>
          <slot name="item" :option="option" :pressed="false">
            <Icon v-if="option.icon" :name="option.icon" class="size-4 shrink-0" />
            <span v-if="option.title">{{ option.title }}</span>
          </slot>
        </template>
      </UIToggle>
    </ArkToggleGroup.Item>
  </component>
</template>
