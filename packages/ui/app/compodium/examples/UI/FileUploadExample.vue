<script setup lang="ts">
// oxlint-disable no-console
import {
  useFileUpload,
  type FileUploadFileAcceptDetails,
  type FileUploadFileRejectDetails,
} from '@ark-ui/vue/file-upload'

const basicFiles = ref<File[]>([])
const multiFiles = ref<File[]>([])
const imageFiles = ref<File[]>([])

const externalFileUpload = useFileUpload({
  accept: 'image/*',
  maxFiles: 3,
})

const transformFiles = async (files: File[]) =>
  files.map((file) => {
    if (file.type.startsWith('image/') && file.size > 1024 * 1024) {
      console.log(`Transforming: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`)
    }
    return file
  })

const sizes = ['sm', 'md', 'lg'] as const
const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Basic usage -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Basic</h2>
      <UIFileUpload
        v-model:accepted-files="basicFiles"
        label="Upload files"
        helper-text="Select up to 5 files"
        :max-files="5"
        @file-accept="(d: FileUploadFileAcceptDetails) => console.log('fileAccept', d)"
        @file-reject="(d: FileUploadFileRejectDetails) => console.log('fileReject', d)"
      />
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <UIFileUpload
          v-for="intent in intents"
          :key="intent"
          :intent="intent as any"
          :label="`Intent: ${intent}`"
          :max-files="3"
        />
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div class="flex flex-col gap-6">
        <UIFileUpload
          v-for="size in sizes"
          :key="size"
          :size="size as any"
          :label="`Size: ${size}`"
          :max-files="3"
        />
      </div>
    </section>

    <!-- With validation -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">With Validation</h2>
      <UIFileUpload
        v-model:accepted-files="imageFiles"
        label="Images only"
        helper-text="Max 1MB per file, images only"
        accept="image/*"
        :max-files="3"
        :max-file-size="1024 * 1024"
        :min-file-size="1024"
        @file-reject="(d: FileUploadFileRejectDetails) => console.log('rejected', d)"
      />
    </section>

    <!-- With transform -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">File Transformations</h2>
      <UIFileUpload
        label="Transform files"
        helper-text="Files are logged during transformation"
        accept="image/*"
        :max-files="5"
        :transform-files="transformFiles"
      />
    </section>

    <!-- Without dropzone (trigger only) -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Trigger Only (No Dropzone)</h2>
      <UIFileUpload label="Browse files" :dropzone="false" :max-files="3" />
    </section>

    <!-- Clearable -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Clearable</h2>
      <UIFileUpload
        v-model:accepted-files="multiFiles"
        label="Clearable upload"
        :clearable="true"
        :max-files="5"
      />
    </section>

    <!-- States -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">States</h2>
      <div class="flex flex-col gap-6">
        <UIFileUpload label="Required" required :max-files="1" />
        <UIFileUpload label="Disabled" disabled :max-files="3" />
        <UIFileUpload label="Read-only" read-only :max-files="3" />
        <UIFileUpload label="Invalid" invalid error="Please upload a valid file" :max-files="3" />
      </div>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode (external API)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useFileUpload()</code> — call methods from outside.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalFileUpload.openFilePicker()">
          Open Picker
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalFileUpload.clearFiles()">
          Clear Files
        </UIButton>
      </div>
      <UIFileUpload
        :value="externalFileUpload"
        label="Externally controlled"
        intent="accent"
        @file-change="(d) => console.log('fileChange', d)"
      />
    </section>
  </div>
</template>
