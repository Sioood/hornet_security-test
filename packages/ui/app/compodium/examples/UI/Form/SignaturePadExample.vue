<script setup lang="ts">
// oxlint-disable no-console
import {
  useSignaturePad,
  type SignaturePadDrawDetails,
  type SignaturePadDrawEndDetails,
} from '@ark-ui/vue/signature-pad'

const paths = ref<string[]>([])
const imageUrl = ref('')

const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const

const externalApi = useSignaturePad()

const handleDrawEnd = async (details: SignaturePadDrawEndDetails) => {
  imageUrl.value = await details.getDataUrl('image/png')
}

function onDraw(details: SignaturePadDrawDetails) {
  console.log('draw:', details.paths)
}

function onDrawEnd(details: SignaturePadDrawEndDetails) {
  console.log('drawEnd:', details.paths)
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Basic -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Basic</h2>
        <p class="text-sm text-neutral-text-subtle">
          Default signature pad. Draw with mouse or touch.
        </p>
      </div>
      <UIFormSignaturePad label="Basic signature" intent="primary" @draw-end="onDrawEnd" />
    </section>

    <!-- v-model controlled -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled (v-model)</h2>
      <p class="text-sm text-neutral-text-subtle">Tracks drawing paths via <code>v-model</code>.</p>
      <UIFormSignaturePad v-model="paths" label="Signature" intent="secondary" @draw="onDraw" />
      <p class="font-mono text-xs text-neutral-text-subtle">
        Paths: {{ paths.length ? `${paths.length} path(s)` : '(empty)' }}
      </p>
    </section>

    <!-- Image preview -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Image Preview</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use <code>@draw-end</code> to capture the signature as an image.
      </p>
      <UIFormSignaturePad label="Sign below" intent="primary" @draw-end="handleDrawEnd" />
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        alt="Signature preview"
        class="mt-2 max-h-24 w-auto border border-neutral-border object-contain"
      />
      <p v-else class="text-xs text-neutral-text-subtle">
        Draw a signature above to see the preview
      </p>
    </section>

    <!-- Variants -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Variants</h2>
        <p class="text-sm text-neutral-text-subtle">
          <code>default</code> includes an intent-colored fill; <code>subtle</code> keeps borders
          only with a transparent background.
        </p>
      </div>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Default</p>
          <UIFormSignaturePad label="Default" intent="primary" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Subtle</p>
          <UIFormSignaturePad variant="subtle" label="Subtle" intent="primary" />
        </div>
      </div>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="intent in intents" :key="intent" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ intent }}</p>
          <UIFormSignaturePad :intent :label="intent" />
        </div>
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div class="flex flex-col gap-6">
        <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ size }}</p>
          <UIFormSignaturePad :size :label="`Size ${size}`" intent="primary" />
        </div>
      </div>
    </section>

    <!-- States: Disabled, ReadOnly, Required, Invalid -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">States</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Disabled</p>
          <UIFormSignaturePad disabled label="Disabled" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Read Only</p>
          <UIFormSignaturePad read-only label="Read Only" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Required</p>
          <UIFormSignaturePad required label="Required" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Invalid</p>
          <UIFormSignaturePad invalid label="Invalid" error="Signature is required" />
        </div>
      </div>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode (external API)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useSignaturePad()</code> — allows imperative control.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalApi.clear()"> Clear </UIButton>
      </div>
      <UIFormSignaturePad :value="externalApi" label="External API" intent="accent" />
    </section>
  </div>
</template>
