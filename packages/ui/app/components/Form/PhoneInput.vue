<script setup lang="ts">
import UIFormInput from '~ui/app/components/Form/Input.vue'

import type { FormControlShellProps } from '~/components/Form/FormControlShell.vue'
import type { UIInputSlots } from '~/utils/Components/Form/context'

export interface CountryItem {
  label: string
  value: string
  disabled?: boolean
}

export interface UIFormPhoneInputProps extends Omit<FormControlShellProps, 'ui'> {
  name?: string
  placeholder?: string
  items?: CountryItem[]
  ui?: Partial<UIInputSlots>
}

const _props = withDefaults(defineProps<UIFormPhoneInputProps>(), {
  error: undefined,
  errorIcon: undefined,
  helperText: undefined,
  icon: undefined,
  infoIcon: undefined,
  intent: 'primary',
  items: () => [],
  label: undefined,
  leading: false,
  leadingIcon: undefined,
  loadingIcon: undefined,
  mode: 'leadingAndTrailing',
  name: undefined,
  placeholder: '',
  size: 'md',
  state: 'default',
  successIcon: undefined,
  trailing: false,
  trailingIcon: undefined,
  ui: undefined,
  warningIcon: undefined,
})

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()

const modelValue = defineModel<string>({ default: '' })

const internalCountryCode = ref<string[]>([])
const internalPhone = ref('')

watch(
  modelValue,
  (val) => {
    if (!val) {
      internalPhone.value = ''
      return
    }
    const firstSpace = val.indexOf(' ')
    if (firstSpace === -1) {
      internalPhone.value = val
      return
    }
    const code = val.slice(0, firstSpace)
    internalCountryCode.value = [code]
    internalPhone.value = val.slice(firstSpace + 1)
  },
  { immediate: true },
)

function updateCombined() {
  const [code] = internalCountryCode.value
  if (!code) {
    modelValue.value = ''
    return
  }
  if (!internalPhone.value) {
    modelValue.value = code
    return
  }
  modelValue.value = `${code} ${internalPhone.value}`
}

watch([internalCountryCode, internalPhone], updateCombined, { deep: true })

const arkInputRef = ref<InstanceType<typeof UIFormInput> | null>(null)

const rootProps = computed(() => ({
  ...pick(_props, [
    'disabled',
    'error',
    'helperText',
    'intent',
    'label',
    'name',
    'placeholder',
    'readOnly',
    'required',
    'size',
    'ui',
  ] as const),
  invalid: _props.invalid || String(_props.error ?? '').length > 0,
  type: 'tel' as const,
}))

defineExpose({
  focus: (): void => arkInputRef.value?.focus(),
  getControlElement: (): HTMLInputElement | null => arkInputRef.value?.getControlElement() ?? null,
})
</script>

<template>
  <UIFormInput
    ref="arkInputRef"
    v-model="internalPhone"
    v-bind="rootProps"
    @blur="emit('blur', $event)"
  >
    <template #leading>
      <UIFormSelect
        v-model="internalCountryCode"
        :items
        :intent
        size="md"
        :show-clear="false"
        :ui="{
          root: 'w-auto',
          trigger: 'flex w-30 shrink-0 items-center border-r-0',
        }"
      />
    </template>
  </UIFormInput>
</template>
