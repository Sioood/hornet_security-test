<script setup lang="ts">
import {
  DatePicker as ArkDatePicker,
  type DatePickerDateView,
  type DatePickerRootBaseProps,
  type DatePickerRootProviderBaseProps,
  type UseDatePickerReturn,
} from '@ark-ui/vue/date-picker'

import {
  datePickerChromeKey,
  type DatePickerIntent,
  type DatePickerSize,
  type UIDatePickerSlots,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerRootCVA } from '~/utils/Components/Form/DatePicker/variants'

import type { DateValue } from '@internationalized/date'
import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIFormDatePickerRootSlots {
  root?: ClassValue
}

/** Forwards Ark `DatePicker.Root` props, events, and render strategy. */
export interface DatePickerRootProps
  extends
    Omit<DatePickerRootBaseProps, 'modelValue' | 'open' | 'focusedValue' | 'view'>,
    Omit<DatePickerRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useDatePicker()` to enable **RootProvider** mode.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseDatePickerReturn['value']
  intent?: DatePickerIntent
  size?: DatePickerSize
  ui?: Partial<UIFormDatePickerRootSlots & UIDatePickerSlots>
}

const props = withDefaults(defineProps<DatePickerRootProps>(), {
  intent: 'primary',
  locale: undefined,
  size: 'md',
  startOfWeek: undefined,
  ui: undefined,
  value: undefined,
})

const { locale: i18nLocale } = useI18n()

const modelValue = defineModel<DateValue[]>()
const open = defineModel<boolean>('open')
const focusedValue = defineModel<DateValue>('focusedValue')
const view = defineModel<DatePickerDateView>('view')

const attrs = useAttrs()

provide(datePickerChromeKey, {
  intent: toRef(props, 'intent'),
  size: toRef(props, 'size'),
})

const isProvider = computed(() => props.value !== undefined)

// weekInfo is available at runtime (ES2024, Node 25+) but missing from TS Intl.Locale typings.
interface IntlLocaleWithWeekInfo {
  weekInfo?: { firstDay?: number }
}

function resolveStartOfWeek(locale: string): number {
  try {
    const intlLocale = new Intl.Locale(locale) as Intl.Locale & IntlLocaleWithWeekInfo
    const firstDay = intlLocale.weekInfo?.firstDay
    if (firstDay === 7) return 0
    if (firstDay !== undefined) return firstDay
  } catch {
    // Intl.Locale weekInfo unavailable
  }
  return 1
}

const resolvedLocale = computed(() => props.locale ?? i18nLocale.value)
const resolvedStartOfWeek = computed(
  () => props.startOfWeek ?? resolveStartOfWeek(resolvedLocale.value),
)

const rootComponent = computed(() =>
  isProvider.value ? ArkDatePicker.RootProvider : ArkDatePicker.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'lazyMount', 'unmountOnExit', 'value'])
  }
  return pick(props, [
    'asChild',
    'closeOnSelect',
    'createCalendar',
    'defaultFocusedValue',
    'defaultOpen',
    'defaultValue',
    'defaultView',
    'disabled',
    'fixedWeeks',
    'format',
    'id',
    'ids',
    'inline',
    'invalid',
    'isDateUnavailable',
    'lazyMount',
    'max',
    'maxSelectedDates',
    'maxView',
    'min',
    'minView',
    'name',
    'numOfMonths',
    'openOnClick',
    'outsideDaySelectable',
    'parse',
    'placeholder',
    'positioning',
    'readOnly',
    'required',
    'selectionMode',
    'showWeekNumbers',
    'timeZone',
    'translations',
    'unmountOnExit',
  ])
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootClass = computed(() =>
  cn(datePickerRootCVA(), arkAttrs.value.class as ClassValue, props.ui?.root),
)

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: rootClass.value,
    locale: resolvedLocale.value,
    startOfWeek: resolvedStartOfWeek.value,
  }

  if (!isProvider.value) {
    if (open.value !== undefined) {
      base.open = open.value
      base['onUpdate:open'] = (next: boolean) => {
        open.value = next
      }
    }
    if (focusedValue.value !== undefined) {
      base.focusedValue = focusedValue.value
      base['onUpdate:focusedValue'] = (next: DateValue) => {
        focusedValue.value = next
      }
    }
    if (view.value !== undefined) {
      base.view = view.value
      base['onUpdate:view'] = (next: DatePickerDateView) => {
        view.value = next
      }
    }
  }

  return base
})

function onValueChange(details: { value: DateValue[] }) {
  if (modelValue.value !== undefined) {
    modelValue.value = details.value
  }
}

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    size: 'md',
  },
})
</script>

<template>
  <component :is="rootComponent" v-if="isProvider" v-bind="rootBindings">
    <slot />
  </component>

  <component
    :is="rootComponent"
    v-else
    v-bind="rootBindings"
    :model-value="modelValue"
    @update:model-value="(next: DateValue[]) => (modelValue = next)"
    @value-change="onValueChange"
  >
    <slot />
  </component>
</template>
