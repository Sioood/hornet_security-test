<script setup lang="ts">
import {
  FileUpload as ArkFileUpload,
  type FileUploadRootBaseProps as ArkFileUploadRootBaseProps,
  type FileUploadRootProviderBaseProps as ArkFileUploadRootProviderBaseProps,
  type UseFileUploadReturn,
  type FileUploadFileRejection,
  type FileUploadFileError,
} from '@ark-ui/vue/file-upload'
import { cva, type VariantProps } from 'class-variance-authority'

import type { FieldProps } from '~ui/app/components/Form/Field.vue'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export type { FileUploadFileError }

type FileUploadIntent = 'neutral' | 'primary' | 'secondary' | 'accent'
type FileUploadSize = 'sm' | 'md' | 'lg'

const fileUploadRootCVA = cva('flex flex-col gap-3', {
  variants: {
    intent: {
      accent: '',
      neutral: '',
      primary: '',
      secondary: '',
    } satisfies Record<FileUploadIntent, string>,
    size: {
      lg: '',
      md: '',
      sm: '',
    } satisfies Record<FileUploadSize, string>,
  },
})

const fileUploadLabelCVA = cva('', {
  variants: {
    intent: {
      accent: 'data-[disabled]:text-accent text-accent-text',
      neutral: 'data-[disabled]:text-neutral text-neutral-text',
      primary: 'data-[disabled]:text-primary text-primary-text',
      secondary: 'data-[disabled]:text-secondary text-secondary-text',
    } satisfies Record<FileUploadIntent, string>,
    size: {
      lg: 'txt-h6',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<FileUploadSize, string>,
  },
})

const fileUploadDropzoneCVA = cva(
  [
    'relative flex flex-col items-center justify-center gap-2 border border-dashed p-8 transition-colors duration-200',
    'not-data-[disabled]:cursor-pointer data-[disabled]:cursor-not-allowed',
    'disabled:pointer-events-none disabled:opacity-40 data-[dragging]:border-primary-border-strong data-[dragging]:bg-primary-fill-subtle/20',
  ],
  {
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    },
    variants: {
      intent: {
        accent:
          'data-[disabled]:border-accent-border-subtle-disabled border-accent-border-subtle bg-accent-fill-subtle/50 not-data-[dragging]:not-data-[disabled]:hover:border-accent-border not-data-[dragging]:not-data-[disabled]:hover:bg-accent-fill-subtle disabled:pointer-events-none disabled:opacity-40 data-[disabled]:bg-accent-fill-subtle/50 data-[invalid]:border-error-border data-[invalid]:bg-error-fill-subtle/20',
        neutral:
          'data-[disabled]:border-neutral-border-subtle-disabled border-neutral-border-subtle bg-neutral-fill-subtle/50 not-data-[dragging]:not-data-[disabled]:hover:border-neutral-border not-data-[dragging]:not-data-[disabled]:hover:bg-neutral-fill-subtle disabled:pointer-events-none disabled:opacity-40 data-[disabled]:bg-neutral-fill-subtle/50 data-[invalid]:border-error-border data-[invalid]:bg-error-fill-subtle/20',
        primary:
          'data-[disabled]:border-primary-border-subtle-disabled border-primary-border-subtle bg-primary-fill-subtle/50 not-data-[dragging]:not-data-[disabled]:hover:border-primary-border not-data-[dragging]:not-data-[disabled]:hover:bg-primary-fill-subtle disabled:pointer-events-none disabled:opacity-40 data-[disabled]:bg-primary-fill-subtle/50 data-[invalid]:border-error-border data-[invalid]:bg-error-fill-subtle/20',
        secondary:
          'data-[disabled]:border-secondary-border-subtle-disabled border-secondary-border-subtle bg-secondary-fill-subtle/50 not-data-[dragging]:not-data-[disabled]:hover:border-secondary-border not-data-[dragging]:not-data-[disabled]:hover:bg-secondary-fill-subtle disabled:pointer-events-none disabled:opacity-40 data-[disabled]:bg-secondary-fill-subtle/50 data-[invalid]:border-error-border data-[invalid]:bg-error-fill-subtle/20',
      } satisfies Record<FileUploadIntent, string>,
      size: {
        lg: 'txt-h6 rounded-xs p-12',
        md: 'txt-label rounded-xs p-8',
        sm: 'txt-caption rounded-xs p-4',
      } satisfies Record<FileUploadSize, string>,
    },
  },
)

const fileUploadItemCVA = cva('flex items-center gap-3 border p-3 transition-colors duration-200', {
  defaultVariants: {
    intent: 'neutral',
    size: 'md',
  },
  variants: {
    intent: {
      accent:
        'data-[disabled]:border-accent border-accent-border bg-accent-surface text-accent-text disabled:pointer-events-none disabled:opacity-40 data-[disabled]:bg-accent-fill-subtle',
      error:
        'data-[disabled]:border-error border-error-border bg-error-surface text-error-text disabled:pointer-events-none disabled:opacity-40 data-[disabled]:bg-error-fill-subtle',
      neutral:
        'data-[disabled]:border-neutral border-neutral-border bg-neutral-surface text-neutral-text disabled:pointer-events-none disabled:opacity-40 data-[disabled]:bg-neutral-fill-subtle',
      primary:
        'data-[disabled]:border-primary border-primary-border bg-primary-surface text-primary-text disabled:pointer-events-none disabled:opacity-40 data-[disabled]:bg-primary-fill-subtle',
      secondary:
        'data-[disabled]:border-secondary border-secondary-border bg-secondary-surface text-secondary-text disabled:pointer-events-none disabled:opacity-40 data-[disabled]:bg-secondary-fill-subtle',
    } satisfies Record<FileUploadIntent | 'error', string>,
    size: {
      lg: 'txt-h6',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<FileUploadSize, string>,
  },
})

const fileUploadItemNameCVA = cva('flex-1 truncate', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      error: 'text-error-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<FileUploadIntent | 'error', string>,
  },
})

const fileUploadItemSizeTextCVA = cva('shrink-0', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      error: 'text-error-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<FileUploadIntent | 'error', string>,
    size: {
      lg: 'txt-label',
      md: 'txt-caption',
      sm: 'txt-small',
    } satisfies Record<FileUploadSize, string>,
  },
})

const fileUploadItemPreviewCVA = cva('flex shrink-0 items-center justify-center overflow-hidden', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-12',
      md: 'size-10',
      sm: 'size-8',
    } satisfies Record<FileUploadSize, string>,
  },
})

const fileUploadItemDeleteTriggerCVA = cva(
  [
    'inline-flex shrink-0 items-center justify-center transition-colors duration-200',
    'border border-transparent hover:border-inherit active:border-inherit disabled:border-inherit',
    'not-data-[disabled]:cursor-pointer data-[disabled]:cursor-not-allowed',
  ],
  {
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    },
    variants: {
      intent: {
        accent:
          'data-[disabled]:text-accent-text-subtle-disabled bg-transparent text-accent-text-subtle hover:bg-accent-fill-subtle-hover active:bg-accent-fill-subtle-active data-[disabled]:bg-accent-fill-subtle',
        error:
          'data-[disabled]:text-error-text-subtle-disabled bg-transparent text-error-text-subtle hover:bg-error-fill-subtle-hover active:bg-error-fill-subtle-active data-[disabled]:bg-error-fill-subtle',
        neutral:
          'data-[disabled]:text-neutral-text-subtle-disabled bg-transparent text-neutral-text-subtle hover:bg-neutral-fill-subtle-hover active:bg-neutral-fill-subtle-active data-[disabled]:bg-neutral-fill-subtle',
        primary:
          'data-[disabled]:text-primary-text-subtle-disabled bg-transparent text-primary-text-subtle hover:bg-primary-fill-subtle-hover active:bg-primary-fill-subtle-active data-[disabled]:bg-primary-fill-subtle',
        secondary:
          'data-[disabled]:text-secondary-text-subtle-disabled bg-transparent text-secondary-text-subtle hover:bg-secondary-fill-subtle-hover active:bg-secondary-fill-subtle-active data-[disabled]:bg-secondary-fill-subtle',
      } satisfies Record<FileUploadIntent | 'error', string>,
      size: {
        lg: 'size-8',
        md: 'size-7',
        sm: 'size-6',
      } satisfies Record<FileUploadSize, string>,
    },
  },
)

const fileUploadDropzoneContentCVA = cva('flex flex-col items-center gap-2 text-center', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<FileUploadIntent, string>,
  },
})

const fileUploadDropzoneIconCVA = cva('shrink-0', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-10',
      md: 'size-8',
      sm: 'size-6',
    } satisfies Record<FileUploadSize, string>,
  },
})

type FileUploadCVAProps = VariantProps<typeof fileUploadRootCVA>

export interface UIFileUploadSlots {
  root?: ClassValue
  label?: ClassValue
  trigger?: ClassValue
  dropzone?: ClassValue
  dropzoneContent?: ClassValue
  dropzoneIcon?: ClassValue
  item?: ClassValue
  itemName?: ClassValue
  itemSizeText?: ClassValue
  itemPreview?: ClassValue
  itemDeleteTrigger?: ClassValue
  clearTrigger?: ClassValue
  rejectedItem?: ClassValue
  hiddenInput?: ClassValue
}

export interface UIFileUploadSlotProps {
  acceptedFiles: File[]
  rejectedFiles: FileUploadFileRejection[]
  dragging: boolean
  maxFilesReached: boolean
  remainingFiles: number
  openFilePicker: () => void
  clearFiles: () => void
  deleteFile: (file: File, type?: 'accepted' | 'rejected') => void
  getFileSize: (file: File) => string
  createFileUrl: (file: File, cb: (url: string) => void) => VoidFunction
  transforming: boolean
}

export interface FileUploadProps
  extends
    Omit<ArkFileUploadRootBaseProps, 'value'>,
    Omit<ArkFileUploadRootProviderBaseProps, 'value'>,
    Omit<FieldProps, 'ids' | 'intent' | 'size'> {
  /**
   * Pass the return value of `useFileUpload()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseFileUploadReturn
  intent?: FileUploadCVAProps['intent']
  size?: FileUploadCVAProps['size']
  /** When true, renders the dropzone area for drag-and-drop. */
  dropzone?: boolean
  /** Text shown inside the dropzone when no files are present. */
  dropzoneText?: string
  /** Text shown on the trigger button when dropzone is disabled. */
  triggerText?: string
  /** When true, shows a "Clear all" button when files are present. */
  clearable?: boolean
  /** Text for the clear trigger button. */
  clearText?: string
  /**
   * When true (default), prevents adding files that already exist by name.
   * Set to false to allow duplicate files.
   */
  duplicate?: boolean
  /** Translation key or text for "Too many files selected" error. */
  tooManyFilesText?: string
  /** Translation key or text for "Invalid file type" error. */
  fileInvalidTypeText?: string
  /** Translation key or text for "File too large" error. */
  fileTooLargeText?: string
  /** Translation key or text for "File too small" error. */
  fileTooSmallText?: string
  /** Translation key or text for "Invalid file" error. */
  fileInvalidText?: string
  /** Translation key or text for "File already exists" error. */
  fileExistsText?: string
  ui?: Partial<UIFileUploadSlots>
}

const modelValue = defineModel<File[]>({ default: [] })

const props = withDefaults(defineProps<FileUploadProps>(), {
  allowDrop: true,
  clearText: 'fileUpload.clearText',
  clearable: false,
  disabled: false,
  dropzone: true,
  dropzoneText: 'fileUpload.dropzoneText',
  duplicate: false,
  fileExistsText: 'fileUpload.errors.file_exists',
  fileInvalidText: 'fileUpload.errors.file_invalid',
  fileInvalidTypeText: 'fileUpload.errors.file_invalid_type',
  fileTooLargeText: 'fileUpload.errors.file_too_large',
  fileTooSmallText: 'fileUpload.errors.file_too_small',
  intent: 'neutral',
  locale: 'en-US',
  maxFileSize: Infinity,
  maxFiles: 1,
  minFileSize: 0,
  preventDocumentDrop: true,
  readOnly: false,
  required: false,
  size: 'md',
  tooManyFilesText: 'fileUpload.errors.too_many_files',
  triggerText: 'fileUpload.triggerText',
  ui: undefined,
  value: undefined,
})

const invalid = computed(() =>
  Boolean(props.invalid || (props.error && String(props.error).length > 0)),
)

const resolvedValidate = computed<FileUploadProps['validate']>(() => {
  if (!props.duplicate && !props.validate) return undefined

  return (file, details) => {
    const errors: FileUploadFileError[] = []

    if (!props.duplicate) {
      const exists = details.acceptedFiles.some((f) => f.name === file.name && f.size === file.size)
      if (exists) errors.push('FILE_EXISTS')
    }

    if (props.validate) {
      const userErrors = props.validate(file, details)
      if (userErrors) errors.push(...userErrors)
    }

    return errors.length > 0 ? errors : null
  }
})

const attrs = useAttrs()

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkFileUpload.RootProvider : ArkFileUpload.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  return {
    ...pick(props, [
      'accept',
      'allowDrop',
      'asChild',
      'capture',
      'defaultAcceptedFiles',
      'directory',
      'disabled',
      'id',
      'ids',
      'invalid',
      'locale',
      'maxFiles',
      'maxFileSize',
      'minFileSize',
      'name',
      'preventDocumentDrop',
      'readOnly',
      'required',
      'transformFiles',
      'translations',
    ] as const),
    validate: resolvedValidate.value,
  }
})

const fieldProps = computed(() => ({
  ...pick(props, [
    'asChild',
    'disabled',
    'error',
    'helperText',
    'hideLabel',
    'id',
    'ids',
    'intent',
    'label',
    'labelAssociatesControl',
    'readOnly',
    'required',
    'size',
  ] as const),
  hideLabel: true,
  invalid: invalid.value,
}))

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(
      fileUploadRootCVA({ intent: props.intent, size: props.size }),
      arkAttrs.value.class as ClassValue,
      props.ui?.root,
    ),
  }

  if (!isProvider.value) {
    base.acceptedFiles = modelValue.value
    base['onUpdate:acceptedFiles'] = (next: File[]) => {
      if (!props.duplicate) {
        const seen = new Set<string>()
        const filtered = next.filter((f) => {
          const key = `${f.name}-${f.size}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        modelValue.value = filtered
      } else {
        modelValue.value = next
      }
    }
  }

  return base
})

const errorMessages = computed<Record<FileUploadFileError, string>>(() => ({
  FILE_EXISTS: props.fileExistsText,
  FILE_INVALID: props.fileInvalidText,
  FILE_INVALID_TYPE: props.fileInvalidTypeText,
  FILE_TOO_LARGE: props.fileTooLargeText,
  FILE_TOO_SMALL: props.fileTooSmallText,
  TOO_MANY_FILES: props.tooManyFilesText,
}))

const resolveErrorText = (key: FileUploadFileError) => {
  const text = errorMessages.value[key]
  return text ? ($te(text) ? $t(text) : text) : undefined
}

extendCompodiumMeta({
  defaultProps: {
    clearable: false,
    disabled: false,
    dropzone: true,
    intent: 'neutral',
    maxFiles: 5,
    size: 'md',
  },
})
</script>

<template>
  <UIFormField v-bind="fieldProps as FieldProps">
    <component :is="rootComponent" v-bind="rootBindings">
      <ArkFileUpload.Context v-slot="ctx">
        <ArkFileUpload.Label
          v-if="label || required"
          :class="cn(fileUploadLabelCVA({ intent, size }), ui?.label)"
        >
          <template v-if="label">{{ label }}</template>
          <span v-if="required" class="txt-caption text-error-icon" aria-hidden="true"> * </span>
        </ArkFileUpload.Label>

        <template v-if="props.dropzone">
          <ArkFileUpload.Dropzone
            :class="
              cn(
                fileUploadDropzoneCVA({ intent, size }),
                invalid && 'border-error-border!',
                ui?.dropzone,
              )
            "
          >
            <div :class="cn(fileUploadDropzoneContentCVA({ intent }), ui?.dropzoneContent)">
              <Icon
                name="tabler:upload"
                :class="cn(fileUploadDropzoneIconCVA({ size }), ui?.dropzoneIcon)"
              />
              <span>{{
                $te(props.dropzoneText) ? $t(props.dropzoneText) : props.dropzoneText
              }}</span>
            </div>
          </ArkFileUpload.Dropzone>
        </template>
        <template v-else>
          <ArkFileUpload.Trigger as-child>
            <UIButton
              variant="subtle"
              :intent
              :size
              icon="tabler:upload"
              :ui="{ root: ui?.trigger }"
            >
              <slot name="trigger">
                {{ $te(props.triggerText) ? $t(props.triggerText) : props.triggerText }}
              </slot>
            </UIButton>
          </ArkFileUpload.Trigger>
        </template>

        <ArkFileUpload.ClearTrigger v-if="props.clearable" as-child>
          <UIButton variant="ghost" intent="error" size="xs" :ui="{ root: ui?.clearTrigger }">
            <slot name="clear-trigger">
              <Icon name="tabler:x" class="size-3" />
              {{ $te(props.clearText) ? $t(props.clearText) : props.clearText }}
            </slot>
          </UIButton>
        </ArkFileUpload.ClearTrigger>

        <ArkFileUpload.ItemGroup v-if="ctx.acceptedFiles.length > 0" class="flex flex-col gap-2">
          <ArkFileUpload.Item
            v-for="file in ctx.acceptedFiles"
            :key="file.name"
            :file="file"
            :class="cn(fileUploadItemCVA({ intent, size }), ui?.item)"
          >
            <ArkFileUpload.ItemPreview
              type=".*"
              :class="cn(fileUploadItemPreviewCVA({ size }), ui?.itemPreview)"
            >
              <template v-if="file.type.startsWith('image/')">
                <ArkFileUpload.ItemPreviewImage class="size-full object-cover" />
              </template>
              <template v-else>
                <Icon name="tabler:file" class="size-5 text-neutral-icon" />
              </template>
            </ArkFileUpload.ItemPreview>

            <div class="flex min-w-0 flex-1 flex-col">
              <ArkFileUpload.ItemName
                :class="cn(fileUploadItemNameCVA({ intent }), ui?.itemName)"
              />
              <ArkFileUpload.ItemSizeText
                :class="cn(fileUploadItemSizeTextCVA({ intent, size }), ui?.itemSizeText)"
              />
            </div>

            <ArkFileUpload.ItemDeleteTrigger
              :class="cn(fileUploadItemDeleteTriggerCVA({ intent, size }), ui?.itemDeleteTrigger)"
            >
              <slot name="item-delete-trigger">
                <Icon name="tabler:x" class="size-4" />
              </slot>
            </ArkFileUpload.ItemDeleteTrigger>
          </ArkFileUpload.Item>
        </ArkFileUpload.ItemGroup>

        <ArkFileUpload.ItemGroup
          v-if="ctx.rejectedFiles.length > 0"
          type="rejected"
          class="flex flex-col gap-2"
        >
          <ArkFileUpload.Item
            v-for="rejection in ctx.rejectedFiles"
            :key="rejection.file.name"
            :file="rejection.file"
            :class="cn(fileUploadItemCVA({ intent: 'error', size }), ui?.rejectedItem)"
          >
            <div
              :class="
                cn(
                  fileUploadItemPreviewCVA({ size }),
                  'flex items-center justify-center text-error-icon',
                )
              "
            >
              <Icon name="tabler:alert-hexagon" class="size-5" />
            </div>

            <div class="flex min-w-0 flex-1 flex-col">
              <ArkFileUpload.ItemName
                :class="cn(fileUploadItemNameCVA({ intent: 'error' }), ui?.itemName)"
              >
                {{ rejection.file.name }}
              </ArkFileUpload.ItemName>
              <ArkFileUpload.ItemSizeText
                :class="cn(fileUploadItemSizeTextCVA({ intent: 'error', size }), ui?.itemSizeText)"
              />
              <div class="txt-caption flex flex-col gap-0.5 text-error-text">
                <span v-for="err in rejection.errors" :key="err">
                  {{ resolveErrorText(err as FileUploadFileError) }}
                </span>
              </div>
            </div>
            <ArkFileUpload.ItemDeleteTrigger
              :class="
                cn(fileUploadItemDeleteTriggerCVA({ intent: 'error', size }), ui?.itemDeleteTrigger)
              "
            >
              <Icon name="tabler:x" class="size-4" />
            </ArkFileUpload.ItemDeleteTrigger>
          </ArkFileUpload.Item>
        </ArkFileUpload.ItemGroup>

        <ArkFileUpload.HiddenInput :class="ui?.hiddenInput" />

        <slot
          :accepted-files="ctx.acceptedFiles"
          :rejected-files="ctx.rejectedFiles"
          :dragging="ctx.dragging"
          :max-files-reached="ctx.maxFilesReached"
          :remaining-files="ctx.remainingFiles"
          :open-file-picker="ctx.openFilePicker"
          :clear-files="ctx.clearFiles"
          :delete-file="ctx.deleteFile"
          :get-file-size="ctx.getFileSize"
          :create-file-url="ctx.createFileUrl"
          :transforming="ctx.transforming"
        />
      </ArkFileUpload.Context>
    </component>
  </UIFormField>
</template>
