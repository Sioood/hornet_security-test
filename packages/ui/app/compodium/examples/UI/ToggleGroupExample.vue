<script setup lang="ts">
// oxlint-disable no-console
import { useToggleGroup, type ToggleGroupValueChangeDetails } from '@ark-ui/vue/toggle-group'

const align = ref<string[]>(['center'])
const formatting = ref<string[]>(['bold'])
const devices = ref<string[]>(['desktop'])

const alignOptions = [
  { icon: 'tabler:align-left', title: 'Align Left', value: 'left' },
  { icon: 'tabler:align-center', title: 'Align Center', value: 'center' },
  { icon: 'tabler:align-right', title: 'Align Right', value: 'right' },
  { icon: 'tabler:align-justified', title: 'Justify', value: 'justify' },
]

const formattingOptions = [
  { icon: 'tabler:bold', title: 'Bold', value: 'bold' },
  { icon: 'tabler:italic', title: 'Italic', value: 'italic' },
  { icon: 'tabler:underline', title: 'Underline', value: 'underline' },
  { icon: 'tabler:strikethrough', title: 'Strikethrough', value: 'strike' },
]

const deviceOptions = [
  { icon: 'tabler:device-mobile', title: 'Mobile', value: 'mobile' },
  { icon: 'tabler:device-tablet', title: 'Tablet', value: 'tablet' },
  { icon: 'tabler:device-desktop', title: 'Desktop', value: 'desktop' },
]

const verticalOptions = [
  { title: 'Small', value: 'sm' },
  { title: 'Medium', value: 'md' },
  { title: 'Large', value: 'lg' },
]

const externalGroup = useToggleGroup({ defaultValue: ['bold'], multiple: true })
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-12 p-8">
    <!-- Single selection -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Text Alignment (Single)</h3>
      <div
        class="flex flex-col items-center gap-2 rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-6 disabled:pointer-events-none disabled:opacity-40"
      >
        <UIToggleGroup
          v-model="align"
          :options="alignOptions"
          active-background
          intent="primary"
          @value-change="(d: ToggleGroupValueChangeDetails) => console.log('valueChange', d)"
        />
        <p class="mt-2 font-mono text-xs text-neutral-text-subtle">Value: {{ align }}</p>
      </div>
    </section>

    <!-- Multiple selection -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Rich Text Formatting (Multiple)</h3>
      <div
        class="flex flex-col items-center gap-2 rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-6 disabled:pointer-events-none disabled:opacity-40"
      >
        <UIToggleGroup
          v-model="formatting"
          :options="formattingOptions"
          multiple
          active-background
          intent="accent"
          @value-change="(d: ToggleGroupValueChangeDetails) => console.log('valueChange', d)"
        />
        <p class="mt-2 font-mono text-xs text-neutral-text-subtle">Value: {{ formatting }}</p>
      </div>
    </section>

    <!-- Vertical orientation -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Vertical Orientation</h3>
      <div
        class="flex flex-col items-start gap-2 rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-6 disabled:pointer-events-none disabled:opacity-40"
      >
        <UIToggleGroup
          v-model="align"
          :options="verticalOptions"
          active-background
          orientation="vertical"
          intent="secondary"
          size="md"
        />
      </div>
    </section>

    <!-- Disabled options -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Disabled Options</h3>
      <div
        class="flex flex-col items-center gap-2 rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-6 disabled:pointer-events-none disabled:opacity-40"
      >
        <UIToggleGroup
          v-model="align"
          :options="[
            { value: 'left', title: 'Left', icon: 'tabler:align-left' },
            { value: 'center', title: 'Center', icon: 'tabler:align-center' },
            { value: 'right', title: 'Right', icon: 'tabler:align-right', disabled: true },
            { value: 'justify', title: 'Justify', icon: 'tabler:align-justified', disabled: true },
          ]"
          active-background
          intent="neutral"
        />
      </div>
    </section>

    <!-- Custom slot -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Custom Slot</h3>
      <div
        class="flex flex-col items-center gap-2 rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-6 disabled:pointer-events-none disabled:opacity-40"
      >
        <UIToggleGroup
          v-model="devices"
          :options="deviceOptions"
          active-background
          intent="secondary"
          size="lg"
        >
          <template #item="{ option, pressed }">
            <div class="flex items-center gap-2 px-1">
              <Icon :name="option.icon!" class="size-5" />
              <span class="font-medium">{{ option.title }}</span>
              <div v-if="pressed" class="size-1.5 animate-pulse rounded-full bg-secondary-fill" />
            </div>
          </template>
        </UIToggleGroup>
      </div>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">RootProvider mode (external API)</h3>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useToggleGroup()</code> — call
        <code>externalGroup.setValue()</code> imperatively.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalGroup.setValue(['bold'])">
          Bold only
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalGroup.setValue(['bold', 'italic'])">
          Bold + Italic
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalGroup.setValue([])">Clear</UIButton>
      </div>
      <UIToggleGroup
        :value="externalGroup"
        :options="formattingOptions"
        active-background
        intent="primary"
        @value-change="(d: ToggleGroupValueChangeDetails) => console.log('valueChange', d)"
      />
      <p class="font-mono text-xs text-neutral-text-subtle">Value: {{ externalGroup.value }}</p>
    </section>
  </div>
</template>
