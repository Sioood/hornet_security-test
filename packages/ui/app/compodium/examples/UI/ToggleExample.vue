<script setup lang="ts">
const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const

const pressed = ref(false)
</script>

<template>
  <div class="flex flex-col gap-10 p-4">
    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Intents (Active Background)</h3>
      <div class="flex flex-wrap gap-4">
        <UIToggle
          v-for="intent in intents"
          :key="intent"
          :intent
          active-background
          @pressed-change="(d: boolean) => console.log('pressedChange', intent, d)"
        >
          <template #on><Icon name="tabler:bell-filled" class="size-4" /></template>
          <template #off><Icon name="tabler:bell" class="size-4" /></template>
        </UIToggle>
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Sizes</h3>
      <div class="flex flex-wrap items-center gap-4">
        <UIToggle v-for="size in sizes" :key="size" :size active-background intent="primary">
          <template #on><Icon name="tabler:star-filled" class="size-full" /></template>
          <template #off><Icon name="tabler:star" class="size-full" /></template>
        </UIToggle>
      </div>
    </section>

    <!-- States -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">States</h3>
      <div class="flex flex-wrap gap-6">
        <div class="flex flex-col gap-1">
          <span class="txt-caption text-neutral-text-subtle">Default (no background)</span>
          <UIToggle>
            <template #on><Icon name="tabler:eye-off" class="size-5" /></template>
            <template #off><Icon name="tabler:eye" class="size-5" /></template>
          </UIToggle>
        </div>
        <div class="flex flex-col gap-1">
          <span class="txt-caption text-neutral-text-subtle">Disabled</span>
          <UIToggle disabled :model-value="true">
            <template #on><Icon name="tabler:lock" class="size-5" /></template>
            <template #off><Icon name="tabler:lock-open" class="size-5" /></template>
          </UIToggle>
        </div>
        <div class="flex flex-col gap-1">
          <span class="txt-caption text-neutral-text-subtle">With Text</span>
          <UIToggle active-background intent="secondary" class="px-3">
            <template #on>Muted</template>
            <template #off>Unmuted</template>
          </UIToggle>
        </div>
      </div>
    </section>

    <!-- Controlled -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Controlled (v-model)</h3>
      <div class="flex items-center gap-3">
        <UIToggle
          v-model="pressed"
          active-background
          intent="accent"
          @pressed-change="(d: boolean) => console.log('pressedChange', d)"
        >
          <template #on><Icon name="tabler:microphone" class="size-5" /></template>
          <template #off><Icon name="tabler:microphone-off" class="size-5" /></template>
        </UIToggle>
        <span class="font-mono text-xs text-neutral-text-subtle">pressed={{ pressed }}</span>
      </div>
    </section>

    <!-- Join group -->
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">Join Group</h3>
      <div class="join">
        <UIToggle class="join-item" active-background>
          <template #on><Icon name="tabler:bold" class="size-4" /></template>
          <template #off><Icon name="tabler:bold" class="size-4" /></template>
        </UIToggle>
        <UIToggle class="join-item" active-background>
          <template #on><Icon name="tabler:italic" class="size-4" /></template>
          <template #off><Icon name="tabler:italic" class="size-4" /></template>
        </UIToggle>
        <UIToggle class="join-item" active-background>
          <template #on><Icon name="tabler:underline" class="size-4" /></template>
          <template #off><Icon name="tabler:underline" class="size-4" /></template>
        </UIToggle>
      </div>
    </section>
  </div>
</template>
