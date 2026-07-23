<script setup lang="ts">
import { useSlider } from '@ark-ui/vue/slider'

// ── Controlled state ────────────────────────────────────────────────────────
const controlledValue = ref<number[]>([30])
const rangeValue = ref<number[]>([25, 75])

// ── RootProvider mode ───────────────────────────────────────────────────────
const externalSlider = useSlider({ defaultValue: [60], orientation: 'horizontal' })

// ── Event log ───────────────────────────────────────────────────────────────
const eventLog = ref<string[]>([])
function logEvent(name: string, details?: unknown): void {
  const detailStr = details ? JSON.stringify(details) : ''
  eventLog.value.unshift(`[${name}] ${detailStr}`)
  if (eventLog.value.length > 15) eventLog.value.pop()
}

// ── Marks ───────────────────────────────────────────────────────────────────
const marks = [0, 25, 50, 75, 100]
const rangeMarks = [0, 20, 40, 60, 80, 100]

// ── Thumb collision modes ───────────────────────────────────────────────────
const collisionModes = ['none', 'push', 'swap'] as const
const collisionMode = ref<(typeof collisionModes)[number]>('push')

// ── Format helpers ──────────────────────────────────────────────────────────
function formatCurrency(value: number, _index: number): string {
  return `$${value}`
}

function formatPercentage(value: number, _index: number): string {
  return `${value}%`
}
</script>

<template>
  <div class="flex flex-col gap-12 p-6">
    <h1 class="text-2xl font-bold">UIFormSlider Examples</h1>

    <!-- ── Basic ────────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Basic</h2>
      <UIFormSlider
        label="Volume"
        :default-value="[40]"
        @value-change="(d: any) => logEvent('valueChange', d.value)"
        @value-change-end="(d: any) => logEvent('valueChangeEnd', d.value)"
      />
    </section>

    <!-- ── Intents ──────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Intents</h2>
      <UIFormSlider label="Neutral" intent="neutral" :default-value="[30]" />
      <UIFormSlider label="Primary" intent="primary" :default-value="[50]" />
      <UIFormSlider label="Secondary" intent="secondary" :default-value="[70]" />
      <UIFormSlider label="Accent" intent="accent" :default-value="[90]" />
    </section>

    <!-- ── Sizes ────────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Sizes</h2>
      <UIFormSlider label="Small" size="sm" :default-value="[25]" />
      <UIFormSlider label="Medium" size="md" :default-value="[50]" />
      <UIFormSlider label="Large" size="lg" :default-value="[75]" />
    </section>

    <!-- ── Range (multiple thumbs) ──────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Range</h2>
      <UIFormSlider
        v-model="rangeValue"
        label="Price Range"
        :default-value="[25, 75]"
        :format-value="formatCurrency"
      />
      <p class="txt-caption text-neutral-text-subtle">
        Selected: ${{ rangeValue[0] }} – ${{ rangeValue[1] }}
      </p>
    </section>

    <!-- ── Min/Max ──────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Min &amp; Max</h2>
      <UIFormSlider label="Offset" :min="-10" :max="10" :default-value="[5]" />
      <UIFormSlider label="Large range" :min="0" :max="1000" :step="50" :default-value="[250]" />
    </section>

    <!-- ── Step / Granularity ───────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Step (Granularity)</h2>
      <UIFormSlider label="Step: 0.01" :step="0.01" :min="5" :max="10" :default-value="[7.5]" />
      <UIFormSlider label="Step: 10" :step="10" :default-value="[50]" />
    </section>

    <!-- ── Marks ────────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Marks</h2>
      <UIFormSlider label="With Marks" :default-value="[50]" :marks="marks" />
      <UIFormSlider label="Range + Marks" :default-value="[30, 70]" :marks="rangeMarks" />
    </section>

    <!-- ── Orientation (Vertical) ───────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Orientation</h2>
      <div class="flex items-end gap-8">
        <UIFormSlider label="Vertical" orientation="vertical" :default-value="[30]" class="h-48" />
        <UIFormSlider
          label="Vertical Range"
          orientation="vertical"
          :default-value="[20, 80]"
          class="h-48"
        />
        <UIFormSlider
          label="Vertical + Marks"
          orientation="vertical"
          :default-value="[50]"
          :marks="marks"
          class="h-48"
        />
      </div>
    </section>

    <!-- ── Origin ───────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Origin</h2>
      <UIFormSlider label="Origin: start (default)" origin="start" :default-value="[75]" />
      <UIFormSlider label="Origin: center" origin="center" :default-value="[75]" />
    </section>

    <!-- ── Controlled (v-model) ─────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Controlled (v-model)</h2>
      <UIFormSlider v-model="controlledValue" label="Controlled" />
      <p class="txt-caption text-neutral-text-subtle">Value: {{ controlledValue.join(', ') }}</p>
      <div class="flex gap-2">
        <UIButton variant="ghost" size="sm" @click="controlledValue = [10]">Set to 10</UIButton>
        <UIButton variant="ghost" size="sm" @click="controlledValue = [90]">Set to 90</UIButton>
        <UIButton variant="ghost" size="sm" @click="controlledValue = [50]">Reset</UIButton>
      </div>
    </section>

    <!-- ── Dragging Indicator ───────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Dragging Indicator</h2>
      <UIFormSlider label="With Indicator" :default-value="[40]" />
      <p class="txt-caption text-neutral-text-subtle">
        The thumb shows its current value while being dragged.
      </p>
    </section>

    <!-- ── Thumb Collision ──────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Thumb Collision</h2>
      <div class="mb-2 flex gap-2">
        <UIButton
          v-for="mode in collisionModes"
          :key="mode"
          :variant="collisionMode === mode ? 'default' : 'ghost'"
          size="sm"
          @click="collisionMode = mode"
        >
          {{ mode }}
        </UIButton>
      </div>
      <UIFormSlider
        :label="`Collision: ${collisionMode}`"
        :thumb-collision-behavior="collisionMode"
        :default-value="[25, 60]"
      />
    </section>

    <!-- ── Thumb Overlap (minStepsBetweenThumbs) ────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Thumb Overlap Prevention</h2>
      <UIFormSlider
        label="minStepsBetweenThumbs: 5"
        :min-steps-between-thumbs="5"
        :default-value="[25, 60]"
      />
      <UIFormSlider
        label="minStepsBetweenThumbs: 10"
        :min-steps-between-thumbs="10"
        :default-value="[15, 85]"
      />
    </section>

    <!-- ── RootProvider mode ────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">RootProvider (useSlider)</h2>
      <div class="mb-2 flex gap-2">
        <UIButton variant="ghost" size="sm" @click="externalSlider.focus()">Focus</UIButton>
        <UIButton variant="ghost" size="sm" @click="externalSlider.setValue([10])">Set 10</UIButton>
        <UIButton variant="ghost" size="sm" @click="externalSlider.setValue([90])">Set 90</UIButton>
      </div>
      <UIFormSlider :value="externalSlider" label="External Control" orientation="horizontal" />
    </section>

    <!-- ── Disabled ─────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Disabled</h2>
      <UIFormSlider label="Disabled" disabled :default-value="[40]" />
      <UIFormSlider label="Disabled Range" disabled :default-value="[25, 75]" />
    </section>

    <!-- ── Read-Only ────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Read-Only</h2>
      <UIFormSlider label="Read-Only" read-only :default-value="[60]" />
    </section>

    <!-- ── Invalid ──────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Invalid</h2>
      <UIFormSlider label="Invalid" invalid :default-value="[30]" />
    </section>

    <!-- ── Custom format ──────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Custom Format</h2>
      <UIFormSlider label="Currency" :default-value="[50]" :format-value="formatCurrency" />
      <UIFormSlider label="Percentage" :default-value="[75]" :format-value="formatPercentage" />
    </section>

    <!-- ── Event Log ────────────────────────────────────────────────── -->
    <section class="flex w-full max-w-md flex-col gap-3">
      <h2 class="text-lg font-semibold">Event Log</h2>
      <div class="max-h-40 overflow-y-auto rounded-md bg-neutral-fill-subtle p-3 font-mono text-xs">
        <div v-for="(entry, i) in eventLog" :key="i" class="py-0.5 text-neutral-text-subtle">
          {{ entry }}
        </div>
        <div v-if="eventLog.length === 0" class="text-neutral-text-subtle italic">
          Interact with a slider to see events…
        </div>
      </div>
    </section>
  </div>
</template>
