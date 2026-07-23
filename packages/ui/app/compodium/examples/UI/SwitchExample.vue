<script setup lang="ts">
// oxlint-disable no-console
import { useSwitch, type SwitchCheckedChangeDetails } from '@ark-ui/vue/switch'

const settings = ref({
  autoUpdate: true,
  biometrics: false,
  darkMode: false,
  notifications: true,
})

const externalSwitch = useSwitch({ defaultChecked: false })

const sizes = ['sm', 'md', 'lg'] as const
const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-12 p-6">
    <!-- App settings showcase -->
    <section class="flex flex-col gap-6">
      <h2 class="text-xl font-bold">App Settings</h2>
      <div
        class="flex flex-col overflow-hidden rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/5 disabled:pointer-events-none disabled:opacity-40"
      >
        <div
          v-for="(key, i) in ['notifications', 'darkMode', 'autoUpdate', 'biometrics'] as const"
          :key="key"
          :class="[
            'flex items-center justify-between p-4 transition-colors hover:bg-neutral-fill-subtle/20',
            i < 3 ? 'border-b border-neutral-border-subtle' : '',
          ]"
        >
          <div class="flex flex-col">
            <span class="font-medium text-neutral-text capitalize">{{ key }}</span>
            <span class="text-xs text-neutral-text-subtle">Toggle {{ key }} setting</span>
          </div>
          <UISwitch
            v-model:checked="settings[key]"
            :intent="intents[i]"
            @checked-change="
              (d: SwitchCheckedChangeDetails) => console.log('checkedChange', key, d)
            "
          />
        </div>
      </div>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div
        class="flex flex-col items-start gap-4 rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-6 disabled:pointer-events-none disabled:opacity-40"
      >
        <UISwitch
          v-for="intent in intents"
          :key="intent"
          :intent
          :label="`Intent: ${intent}`"
          :model-value="true"
        />
      </div>
    </section>

    <!-- Sizes -->
    <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
      <section class="flex flex-col gap-4">
        <h3 class="text-lg font-bold">Sizes</h3>
        <div
          class="flex flex-col items-start gap-4 rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-6 disabled:pointer-events-none disabled:opacity-40"
        >
          <UISwitch
            v-for="size in sizes"
            :key="size"
            :size
            :label="`Size ${size}`"
            :model-value="true"
          />
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <h3 class="text-lg font-bold">States</h3>
        <div
          class="flex flex-col items-start gap-4 rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-6 disabled:pointer-events-none disabled:opacity-40"
        >
          <UISwitch label="Required" required :model-value="false" />
          <UISwitch label="Disabled (on)" disabled :model-value="true" />
          <UISwitch label="Disabled (off)" disabled :model-value="false" />
          <UISwitch label="Invalid State" invalid error="This option is mandatory" />
        </div>
      </section>
    </div>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode (external API)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useSwitch()</code> — call
        <code>externalSwitch.value.setChecked()</code> from outside.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalSwitch.setChecked(true)">
          Force On
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalSwitch.setChecked(false)">
          Force Off
        </UIButton>
      </div>
      <UISwitch
        :value="externalSwitch"
        label="Externally controlled"
        intent="accent"
        @checked-change="(d: SwitchCheckedChangeDetails) => console.log('checkedChange', d)"
      />
    </section>
  </div>
</template>
