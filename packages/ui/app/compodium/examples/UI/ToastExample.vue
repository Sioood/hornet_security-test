<script setup lang="ts">
// oxlint-disable no-console
import { useToast } from '@/composables/useToast'

const toaster = useToast()

const showPromiseToast = () => {
  toaster.value?.promise(
    new Promise<string>((resolve, reject) =>
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve('Process finished successfully!')
        } else {
          reject(new Error('Network error occurred'))
        }
      }, 2000),
    ),
    {
      error: { description: 'Could not connect to the server.', title: 'Upload Failed' },
      loading: { description: 'Please wait while we process your request.', title: 'Uploading...' },
      success: { description: 'Your file has been saved.', title: 'Upload Complete' },
    },
  )
}

const showActionToast = () => {
  toaster.value?.create({
    action: {
      label: 'View Logs',
      onClick: () => {
        console.log('Viewing logs...')
      },
    },
    description: 'Your changes are being deployed to production.',
    title: 'Deployment Started',
    type: 'info',
  })
}
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-10 p-6">
    <section class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Standard Notifications</h3>
      <div
        class="flex flex-wrap gap-3 rounded-xl border border-neutral-border-subtle bg-neutral-fill-subtle/10 p-6 disabled:pointer-events-none disabled:opacity-40"
      >
        <UIButton
          v-for="type in ['info', 'success', 'warning', 'error'] as const"
          :key="type"
          :intent="type"
          variant="subtle"
          class="min-w-[120px] capitalize"
          @click="
            toaster?.[type]({
              title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
              description: `System message for ${type} level.`,
              closable: true,
            })
          "
        >
          <Icon
            :name="
              type === 'info'
                ? 'tabler:info-circle'
                : type === 'success'
                  ? 'tabler:check'
                  : type === 'warning'
                    ? 'tabler:alert-triangle'
                    : 'tabler:alert-circle'
            "
            class="mr-2"
          />
          {{ type }}
        </UIButton>
      </div>
    </section>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <section class="flex flex-col gap-4">
        <h3 class="text-xl font-bold">Promise Tracking</h3>
        <p class="text-sm text-neutral-text-subtle">
          Automatically handles loading, success, and error states.
        </p>
        <UIButton intent="primary" variant="solid" class="w-full py-6" @click="showPromiseToast">
          <Icon name="tabler:upload" class="mr-2" />
          Start Upload Simulation
        </UIButton>
      </section>

      <section class="flex flex-col gap-4">
        <h3 class="text-xl font-bold">Interactive Actions</h3>
        <p class="text-sm text-neutral-text-subtle">Toasts that require user interaction.</p>
        <UIButton intent="secondary" variant="solid" class="w-full py-6" @click="showActionToast">
          <Icon name="tabler:rocket" class="mr-2" />
          Trigger Action Toast
        </UIButton>
      </section>
    </div>

    <UIToast v-if="toaster" />
  </div>
</template>
