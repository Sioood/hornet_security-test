<script setup lang="ts">
import {
  SegmentGroup as ArkSegmentGroup,
  type SegmentGroupRootBaseProps as ArkSegmentGroupRootBaseProps,
  type SegmentGroupRootProviderBaseProps as ArkSegmentGroupRootProviderBaseProps,
  type UseSegmentGroupReturn,
} from '@ark-ui/vue/segment-group'

import {
  segmentedRootCVA,
  type SegmentedOrientation,
  type SegmentedVariant,
} from '~/utils/Components/Segmented/variants'
import {
  segmentGroupChromeKey,
  type SegmentGroupIntent,
  type SegmentGroupSize,
} from '~/utils/Components/SegmentGroup/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UISegmentGroupSlots {
  root?: ClassValue
  indicator?: ClassValue
  item?: ClassValue
  itemControl?: ClassValue
  itemText?: ClassValue
}

interface SegmentGroupOption {
  disabled?: boolean
  value: string
  label?: string
}

export interface SegmentGroupProps
  extends ArkSegmentGroupRootBaseProps, Omit<ArkSegmentGroupRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useSegmentGroup()` to enable **RootProvider** mode.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseSegmentGroupReturn['value']
  /** Visual style variant. @default 'default' */
  variant?: SegmentedVariant
  /** Visual intent for the group. @default 'primary' */
  intent?: SegmentGroupIntent
  /** Visual size for the items. @default 'md' */
  size?: SegmentGroupSize
  /** Layout orientation. @default 'horizontal' */
  orientation?: SegmentedOrientation
  /** Predefined options to render. */
  options?: SegmentGroupOption[]
  /** Slot-level class overrides. */
  ui?: Partial<UISegmentGroupSlots>
}

const modelValue = defineModel<string>()

const props = withDefaults(defineProps<SegmentGroupProps>(), {
  disabled: false,
  intent: 'primary',
  options: () => [],
  orientation: 'horizontal',
  size: 'md',
  ui: undefined,
  value: undefined,
  variant: 'line',
})

const attrs = useAttrs()

provide(segmentGroupChromeKey, {
  intent: computed(() => props.intent),
  orientation: computed(() => props.orientation),
  size: computed(() => props.size),
  variant: computed(() => props.variant),
})

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkSegmentGroup.RootProvider : ArkSegmentGroup.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  return pick(props, ['asChild', 'defaultValue', 'disabled', 'id', 'ids', 'orientation'] as const)
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const resolvedOptions = computed(() => (props.options.length > 0 ? props.options : []))

const rootClass = computed(() =>
  cn(
    segmentedRootCVA({
      intent: props.intent,
      orientation: props.orientation,
      size: props.size,
      variant: props.variant,
    }),
    arkAttrs.value.class as string,
    props.ui?.root,
  ),
)

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    modelValue: 'react',
    options: [
      { label: 'React', value: 'react' },
      { label: 'Solid', value: 'solid' },
      { label: 'Svelte', value: 'svelte' },
      { label: 'Vue', value: 'vue' },
    ],
    orientation: 'horizontal',
    size: 'md',
    variant: 'line',
  },
})
</script>

<template>
  <component
    :is="rootComponent"
    v-if="isProvider"
    v-bind="{ ...rootProps, ...arkAttrs, class: rootClass }"
  >
    <UISegmentGroupIndicator :class="ui?.indicator" />
    <UISegmentGroupItem
      v-for="option in resolvedOptions"
      :key="option.value"
      :value="option.value"
      :disabled="props.disabled || option.disabled"
      :ui="{ root: ui?.item }"
    >
      <UISegmentGroupItemText :ui="{ root: ui?.itemText }">
        {{ option.label ?? option.value }}
      </UISegmentGroupItemText>
      <UISegmentGroupItemControl :ui="{ root: cn('hidden', ui?.itemControl) }" />
      <UISegmentGroupItemHiddenInput />
    </UISegmentGroupItem>
    <slot />
  </component>

  <component
    :is="rootComponent"
    v-else
    v-bind="{ ...rootProps, ...arkAttrs, class: rootClass }"
    :model-value="modelValue"
    @update:model-value="(next) => (modelValue = next ?? undefined)"
    @value-change="(details) => (modelValue = details.value ?? undefined)"
  >
    <UISegmentGroupIndicator :class="ui?.indicator" />
    <UISegmentGroupItem
      v-for="option in resolvedOptions"
      :key="option.value"
      :value="option.value"
      :disabled="props.disabled || option.disabled"
      :ui="{ root: ui?.item }"
    >
      <UISegmentGroupItemText :ui="{ root: ui?.itemText }">
        {{ option.label ?? option.value }}
      </UISegmentGroupItemText>
      <UISegmentGroupItemControl :ui="{ root: cn('hidden', ui?.itemControl) }" />
      <UISegmentGroupItemHiddenInput />
    </UISegmentGroupItem>
    <slot />
  </component>
</template>

<style scoped>
:deep([data-part='indicator']) {
  left: var(--left);
  top: var(--top);
  width: var(--width);
  height: var(--height);
}
</style>
