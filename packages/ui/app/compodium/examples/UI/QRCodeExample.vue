<script setup lang="ts">
import { useQrCode } from '@ark-ui/vue/qr-code'

const url = ref('https://hornet_security-test.dev')
const intents = ['neutral', 'primary', 'secondary', 'accent', 'blackAndWhite'] as const

const externalQrCode = useQrCode({ value: 'https://ark-ui.com' })
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Basic -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Basic</h3>
      <div class="flex flex-wrap gap-6">
        <div class="size-32">
          <UIQRCode v-model="url" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-neutral-text">Edit URL</label>
          <input
            v-model="url"
            type="text"
            class="rounded-md border border-neutral-border bg-neutral-surface px-3 py-1.5 text-sm text-neutral-text"
          />
          <p class="font-mono text-xs text-neutral-text-subtle">{{ url }}</p>
        </div>
      </div>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Intents</h3>
      <div class="flex flex-wrap gap-6">
        <div v-for="intent in intents" :key="intent" class="flex flex-col items-center gap-2">
          <div class="size-24">
            <UIQRCode v-model="url" :intent />
          </div>
          <span class="text-xs text-neutral-text-subtle capitalize">{{ intent }}</span>
        </div>
      </div>
    </section>

    <!-- With overlay (logo) -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">With Overlay</h3>
      <div class="size-36">
        <UIQRCode v-model="url" intent="primary" :encoding="{ ecc: 'H', boostEcc: true }">
          <template #overlay>
            <div
              class="flex size-8 items-center justify-center rounded-full bg-primary-fill text-primary-on-fill"
            >
              <Icon name="tabler:link" class="size-4" />
            </div>
          </template>
        </UIQRCode>
      </div>
    </section>

    <!-- Downloadable -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Downloadable</h3>
      <div class="size-36">
        <UIQRCode
          v-model="url"
          intent="blackAndWhite"
          downloadable
          download-label="Download PNG"
          file-name="my-qr.png"
          @model-value-change="(d: unknown) => console.log('modelValueChange', d)"
        />
      </div>
    </section>

    <!-- Encoding options -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Error Correction Levels</h3>
      <div class="flex flex-wrap gap-6">
        <div
          v-for="ecc in ['L', 'M', 'Q', 'H']"
          :key="ecc"
          class="flex flex-col items-center gap-2"
        >
          <div class="size-24">
            <UIQRCode
              v-model="url"
              :encoding="{ ecc: ecc as 'L' | 'M' | 'Q' | 'H', boostEcc: true }"
            />
          </div>
          <span class="text-xs text-neutral-text-subtle">ECC: {{ ecc }}</span>
        </div>
      </div>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">RootProvider mode (external API)</h3>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useQrCode()</code> — call <code>externalQrCode.setValue()</code> from
        outside.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalQrCode.setValue('https://ark-ui.com')">
          Ark UI
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalQrCode.setValue('https://vuejs.org')">
          Vue.js
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalQrCode.setValue('https://nuxt.com')">
          Nuxt
        </UIButton>
      </div>
      <div class="size-36">
        <UIQRCode :value="externalQrCode" intent="accent" />
      </div>
    </section>
  </div>
</template>
