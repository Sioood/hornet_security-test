<script setup lang="ts">
import { useTooltip, type TooltipOpenChangeDetails } from '@ark-ui/vue/tooltip'

const placements = ['top', 'bottom', 'left', 'right'] as const
const intents = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const

const externalTooltip = useTooltip({ openDelay: 0 })
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-12 p-8">
    <!-- Standard placements -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Standard Placements</h3>
      <div
        class="flex flex-wrap justify-center gap-8 rounded-xl border border-dashed border-neutral-border-subtle bg-neutral-fill-subtle/20 p-8 disabled:pointer-events-none disabled:opacity-40"
      >
        <UITooltip
          v-for="placement in placements"
          :key="placement"
          :content="`Tooltip on ${placement}`"
          :positioning="{ placement }"
          @open-change="(d: TooltipOpenChangeDetails) => console.log('openChange', placement, d)"
        >
          <template #trigger>
            <UIButton size="sm" class="capitalize">{{ placement }}</UIButton>
          </template>
        </UITooltip>
      </div>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Intents</h3>
      <div class="flex flex-wrap justify-center gap-4">
        <UITooltip
          v-for="intent in intents"
          :key="intent"
          :content="`${intent} tooltip`"
          :intent
          :open-delay="0"
        >
          <template #trigger>
            <UIButton variant="subtle" size="sm" class="capitalize">{{ intent }}</UIButton>
          </template>
        </UITooltip>
      </div>
    </section>

    <!-- Disabled -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Disabled</h3>
      <UITooltip content="You won't see this" disabled>
        <template #trigger>
          <UIButton size="sm" disabled>Disabled trigger</UIButton>
        </template>
      </UITooltip>
    </section>

    <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
      <!-- Follow cursor -->
      <section class="flex flex-col gap-4">
        <h3 class="text-xl font-bold">Follow Cursor</h3>
        <UITooltip
          content="I am following you!"
          follow-cursor
          :open-delay="0"
          :close-delay="50"
          class="flex h-32 w-full cursor-crosshair items-center justify-center rounded-lg border border-primary-border-subtle bg-primary-fill-subtle/30 disabled:pointer-events-none disabled:opacity-40"
        >
          <template #trigger>
            <span class="font-medium text-primary-text">Hover anywhere in this box</span>
          </template>
        </UITooltip>
      </section>

      <!-- Interactive content -->
      <section class="flex flex-col gap-4">
        <h3 class="text-xl font-bold">Interactive Content</h3>
        <UITooltip interactive :open-delay="200">
          <template #trigger>
            <UIButton variant="subtle" intent="accent">Hover for details</UIButton>
          </template>
          <template #content>
            <div class="flex max-w-50 flex-col gap-1">
              <span class="font-bold">Rich Tooltip</span>
              <span>
                This tooltip is <span class="text-accent-text">interactive</span> and allows
                clicking inside.
              </span>
              <a href="#" class="mt-1 text-primary-text underline">Learn more</a>
            </div>
          </template>
        </UITooltip>
      </section>
    </div>

    <!-- Shared tooltip -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Shared Tooltip</h3>
      <UITooltip content="Shared tooltip" :positioning="{ placement: 'top', gutter: 12 }">
        <template #triggers="{ trigger: Trigger, onTriggerPointerMove }">
          <div
            class="flex justify-center gap-2 rounded-lg border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-4 disabled:pointer-events-none disabled:opacity-40"
          >
            <component
              :is="Trigger"
              v-for="icon in ['tabler:home', 'tabler:user', 'tabler:settings', 'tabler:mail']"
              :key="icon"
              :value="icon.split(':')[1]"
              class="rounded-md p-2 transition-colors hover:bg-neutral-fill-subtle"
              @pointermove="onTriggerPointerMove($event)"
            >
              <Icon :name="icon" class="size-6 text-neutral-text" />
            </component>
          </div>
        </template>
        <template #content="{ triggerValue }">
          <span class="font-bold capitalize">{{ triggerValue }}</span>
        </template>
      </UITooltip>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">RootProvider mode (external API)</h3>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useTooltip()</code> — call <code>externalTooltip.value.open()</code> and
        <code>externalTooltip.value.close()</code> from outside.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalTooltip.setOpen(true)">Open</UIButton>
        <UIButton size="sm" variant="subtle" @click="externalTooltip.setOpen(false)">
          Close
        </UIButton>
      </div>
      <UITooltip
        :value="externalTooltip"
        intent="primary"
        @open-change="(d: TooltipOpenChangeDetails) => console.log('openChange', d)"
      >
        <template #trigger>
          <UIButton variant="subtle" intent="primary">Hover or use buttons above</UIButton>
        </template>
        <template #content>
          <span>Controlled by <code>useTooltip()</code></span>
        </template>
      </UITooltip>
    </section>
  </div>
</template>
