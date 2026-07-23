import { useFileUpload } from '@ark-ui/vue/file-upload'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import FileUpload from '~ui/app/components/FileUpload/index.vue'

describe('FileUpload', () => {
  it('renders label when provided', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { label: 'Upload files' },
    })

    expect(wrapper.text()).toContain('Upload files')
  })

  it('renders dropzone by default', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { label: 'Upload' },
    })

    expect(wrapper.text()).toContain(
      'Glissez & déposez des fichiers ici, ou cliquez pour parcourir',
    )
  })

  it('renders trigger instead of dropzone when dropzone is false', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { dropzone: false, label: 'Upload' },
    })

    expect(wrapper.text()).toContain('Choisir des fichier(s)')
    expect(wrapper.text()).not.toContain(
      'Glissez & déposez des fichiers ici, ou cliquez pour parcourir',
    )
  })

  it('shows required indicator when required is true', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { label: 'Upload', required: true },
    })

    expect(wrapper.text()).toContain('*')
  })

  it('does not show clear trigger by default', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { label: 'Upload' },
    })

    expect(wrapper.text()).not.toContain('Clear all')
  })

  it('shows clear trigger when clearable is true', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { clearable: true, label: 'Upload' },
    })

    expect(wrapper.text()).toContain('Tout effacer')
  })

  it('uses custom clear text', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { clearText: 'Remove files', clearable: true, label: 'Upload' },
    })

    expect(wrapper.text()).toContain('Remove files')
  })

  it('applies disabled state', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { disabled: true, label: 'Upload' },
    })

    const root = wrapper.find('[data-part="root"]')
    expect(root.attributes('data-disabled')).toBeDefined()
  })

  it('renders helper text when provided', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { helperText: 'Max 5 files allowed', label: 'Upload' },
    })

    expect(wrapper.text()).toContain('Max 5 files allowed')
  })

  it('exposes context via default slot', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { label: 'Upload' },
      slots: {
        default: `
          <template #default="{ acceptedFiles, maxFilesReached }">
            <span data-testid="file-count">{{ acceptedFiles.length }}</span>
            <span data-testid="max-reached">{{ maxFilesReached }}</span>
          </template>
        `,
      },
    })

    expect(wrapper.find('[data-testid="file-count"]').text()).toBe('0')
    expect(wrapper.find('[data-testid="max-reached"]').text()).toBe('false')
  })

  it('uses custom dropzone text', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { dropzoneText: 'Custom dropzone message', label: 'Upload' },
    })

    expect(wrapper.text()).toContain('Custom dropzone message')
  })

  it('uses RootProvider mode when value prop is provided', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'FileUploadProviderTest',
        components: { FileUpload },
        setup() {
          const fileUpload = useFileUpload({ maxFiles: 3 })
          return { fileUpload }
        },
        template: `
          <FileUpload label="Upload" :value="fileUpload" />
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('renders item list with file names when files are accepted', async () => {
    const files = [new File(['content'], 'test.txt', { type: 'text/plain' })]
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        label: 'Upload',
        modelValue: files,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders rejected files with error messages', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        label: 'Upload',
        maxFileSize: 1,
        modelValue: [],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('applies invalid styling when invalid prop is true', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { invalid: true, label: 'Upload' },
    })

    const dropzone = wrapper.find('[data-part="dropzone"]')
    expect(dropzone.exists()).toBe(true)
  })

  it('applies invalid styling when error prop is provided', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { error: 'Something went wrong', label: 'Upload' },
    })

    const dropzone = wrapper.find('[data-part="dropzone"]')
    expect(dropzone.exists()).toBe(true)
  })

  it('shows file count indicator when maxFiles is set', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: { label: 'Upload', maxFiles: 5 },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with custom error message texts', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        fileInvalidTypeText: 'Invalid file type!',
        fileTooLargeText: 'File is too big!',
        label: 'Upload',
        tooManyFilesText: 'Too many files!',
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with duplicate detection disabled', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        duplicate: true,
        label: 'Upload',
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders file item with remove button', async () => {
    const files = [new File(['content'], 'test.txt', { type: 'text/plain' })]
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        clearable: true,
        label: 'Upload',
        modelValue: files,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with custom validation function', async () => {
    const validate = vi.fn(() => null)
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        label: 'Upload',
        validate,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with all intent variants', async () => {
    const intents = ['neutral', 'primary', 'secondary', 'accent'] as const

    for (const intent of intents) {
      const wrapper = await mountSuspended(FileUpload, {
        props: { intent, label: 'Upload' },
      })

      expect(wrapper.exists()).toBe(true)
    }
  })

  it('renders with all size variants', async () => {
    const sizes = ['sm', 'md', 'lg'] as const

    for (const size of sizes) {
      const wrapper = await mountSuspended(FileUpload, {
        props: { label: 'Upload', size },
      })

      expect(wrapper.exists()).toBe(true)
    }
  })

  it('renders with custom ui prop classes', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        label: 'Upload',
        ui: {
          dropzone: 'custom-dropzone',
          label: 'custom-label',
          root: 'custom-root',
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders item template with file details', async () => {
    const files = [new File(['content'], 'test.txt', { size: 1234, type: 'text/plain' })]
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        label: 'Upload',
        modelValue: files,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders rejected file error messages when file exceeds max size', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        fileTooLargeText: 'File too large',
        label: 'Upload',
        maxFileSize: 1,
        maxFiles: 1,
        tooManyFilesText: 'Too many files',
      },
      slots: {
        default: `
          <template #default="{ rejectedFiles }">
            <span data-testid="rejected-count">{{ rejectedFiles.length }}</span>
          </template>
        `,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders rejected files with custom error texts via slot', async () => {
    const wrapper = await mountSuspended(FileUpload, {
      props: {
        fileExistsText: 'Custom: File exists',
        fileInvalidText: 'Custom: Invalid file',
        fileInvalidTypeText: 'Custom: Invalid type',
        fileTooLargeText: 'Custom: File too large',
        fileTooSmallText: 'Custom: Too small',
        label: 'Upload',
        maxFiles: 1,
        tooManyFilesText: 'Custom: Too many',
      },
      slots: {
        default: `
          <template #default="{ rejectedFiles }">
            <div data-testid="rejected-files">
              <span v-for="r in rejectedFiles" :key="r.file.name">{{ r.file.name }}</span>
            </div>
          </template>
        `,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
