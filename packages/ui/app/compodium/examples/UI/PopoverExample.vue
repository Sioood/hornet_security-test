<script setup lang="ts">
import {
  usePopover,
  type PopoverOpenChangeDetails,
  type PopoverInteractOutsideEvent,
} from '@ark-ui/vue/popover'

const controlledOpen = ref(false)
const notifications = ref(true)
const marketing = ref(false)

const externalPopover = usePopover({ defaultOpen: false })

const triggerLabels: Record<string, string> = {
  1: 'Security Settings',
  2: 'Privacy Options',
  3: 'Account Preferences',
}
</script>

<template>
  <div class="flex flex-col gap-10 p-6">
    <!-- Basic -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Basic (Root mode)</h3>
      <div class="flex gap-4">
        <UIPopover
          title="Information"
          description="Basic usage of the popover component."
          content="This is a simple popover with a title and description."
          show-close-trigger
          @open-change="(d: PopoverOpenChangeDetails) => console.log('openChange', d)"
          @escape-key-down="(d: KeyboardEvent) => console.log('escapeKeyDown', d)"
          @interact-outside="(d: PopoverInteractOutsideEvent) => console.log('interactOutside', d)"
        />

        <UIPopover intent="neutral" title="With Arrow" description="Arrow pointing to trigger.">
          <template #trigger>
            <UIButton variant="subtle" intent="neutral">With Arrow</UIButton>
          </template>
        </UIPopover>
      </div>
    </section>

    <!-- Complex content -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Complex Content (Settings)</h3>
      <UIPopover title="Quick Settings" description="Manage your preferences.">
        <template #trigger>
          <UIButton variant="subtle" intent="neutral">
            <Icon name="tabler:settings" class="mr-2" />
            Settings
          </UIButton>
        </template>
        <template #content>
          <div class="flex min-w-50 flex-col gap-4">
            <UISwitch v-model:checked="notifications" label="Push Notifications" size="sm" />
            <UISwitch v-model:checked="marketing" label="Marketing Emails" size="sm" />
            <div class="mt-1 flex justify-end gap-2 border-t border-neutral-border-subtle pt-3">
              <UIButton size="sm" variant="ghost">Reset</UIButton>
              <UIButton size="sm" intent="primary">Save</UIButton>
            </div>
          </div>
        </template>
      </UIPopover>
    </section>

    <!-- Multiple triggers -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Multiple Triggers (context slot)</h3>
      <UIPopover title="Shared Popover" :positioning="{ placement: 'top' }">
        <template #triggers="{ trigger: Trigger, popover }">
          <div class="join flex">
            <component
              :is="Trigger"
              v-for="i in [1, 2, 3]"
              :key="i"
              :value="i.toString()"
              class="join-item"
            >
              <UIButton variant="subtle" class="join-item">Trigger {{ i }}</UIButton>
            </component>
          </div>
          <p class="mt-1 font-mono text-xs text-neutral-text-subtle">open={{ popover.open }}</p>
        </template>
        <template #content="{ triggerValue }">
          <div class="p-2">
            <span class="font-bold text-primary-text">Active:</span>
            {{ triggerLabels[triggerValue ?? ''] ?? 'Select a trigger' }}
          </div>
        </template>
      </UIPopover>
    </section>

    <!-- Controlled -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Controlled (v-model:open)</h3>
      <div class="flex gap-4">
        <UIPopover
          v-model:open="controlledOpen"
          title="External Control"
          content="I am managed by a parent ref."
          @open-change="(d: PopoverOpenChangeDetails) => console.log('openChange', d)"
        >
          <template #trigger>
            <UIButton @click="controlledOpen = !controlledOpen">
              {{ controlledOpen ? 'Close' : 'Open' }} Programmatically
            </UIButton>
          </template>
        </UIPopover>

        <UIPopover
          modal
          show-close-trigger
          title="Modal Popover"
          description="Focus is trapped inside."
        >
          <template #trigger>
            <UIButton intent="accent">Open Modal</UIButton>
          </template>
        </UIPopover>
      </div>
      <p class="font-mono text-xs text-neutral-text-subtle">open={{ controlledOpen }}</p>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">RootProvider mode (external API)</h3>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>usePopover()</code> — call <code>externalPopover.value.open()</code> and
        <code>externalPopover.value.close()</code> from anywhere.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalPopover.setOpen(true)">Open</UIButton>
        <UIButton size="sm" variant="subtle" @click="externalPopover.setOpen(false)">
          Close
        </UIButton>
      </div>
      <UIPopover
        :value="externalPopover"
        title="RootProvider Popover"
        content="Controlled externally via usePopover()."
        show-close-trigger
      />
    </section>
  </div>
</template>
