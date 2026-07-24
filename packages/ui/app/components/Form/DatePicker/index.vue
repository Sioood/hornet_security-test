<script setup lang="ts">
import {
  type DatePickerDateView,
  type DatePickerRootBaseProps,
  type DatePickerRootProviderBaseProps,
  type UseDatePickerReturn,
} from '@ark-ui/vue/date-picker'

import type { FormControlShellProps } from '~ui/app/components/Form/FormControlShell.vue'

import {
  type DatePickerIntent,
  type DatePickerPreset,
  type DatePickerSize,
  type UIDatePickerSlots,
} from '~/utils/Components/Form/DatePicker/context'
import { datePickerPresetGroupCVA } from '~/utils/Components/Form/DatePicker/variants'
import { fieldInputCVA } from '~/utils/Components/Form/variants'

import type { DateValue } from '@internationalized/date'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

export type { DatePickerPreset } from '~/utils/Components/Form/DatePicker/context'

export interface DatePickerProps
  extends
    Omit<DatePickerRootBaseProps, 'modelValue' | 'open' | 'focusedValue' | 'view'>,
    Omit<DatePickerRootProviderBaseProps, 'value'> {
  value?: UseDatePickerReturn['value']
  intent?: DatePickerIntent
  size?: DatePickerSize
  label?: string
  helperText?: string
  error?: string
  /** Show calendar open trigger button */
  showTrigger?: boolean
  /** Place the open trigger inside the shell or as an external trailing addon */
  triggerPlacement?: 'inner-trailing' | 'trailing'
  /** Show clear button when a value is selected */
  showClear?: boolean
  /** Render selected multiple dates as removable tags instead of a text input */
  showSelectedTags?: boolean
  /** Teleport dropdown to DOM (default: true, ignored when inline) */
  portalled?: boolean
  teleportTo?: string
  /** Quick range presets rendered below the control */
  presets?: DatePickerPreset[]
  /** Month/year dropdowns in calendar header */
  showMonthYearSelect?: boolean
  /** Today shortcut button in calendar footer */
  showTodayButton?: boolean
  /** Time input below day grid (requires CalendarDateTime values) */
  withTime?: boolean
  ui?: Partial<UIDatePickerSlots>
}

const modelValue = defineModel<DateValue[] | undefined>('modelValue')
const open = defineModel<boolean>('open')
const focusedValue = defineModel<DateValue | undefined>('focusedValue')
const view = defineModel<DatePickerDateView>('view')

const props = withDefaults(defineProps<DatePickerProps>(), {
  error: undefined,
  helperText: undefined,
  intent: 'primary',
  label: undefined,
  placeholder: 'Select date…',
  portalled: true,
  presets: () => [],
  selectionMode: 'single',
  showClear: true,
  showMonthYearSelect: false,
  showSelectedTags: false,
  showTodayButton: false,
  showTrigger: true,
  size: 'md',
  teleportTo: 'body',
  triggerPlacement: 'trailing',
  ui: undefined,
  value: undefined,
  withTime: false,
})

const inputCount = computed(() => (props.selectionMode === 'range' ? 2 : 1))

const hasValue = computed(() => (modelValue.value?.length ?? 0) > 0)

const shellProps = computed<FormControlShellProps>(() => ({
  disabled: props.disabled,
  error: props.error,
  helperText: props.helperText,
  intent: props.intent,
  invalid: props.invalid || String(props.error ?? '').length > 0,
  label: props.label,
  readOnly: props.readOnly,
  required: props.required,
  size: props.size,
  ui: {
    shell: props.ui?.control,
  },
}))

const rootPassthrough = computed(() => {
  const {
    error: _error,
    helperText: _helperText,
    label: _label,
    portalled: _portalled,
    presets: _presets,
    showClear: _showClear,
    showMonthYearSelect: _showMonthYearSelect,
    showSelectedTags: _showSelectedTags,
    showTodayButton: _showTodayButton,
    showTrigger: _showTrigger,
    triggerPlacement: _triggerPlacement,
    teleportTo: _teleportTo,
    ui: _ui,
    withTime: _withTime,
    ...rest
  } = props
  return rest
})

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    label: 'Date',
    placeholder: 'Select date…',
    selectionMode: 'single',
    size: 'md',
  },
})
</script>

<template>
  <UIFormDatePickerRoot
    v-bind="{ ...rootPassthrough, ...attrs }"
    v-model="modelValue"
    v-model:open="open"
    v-model:focused-value="focusedValue"
    v-model:view="view"
    :ui="{ root: ui?.root }"
  >
    <UIFormControlShell v-bind="shellProps">
      <UIFormDatePickerControl
        :ui="cn('min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none', ui?.control)"
      >
        <template v-if="selectionMode === 'multiple' && showSelectedTags">
          <UIFormDatePickerSelectedDates
            :placeholder
            :ui="{
              root: cn(fieldInputCVA({ size, intent, disabled: Boolean(disabled) }), ui?.input),
              date: ui?.selectedDate,
              remove: ui?.selectedDateRemove,
            }"
          />
        </template>
        <template v-else>
          <UIFormDatePickerInput
            v-for="inputIndex in inputCount"
            :key="inputIndex - 1"
            :index="inputIndex - 1"
            :ui="
              cn(
                fieldInputCVA({ size, intent, disabled: Boolean(disabled) }),
                inputIndex > 1 ? 'border-l border-neutral-border' : undefined,
                ui?.input,
              )
            "
          />
        </template>
      </UIFormDatePickerControl>

      <template #inner-trailing>
        <UIFormDatePickerClearTrigger v-if="showClear && hasValue" :ui="ui?.clearTrigger" />

        <UIFormDatePickerTrigger
          v-if="showTrigger && !inline && triggerPlacement === 'inner-trailing'"
          :ui="ui?.trigger"
        />
      </template>

      <template
        v-if="$slots.trailing || (showTrigger && !inline && triggerPlacement === 'trailing')"
        #trailing
      >
        <UIFormDatePickerTrigger
          v-if="showTrigger && !inline && triggerPlacement === 'trailing'"
          as-child
          :ui="ui?.trigger"
        >
          <UIButton
            variant="subtle"
            :intent
            :size
            icon-only
            icon="tabler:calendar"
            leading
            :disabled="disabled || readOnly"
            :ui="{ root: 'border-l-0' }"
          />
        </UIFormDatePickerTrigger>

        <slot name="trailing" />
      </template>
    </UIFormControlShell>

    <div v-if="presets.length > 0" :class="cn(datePickerPresetGroupCVA(), ui?.presetGroup)">
      <slot name="presets">
        <UIFormDatePickerPresetTrigger
          v-for="preset in presets"
          :key="preset.value"
          :value="preset.value"
          :ui="ui?.presetTrigger"
        >
          {{ preset.label }}
        </UIFormDatePickerPresetTrigger>
      </slot>
    </div>

    <slot name="calendar">
      <UIFormDatePickerContent v-if="inline" :ui="ui?.content">
        <UIFormDatePickerCalendarViews
          :show-month-year-select="showMonthYearSelect"
          :show-week-numbers="showWeekNumbers"
          :show-today-button="showTodayButton"
          :with-time="withTime"
          :num-of-months="numOfMonths"
          :ui
        >
          <template #footer="slotProps">
            <slot name="footer" v-bind="slotProps" />
          </template>
        </UIFormDatePickerCalendarViews>
      </UIFormDatePickerContent>

      <Teleport v-else :to="teleportTo" :disabled="!portalled">
        <UIFormDatePickerPositioner :ui="ui?.positioner">
          <UIFormDatePickerContent :ui="ui?.content">
            <UIFormDatePickerCalendarViews
              :show-month-year-select="showMonthYearSelect"
              :show-week-numbers="showWeekNumbers"
              :show-today-button="showTodayButton"
              :with-time="withTime"
              :num-of-months="numOfMonths"
              :ui
            >
              <template #footer="slotProps">
                <slot name="footer" v-bind="slotProps" />
              </template>
            </UIFormDatePickerCalendarViews>
          </UIFormDatePickerContent>
        </UIFormDatePickerPositioner>
      </Teleport>
    </slot>

    <slot />
  </UIFormDatePickerRoot>
</template>
