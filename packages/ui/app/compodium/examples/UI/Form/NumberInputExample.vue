<script setup lang="ts">
// oxlint-disable no-console
import { useNumberInput } from '@ark-ui/vue/number-input'

// ── Basic ──────────────────────────────────────────────────────────────────
const basicValue = ref<string>('0')

// ── Controlled (v-model) ───────────────────────────────────────────────────
const controlledValue = ref<string>('42')

// ── RootProvider mode ──────────────────────────────────────────────────────
const externalApi = useNumberInput({ defaultValue: '25', max: 100, min: 0, step: 5 })

// ── Event log ──────────────────────────────────────────────────────────────
const eventLog = ref<string[]>([])
function logEvent(name: string, details?: unknown): void {
  const detailStr = details ? JSON.stringify(details) : ''
  eventLog.value.unshift(`[${name}] ${detailStr}`)
  if (eventLog.value.length > 10) eventLog.value.pop()
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-12 p-6">
    <h1 class="text-2xl font-bold">UIFormNumberInput Examples</h1>

    <!-- Basic -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Basic</h2>
      <p class="text-sm text-neutral-text-subtle">
        Stacked <code>chevron-up</code> / <code>chevron-down</code> buttons on the right plus a
        scrubber grip handle. Click the grip and drag horizontally to scrub the value.
      </p>
      <UIFormNumberInput
        v-model="basicValue"
        label="Quantity"
        :min="0"
        :max="100"
        :step="1"
        @value-change="(d: any) => logEvent('valueChange', d.value)"
        @focus-change="(d: any) => logEvent('focusChange', d.focused)"
      />
      <p class="txt-caption text-neutral-text-subtle">Value: {{ basicValue }}</p>
    </section>

    <!-- Controlled (v-model) -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Controlled (v-model)</h2>
      <UIFormNumberInput v-model="controlledValue" label="Score" :min="0" :max="100" :step="5" />
      <p class="txt-caption text-neutral-text-subtle">Value: {{ controlledValue }}</p>
      <div class="flex gap-2">
        <UIButton variant="ghost" size="sm" @click="controlledValue = '0'">Set 0</UIButton>
        <UIButton variant="ghost" size="sm" @click="controlledValue = '50'">Set 50</UIButton>
        <UIButton variant="ghost" size="sm" @click="controlledValue = '100'">Set 100</UIButton>
      </div>
    </section>

    <!-- Min / Max -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Min &amp; Max</h2>
      <UIFormNumberInput label="Age" :min="18" :max="120" :step="1" />
      <UIFormNumberInput label="Percentage" :min="0" :max="100" :step="1" />
      <UIFormNumberInput label="Temperature" :min="-50" :max="50" :step="0.5" />
    </section>

    <!-- Step -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Step</h2>
      <UIFormNumberInput label="Step: 0.01" :min="0" :max="1" :step="0.01" />
      <UIFormNumberInput label="Step: 5" :min="0" :max="100" :step="5" />
      <UIFormNumberInput label="Step: 100" :min="0" :max="1000" :step="100" />
    </section>

    <!-- Spin on press -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Spin on Press</h2>
      <p class="text-sm text-neutral-text-subtle">
        Hold the increment/decrement button to auto-spin the value.
      </p>
      <UIFormNumberInput label="Spin enabled" :min="0" :max="100" :step="1" :spin-on-press="true" />
      <UIFormNumberInput
        label="Spin disabled"
        :min="0"
        :max="100"
        :step="1"
        :spin-on-press="false"
      />
    </section>

    <!-- Mouse wheel -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Mouse Wheel</h2>
      <p class="text-sm text-neutral-text-subtle">Scroll over the input to change the value.</p>
      <UIFormNumberInput
        label="Mouse wheel enabled"
        :min="0"
        :max="100"
        :step="1"
        :allow-mouse-wheel="true"
      />
      <UIFormNumberInput
        label="Mouse wheel disabled"
        :min="0"
        :max="100"
        :step="1"
        :allow-mouse-wheel="false"
      />
    </section>

    <!-- Scrubber -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Scrubbing</h2>
      <p class="text-sm text-neutral-text-subtle">
        The grip handle on the right (
        <Icon name="tabler:grip-vertical" class="inline size-3" />) supports{" "}
        <strong>click-and-drag scrubbing</strong>. Hover over it (cursor changes to{" "}
        <code>ew-resize</code>) then click and drag horizontally to increment/decrement the value
        smoothly. Hold <kbd>Shift</kbd> for fine-grained control.
      </p>
      <UIFormNumberInput
        label="Drag the grip →"
        :min="0"
        :max="1000"
        :step="1"
        :allow-mouse-wheel="false"
        :spin-on-press="false"
      />
      <UIFormNumberInput
        label="Coarse step (10)"
        :min="0"
        :max="1000"
        :step="10"
        :allow-mouse-wheel="false"
        :spin-on-press="false"
      />
    </section>

    <!-- Format options (locale / currency) -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Locale &amp; Format</h2>
      <UIFormNumberInput label="fr-FR locale" :min="0" :max="10000" :step="0.5" locale="fr-FR" />
      <UIFormNumberInput
        label="en-US with grouping"
        :min="0"
        :max="100000"
        :step="1"
        :format-options="{ useGrouping: true }"
      />
      <UIFormNumberInput
        label="Currency (USD)"
        :min="0"
        :max="10000"
        :step="0.01"
        :format-options="{ style: 'currency', currency: 'USD' }"
        locale="en-US"
      />
      <UIFormNumberInput
        label="Currency (EUR, fr-FR)"
        :min="0"
        :max="10000"
        :step="0.01"
        :format-options="{ style: 'currency', currency: 'EUR' }"
        locale="fr-FR"
      />
    </section>

    <!-- Disabled / Read-only / Invalid -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">States</h2>
      <UIFormNumberInput label="Disabled" disabled :min="0" :max="100" />
      <UIFormNumberInput label="Read-only" read-only :min="0" :max="100" :default-value="'42'" />
      <UIFormNumberInput
        label="Invalid"
        invalid
        error="Please enter a valid number"
        :min="0"
        :max="100"
      />
      <UIFormNumberInput label="Required" required :min="0" :max="100" />
    </section>

    <!-- With icons -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">With Icons</h2>
      <UIFormNumberInput
        label="Leading icon"
        :min="0"
        :max="100"
        leading
        leading-icon="tabler:coins"
      />
      <UIFormNumberInput
        label="Trailing icon"
        :min="0"
        :max="100"
        trailing
        trailing-icon="tabler:percentage"
      />
    </section>

    <!-- Intent -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Intents</h2>
      <div class="grid grid-cols-2 gap-4">
        <UIFormNumberInput
          v-for="intent in ['neutral', 'primary', 'secondary', 'accent'] as const"
          :key="intent"
          :label="intent"
          :intent
          :min="0"
          :max="100"
          size="sm"
        />
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Sizes</h2>
      <UIFormNumberInput
        v-for="size in ['sm', 'md', 'lg'] as const"
        :key="size"
        :label="`Size: ${size}`"
        :size
        :min="0"
        :max="100"
      />
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">RootProvider (useNumberInput)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useNumberInput()</code> — allows calling <code>setValue()</code>,
        <code>increment()</code>, <code>decrement()</code> imperatively.
      </p>
      <div class="flex gap-2">
        <UIButton variant="ghost" size="sm" @click="externalApi.setValue(0)">Set 0</UIButton>
        <UIButton variant="ghost" size="sm" @click="externalApi.setValue(50)">Set 50</UIButton>
        <UIButton variant="ghost" size="sm" @click="externalApi.increment()">+5</UIButton>
        <UIButton variant="ghost" size="sm" @click="externalApi.decrement()">-5</UIButton>
        <UIButton variant="ghost" size="sm" @click="externalApi.clearValue()">Clear</UIButton>
      </div>
      <UIFormNumberInput :value="externalApi" label="External Control" />
    </section>

    <!-- Event Log -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Event Log</h2>
      <div class="max-h-40 overflow-y-auto rounded-md bg-neutral-fill-subtle p-3 font-mono text-xs">
        <div v-for="(entry, i) in eventLog" :key="i" class="py-0.5 text-neutral-text-subtle">
          {{ entry }}
        </div>
        <div v-if="eventLog.length === 0" class="text-neutral-text-subtle italic">
          Interact with a number input to see events…
        </div>
      </div>
    </section>
  </div>
</template>
