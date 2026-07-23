<script setup lang="ts">
import type {
  RatingGroupRootBaseProps,
  RatingGroupRootProviderBaseProps,
  UseRatingGroupItemContext,
  UseRatingGroupReturn,
} from '@ark-ui/vue/rating-group'
import type { UnwrapRef } from 'vue'
import type {
  RatingIntent,
  RatingSize,
  UIRatingSlots,
} from '~/utils/Components/Form/Rating/context'
import type { FieldProps } from '~ui/app/components/Form/Field.vue'

export type RatingItemState = UnwrapRef<UseRatingGroupItemContext>

defineOptions({ inheritAttrs: false })

export type { RatingIntent, RatingSize, UIRatingSlots }

export interface RatingProps
  extends
    Omit<RatingGroupRootBaseProps, 'modelValue'>,
    Omit<RatingGroupRootProviderBaseProps, 'value'>,
    Omit<FieldProps, 'ui' | 'hideLabel' | 'intent' | 'size' | 'ids'> {
  /** Pass the return value of `useRatingGroup()` to enable RootProvider mode. */
  value?: UseRatingGroupReturn
  intent?: RatingIntent
  size?: RatingSize
  ui?: Partial<UIRatingSlots>
}

const modelValue = defineModel<number>({ required: false })

const props = withDefaults(defineProps<RatingProps>(), {
  allowHalf: false,
  count: 5,
  defaultValue: undefined,
  disabled: undefined,
  error: undefined,
  form: undefined,
  helperText: undefined,
  id: undefined,
  intent: 'primary',
  label: undefined,
  name: undefined,
  readOnly: undefined,
  required: undefined,
  size: 'md',
  translations: undefined,
  ui: undefined,
  value: undefined,
})

const attrs = useAttrs()

const invalid = computed(() => Boolean(props.invalid || String(props.error ?? '').length > 0))

const isProvider = computed(() => props.value !== undefined)

const rootPassthrough = computed(() => {
  const { error: _error, helperText: _helperText, label: _label, ui: _ui, ...rest } = props
  return rest
})

const fieldProps = computed(() => ({
  ...pick(props, [
    'asChild',
    'disabled',
    'error',
    'helperText',
    'id',
    'label',
    'readOnly',
    'required',
    'size',
  ] as const),
  hideLabel: false,
  intent: props.intent,
  invalid: invalid.value,
  ui: {
    error: props.ui?.error,
    helperText: props.ui?.helperText,
    label: props.ui?.label,
    requiredIndicator: props.ui?.requiredIndicator,
    root: props.ui?.root,
  },
}))

function formatValue(value: number | undefined, count: number): string {
  return `${value ?? 0}/${count}`
}

extendCompodiumMeta({
  defaultProps: {
    count: 5,
    defaultValue: 3,
    helperText: 'Select a rating from 1 to 5',
    intent: 'primary',
    label: 'Rating',
    size: 'md',
  },
})
</script>

<template>
  <UIFormField v-bind="fieldProps">
    <UIFormRatingRoot v-if="isProvider" v-bind="{ ...rootPassthrough, ...attrs }" :intent :size>
      <div class="flex flex-wrap items-center gap-2">
        <UIFormRatingControl :ui="ui?.control">
          <UIFormRatingContext v-slot="{ items }">
            <UIFormRatingItem
              v-for="itemIndex in items"
              :key="itemIndex"
              :index="itemIndex"
              :ui="ui?.item"
            >
              <UIFormRatingItemContext v-slot="itemState">
                <slot name="item" :index="itemIndex" v-bind="itemState">
                  <UIFormRatingStarIndicator
                    :half="itemState.half"
                    :highlighted="itemState.highlighted"
                    :intent
                    :size
                    :ui="ui?.itemIndicator"
                  />
                </slot>
              </UIFormRatingItemContext>
            </UIFormRatingItem>
          </UIFormRatingContext>

          <UIFormRatingHiddenInput :ui="ui?.hiddenInput" />
        </UIFormRatingControl>

        <slot name="value-text" :value="undefined" :count :format="formatValue" />
      </div>

      <slot />
    </UIFormRatingRoot>

    <UIFormRatingRoot
      v-else
      v-bind="{ ...rootPassthrough, ...attrs }"
      v-model="modelValue"
      :intent
      :size
    >
      <div class="flex flex-wrap items-center gap-2">
        <UIFormRatingControl :ui="ui?.control">
          <UIFormRatingContext v-slot="{ items }">
            <UIFormRatingItem
              v-for="itemIndex in items"
              :key="itemIndex"
              :index="itemIndex"
              :ui="ui?.item"
            >
              <UIFormRatingItemContext v-slot="itemState">
                <slot name="item" :index="itemIndex" v-bind="itemState">
                  <UIFormRatingStarIndicator
                    :half="itemState.half"
                    :highlighted="itemState.highlighted"
                    :intent
                    :size
                    :ui="ui?.itemIndicator"
                  />
                </slot>
              </UIFormRatingItemContext>
            </UIFormRatingItem>
          </UIFormRatingContext>

          <UIFormRatingHiddenInput :ui="ui?.hiddenInput" />
        </UIFormRatingControl>

        <slot name="value-text" :value="modelValue" :count :format="formatValue" />
      </div>

      <slot />
    </UIFormRatingRoot>
  </UIFormField>
</template>
