<script setup lang="ts">
import {
  RatingGroup as ArkRatingGroup,
  type RatingGroupRootBaseProps,
  type RatingGroupRootProviderBaseProps,
  type UseRatingGroupReturn,
} from '@ark-ui/vue/rating-group'

import {
  ratingChromeKey,
  type RatingIntent,
  type RatingSize,
  type UIRatingSlots,
} from '~/utils/Components/Form/Rating/context'
import { ratingRootCVA } from '~/utils/Components/Form/Rating/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIFormRatingRootSlots {
  root?: ClassValue
}

export interface RatingRootProps
  extends
    Omit<RatingGroupRootBaseProps, 'modelValue'>,
    Omit<RatingGroupRootProviderBaseProps, 'value'> {
  /** Pass the return value of `useRatingGroup()` to enable RootProvider mode. */
  value?: UseRatingGroupReturn
  intent?: RatingIntent
  size?: RatingSize
  ui?: Partial<UIFormRatingRootSlots & UIRatingSlots>
}

const props = withDefaults(defineProps<RatingRootProps>(), {
  intent: 'primary',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const modelValue = defineModel<number>({ required: false })

const attrs = useAttrs()

provide(ratingChromeKey, {
  intent: toRef(props, 'intent'),
  size: toRef(props, 'size'),
})

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkRatingGroup.RootProvider : ArkRatingGroup.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'])
  }
  return pick(props, [
    'allowHalf',
    'asChild',
    'autoFocus',
    'count',
    'defaultValue',
    'disabled',
    'form',
    'id',
    'ids',
    'name',
    'readOnly',
    'required',
    'translations',
  ] as const)
})

const arkAttrs = computed(() => splitArkAttrs(attrs, ['ui', 'intent', 'size']))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(
      ratingRootCVA({ intent: props.intent }),
      arkAttrs.value.class as ClassValue,
      props.ui?.root,
    ),
  }

  if (!isProvider.value && modelValue.value !== undefined) {
    base.modelValue = modelValue.value
    base['onUpdate:modelValue'] = (next: number) => {
      modelValue.value = next
    }
  }

  return base
})

extendCompodiumMeta({
  defaultProps: {
    count: 5,
    defaultValue: 3,
    intent: 'primary',
    size: 'md',
  },
})
</script>

<template>
  <component :is="rootComponent" v-bind="rootBindings">
    <slot />
  </component>
</template>
