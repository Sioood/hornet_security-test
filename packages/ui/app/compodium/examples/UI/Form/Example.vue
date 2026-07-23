<script setup lang="ts">
// oxlint-disable no-console
import { h } from 'vue'
import { z } from 'zod'

import UIButton from '~ui/app/components/Button.vue'
import UIFileUpload from '~ui/app/components/FileUpload/index.vue'
import UIFormCheckbox from '~ui/app/components/Form/Checkbox.vue'
import UIFormCombobox from '~ui/app/components/Form/Combobox/index.vue'
import UIFormDatePicker from '~ui/app/components/Form/DatePicker/index.vue'
import UIFormInput from '~ui/app/components/Form/Input.vue'
import UIFormNumberInput from '~ui/app/components/Form/NumberInput.vue'
import UIFormPhoneInput from '~ui/app/components/Form/PhoneInput.vue'
import UIFormPinInput from '~ui/app/components/Form/PinInput.vue'
import UIFormRadioGroup from '~ui/app/components/Form/RadioGroup.vue'
import UIFormSignaturePad from '~ui/app/components/Form/SignaturePad.vue'
import UIFormSlider from '~ui/app/components/Form/Slider/index.vue'
import UIFormTagsInput from '~ui/app/components/Form/TagsInput/index.vue'
import UIFormTextarea from '~ui/app/components/Form/Textarea.vue'
import UIFormTreeView from '~ui/app/components/Form/TreeView/index.vue'
import UISwitch from '~ui/app/components/Switch.vue'

import type { DateValue } from '@internationalized/date'
import type {
  InferSchemaValues,
  SchemaFieldsMap,
  SchemaFormLayout,
} from '~/utils/Components/Form/schema'
import type { TreeViewCheckedState } from '~/utils/Components/TreeView/checked-state'
import type { TreeViewItem } from '~/utils/Components/TreeView/context'

const schema = z.object({
  age: z.string().trim().min(1).optional(),
  avatar: z.custom<File[]>(),
  bio: z.string().trim().optional(),
  birthDate: z.custom<DateValue[]>().optional(),
  checkbox: z.union([z.literal(true), z.literal(false), z.literal('indeterminate')]),
  code: z.string().trim().min(1).optional(),
  domain: z.string().trim().optional(),
  email: z.string().trim().optional(),
  firstName: z.string().trim().min(2),
  framework: z.string().nullable().optional(),
  lastName: z.string().trim().min(2),
  newsletter: z.string().trim().optional(),
  permissions: z.custom<TreeViewCheckedState>(),
  phone: z.string().trim().min(1, 'Phone number is required'),
  price: z.string().trim().optional(),
  signature: z.array(z.string()).optional(),
  stack: z.array(z.string()).optional(),
  switch: z.boolean(),
  tags: z.array(z.string()).optional(),
  volume: z.array(z.number()).min(1).max(2).default([50]),
  website: z.string().trim().optional(),
})

type FormValues = InferSchemaValues<typeof schema>

const defaultValues: FormValues = {
  age: '18',
  avatar: [],
  bio: '',
  birthDate: undefined,
  checkbox: false,
  code: '',
  domain: '',
  email: '',
  firstName: '',
  framework: null,
  lastName: '',
  newsletter: '',
  permissions: { branches: {}, leaves: {}, value: [] },
  phone: '+46 ',
  price: '',
  signature: [],
  stack: [],
  switch: false,
  tags: [],
  volume: [50],
  website: '',
}

const countryItems = [
  { label: '+46 Sweden', value: '+46' },
  { label: '+1 US', value: '+1' },
  { label: '+44 UK', value: '+44' },
  { label: '+33 France', value: '+33' },
  { label: '+49 Germany', value: '+49' },
]

const frameworkItems = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
]

function domainTrailing() {
  return h(
    'span',
    {
      class:
        'flex w-auto shrink-0 items-center border border-l-0 border-neutral-border bg-neutral-fill-subtle px-3 txt-label text-neutral-text-subtle disabled:opacity-40 disabled:pointer-events-none',
    },
    '.com',
  )
}
function websiteLeading() {
  return h(
    'span',
    {
      class:
        'flex w-auto shrink-0 items-center border border-r-0 border-neutral-border bg-neutral-fill-subtle px-3 txt-label text-neutral-text-subtle disabled:opacity-40 disabled:pointer-events-none',
    },
    'https://',
  )
}
function priceInnerLeading() {
  return h('span', { class: 'txt-label text-neutral-text-subtle' }, '$')
}
function newsletterTrailing() {
  return h(UIButton, { intent: 'primary', text: 'Subscribe', variant: 'subtle' })
}

const permissionTreeItems: TreeViewItem[] = [
  {
    children: [
      { id: 'dashboard/analytics', label: 'Analytics' },
      { id: 'dashboard/reports', label: 'Reports' },
    ],
    id: 'dashboard',
    label: 'Dashboard',
  },
  {
    children: [
      { id: 'settings/profile', label: 'Profile' },
      { id: 'settings/security', label: 'Security' },
    ],
    id: 'settings',
    label: 'Settings',
  },
  { id: 'billing', label: 'Billing' },
]

const fields: SchemaFieldsMap<FormValues> = {
  age: {
    as: UIFormNumberInput,
    props: {
      label: 'Age',
      max: 150,
      min: 0,
      placeholder: '18',
      step: 1,
    },
  },
  avatar: {
    as: UIFileUpload,
    props: {
      accept: 'image/*',
      clearable: true,
      helperText: 'Upload a profile picture (images only, max 5MB)',
      label: 'Avatar',
      maxFileSize: 5 * 1024 * 1024,
      maxFiles: 1,
    },
  },
  bio: {
    as: UIFormTextarea,
    props: {
      autoresize: true,
      label: 'Bio',
      placeholder: 'Tell us about yourself…',
    },
  },
  birthDate: {
    as: UIFormDatePicker,
    props: {
      helperText: 'Uses the active i18n locale by default',
      label: 'Birth date',
      placeholder: 'Select date…',
    },
  },
  checkbox: {
    as: UIFormCheckbox,
    props: {
      label: 'Checkbox',
    },
  },
  code: {
    as: UIFormPinInput,
    props: {
      count: 5,
      helperText: 'Enter the 5-digit code',
      label: 'Verification code',
    },
  },
  domain: {
    as: UIFormInput,
    props: {
      label: 'Domain',
      placeholder: 'mywebsite',
    },
    slots: { trailing: domainTrailing },
    suffix: '.com',
  },
  email: {
    as: UIFormInput,
    props: {
      label: 'Email',
      placeholder: 'you@example.com',
      type: 'email',
    },
  },
  firstName: {
    as: UIFormInput,
    props: {
      label: 'First name',
      placeholder: 'Jane',
      required: true,
    },
    validators: {
      onChangeAsync: async ({ value }: { value: string }) => {
        await new Promise((r) => setTimeout(r, 200))
        return value.includes('error') ? "Text must not contain 'error'" : undefined
      },
      onChangeAsyncDebounceMs: 400,
    },
  },
  framework: {
    as: UIFormRadioGroup,
    props: {
      helperText: 'Choose your preferred framework',
      items: [
        { label: 'React', value: 'react' },
        { label: 'Solid', value: 'solid' },
        { label: 'Vue', value: 'vue' },
      ],
      label: 'Framework',
      orientation: 'horizontal',
    },
  },
  lastName: {
    as: UIFormInput,
    props: {
      label: 'Last name',
      placeholder: 'Doe',
    },
  },
  newsletter: {
    as: UIFormInput,
    props: {
      label: 'Newsletter',
      placeholder: 'you@example.com',
      type: 'email',
    },
    slots: { trailing: newsletterTrailing },
  },
  permissions: {
    as: UIFormTreeView,
    props: {
      helperText: 'Select accessible sections (checkbox tree)',
      items: permissionTreeItems,
      label: 'Permissions',
    },
  },
  phone: {
    as: UIFormPhoneInput,
    props: {
      items: countryItems,
      label: 'Phone',
      placeholder: '0701234567',
      required: true,
    },
    validators: {
      onChange: ({ value }: { value: string }) => {
        if (!value || value.trim().length === 0) return 'Phone number is required'
        const parts = value.trim().split(' ')
        if (parts.length < 2 || !parts[0] || !parts[1]) {
          return 'Please select a country code and enter a phone number'
        }
        return undefined
      },
    },
  },
  price: {
    as: UIFormInput,
    prefix: '$',
    props: {
      label: 'Price',
      placeholder: '0.00',
      type: 'number',
    },
    slots: { 'inner-leading': priceInnerLeading },
  },
  signature: {
    as: UIFormSignaturePad,
    props: {
      clearable: true,
      helperText: 'Draw your signature in the box',
      label: 'Signature',
      required: true,
    },
  },
  stack: {
    as: UIFormCombobox,
    props: {
      helperText: 'Single selection with autocomplete',
      items: frameworkItems,
      label: 'Primary stack',
      placeholder: 'Search framework…',
    },
  },
  switch: {
    as: UISwitch,
    props: {
      helperText: 'Accept terms and conditions',
      label: 'Switch',
    },
  },
  tags: {
    as: UIFormTagsInput,
    props: {
      helperText: 'Tags with combobox suggestions',
      items: frameworkItems,
      label: 'Skills',
      placeholder: 'Add skill…',
    },
  },
  volume: {
    as: UIFormSlider,
    props: {
      helperText: 'Adjust the volume range',
      intent: 'primary',
      label: 'Volume',
      max: 100,
      min: 0,
      step: 1,
    },
  },
  website: {
    as: UIFormInput,
    prefix: 'https://',
    props: {
      label: 'Website',
      placeholder: 'example.com',
    },
    slots: { leading: websiteLeading },
  },
}

const layout: SchemaFormLayout<keyof FormValues & string>[] = [
  ['firstName', 'lastName'],
  'email',
  'birthDate',
  'age',
  'bio',
  'code',
  'domain',
  'website',
  'price',
  'newsletter',
  'phone',
  'checkbox',
  'switch',
  'framework',
  'stack',
  'tags',
  'permissions',
  'volume',
  'avatar',
  'signature',
]

const submitted = ref('')

function onSubmit(value: FormValues) {
  console.info(value)
  submitted.value = JSON.stringify(value)
}
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <UIForm
      :schema="schema"
      :default-values="defaultValues"
      :fields="fields"
      :layout="layout"
      @submit="onSubmit"
    >
      <template #actions="{ canSubmit, isSubmitting }">
        <UIButton
          type="submit"
          text="Submit"
          variant="subtle"
          intent="primary"
          :disabled="!canSubmit || isSubmitting"
        />
      </template>
    </UIForm>

    <p v-if="submitted" class="txt-caption wrap-break-words w-full text-primary-text-subtle">
      Submitted: {{ submitted }}
    </p>
  </div>
</template>
