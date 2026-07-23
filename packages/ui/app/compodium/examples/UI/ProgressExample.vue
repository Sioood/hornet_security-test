<script setup lang="ts">
// oxlint-disable no-console
import { useProgress, type ProgressValueChangeDetails } from '@ark-ui/vue/progress'

const value = ref(0)
const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const
const circularSizes = ['sm', 'md', 'lg', 'icon-sm', 'icon-md', 'icon-lg'] as const

const externalProgress = useProgress({ max: 100, min: 0 })

onMounted(() => {
  const interval = setInterval(() => {
    value.value = value.value >= 100 ? 0 : value.value + Math.min(Math.random() * 10, 100)
  }, 1000)
  onUnmounted(() => clearInterval(interval))
})

watchEffect(() => {
  externalProgress.value.setValue(value.value)
})
</script>

<template>
  <div class="flex w-full flex-col gap-8">
    <span class="font-mono text-sm text-neutral-text-subtle tabular-nums">
      Actual value: {{ value.toFixed(1) }}
    </span>

    <!-- Linear progress -->
    <div class="flex flex-col gap-6">
      <h3 class="text-lg font-bold">Linear Progress</h3>
      <div v-for="intent in intents" :key="intent" class="flex flex-col gap-4">
        <h4 class="font-semibold text-neutral-text capitalize">{{ intent }}</h4>
        <div class="flex flex-col gap-2">
          <UIProgress
            v-for="size in sizes"
            :key="size"
            v-model="value"
            :label="`Loading (${size})`"
            :intent
            :size
            @value-change="
              (d: ProgressValueChangeDetails) => console.log('valueChange', intent, size, d)
            "
          />
        </div>
      </div>

      <h4 class="font-semibold text-neutral-text capitalize">Vertical</h4>
      <div class="flex h-40 gap-4">
        <UIProgress
          v-for="intent in intents"
          :key="intent"
          v-model="value"
          label="Vertical"
          :intent
          orientation="vertical"
        />
      </div>

      <h4 class="font-semibold text-neutral-text capitalize">Indeterminate (undefined)</h4>
      <UIProgress :model-value="undefined" label="Indeterminate" />
    </div>

    <!-- Circular progress -->
    <div class="flex flex-col gap-6">
      <h3 class="text-lg font-bold">Circular Progress</h3>
      <div v-for="intent in intents" :key="intent" class="flex flex-col gap-4">
        <h4 class="font-semibold text-neutral-text capitalize">{{ intent }}</h4>
        <div class="flex flex-wrap gap-4">
          <UIProgressCircular
            v-for="size in circularSizes"
            :key="size"
            v-model="value"
            :label="size"
            :intent
            :size
            @value-change="
              (d: ProgressValueChangeDetails) => console.log('valueChange', intent, size, d)
            "
          />
        </div>
      </div>

      <h4 class="font-semibold text-neutral-text capitalize">Indeterminate (undefined)</h4>
      <div class="flex flex-wrap gap-4">
        <UIProgressCircular
          v-for="size in circularSizes"
          :key="size"
          :model-value="undefined"
          :label="size"
          :size
        />
      </div>
    </div>

    <!-- RootProvider mode -->
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">RootProvider mode (external API)</h3>
      <p class="text-sm text-neutral-text-subtle">
        Shared <code>useProgress()</code> instance synced with the live value above.
      </p>
      <UIProgress :value="externalProgress" label="Synced" intent="accent" />
      <UIProgressCircular
        :value="externalProgress"
        label="Circular synced"
        intent="accent"
        size="md"
      />
    </div>
  </div>
</template>
