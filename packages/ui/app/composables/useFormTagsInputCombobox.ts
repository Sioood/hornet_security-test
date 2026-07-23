import {
  useCombobox,
  type ComboboxRootProps,
  type ListCollection,
  type UseComboboxReturn,
} from '@ark-ui/vue/combobox'
import {
  useTagsInput,
  type TagsInputRootProps,
  type UseTagsInputReturn,
} from '@ark-ui/vue/tags-input'

import { resolveComboboxSelectedValue } from '~/utils/Components/Form/Combobox/collection'

import type { MaybeRefOrGetter } from 'vue'

export const formTagsInputComboboxPositioning = {
  placement: 'bottom-start',
  sameWidth: true,
} as const

export interface UseFormTagsInputComboboxOptions<T extends { label: string; value: string }> {
  collection: MaybeRefOrGetter<ListCollection<T>>
  tagsInput?: Omit<TagsInputRootProps, 'ids'>
  combobox?: Omit<ComboboxRootProps<T>, 'ids' | 'collection' | 'value' | 'selectionBehavior'>
  allowCustomValue?: boolean
}

export interface UseFormTagsInputComboboxReturn<T extends { label: string; value: string }> {
  tagsInput: UseTagsInputReturn
  combobox: UseComboboxReturn<T>
  sharedIds: { input: string; control: string }
}

function clearComposedInput(tagsInput: UseTagsInputReturn, combobox: UseComboboxReturn) {
  tagsInput.value.clearInputValue()
  combobox.value.setInputValue('')
  combobox.value.clearValue()
}

export function useFormTagsInputCombobox<T extends { label: string; value: string }>(
  options: UseFormTagsInputComboboxOptions<T>,
): UseFormTagsInputComboboxReturn<T> {
  const uid = useId()
  const sharedIds = {
    control: `tags-combobox-control_${uid}`,
    input: `tags-combobox-input_${uid}`,
  }

  const tagsInput = useTagsInput({
    ...options.tagsInput,
    ids: {
      ...options.tagsInput?.ids,
      control: sharedIds.control,
      input: sharedIds.input,
    },
  })

  const combobox = useCombobox({
    ...options.combobox,
    allowCustomValue: options.allowCustomValue ?? true,
    closeOnSelect: options.combobox?.closeOnSelect ?? true,
    get collection() {
      return toValue(options.collection)
    },
    ids: {
      ...options.combobox?.ids,
      control: sharedIds.control,
      input: sharedIds.input,
    },
    onValueChange: (details) => {
      const nextValue = resolveComboboxSelectedValue(details)
      if (nextValue && !tagsInput.value.value.includes(nextValue)) {
        tagsInput.value.addValue(nextValue)
      }
      clearComposedInput(tagsInput, combobox)
      options.combobox?.onValueChange?.(details)
    },
    openOnChange: options.combobox?.openOnChange ?? true,
    positioning: {
      ...formTagsInputComboboxPositioning,
      ...options.combobox?.positioning,
    },
    selectionBehavior: 'clear',
    value: [],
  })

  return { combobox, sharedIds, tagsInput }
}

export { clearComposedInput }
