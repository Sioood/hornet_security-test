<script setup lang="ts">
// oxlint-disable no-console
import {
  type DrawerTriggerValueChangeDetails,
  type DrawerOpenChangeDetails,
  type DrawerSnapPointChangeDetails,
  useDrawer,
} from '@ark-ui/vue/drawer'

import UIDrawerIndent from '@/components/Drawer/Indent.vue'
import UIDrawerIndentBackground from '@/components/Drawer/IndentBackground.vue'
import UIDrawerStack from '@/components/Drawer/Stack.vue'

// Controlled state example
const isOpen = ref(false)

// RootProvider mode — external API control
const drawer = useDrawer({
  defaultSnapPoint: 0.5,
  snapPoints: [0.25, 0.5, 1],
  swipeDirection: 'down',
})
</script>

<template>
  <div class="flex flex-col gap-10 p-4">
    <!-- ── Basic ─────────────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Basic</h3>
      <div class="flex flex-wrap gap-2">
        <UIDrawer title="Drawer Title" description="A panel that slides in from the edge.">
          <p class="txt-base text-neutral-text">
            This is the default bottom drawer with full drag support.
          </p>
        </UIDrawer>
      </div>
    </section>

    <!-- ── Intents ────────────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Intents</h3>
      <div class="flex flex-wrap gap-2">
        <UIDrawer intent="neutral" title="Neutral" description="Neutral intent drawer.">
          <template #trigger>
            <UIButton variant="subtle" intent="neutral">Neutral</UIButton>
          </template>
          <p class="txt-base text-neutral-text">Neutral drawer content.</p>
        </UIDrawer>

        <UIDrawer intent="primary" title="Primary" description="Primary intent drawer.">
          <template #trigger>
            <UIButton variant="subtle" intent="primary">Primary</UIButton>
          </template>
          <p class="txt-base text-primary-text">Primary drawer content.</p>
        </UIDrawer>

        <UIDrawer intent="secondary" title="Secondary" description="Secondary intent drawer.">
          <template #trigger>
            <UIButton variant="subtle" intent="secondary">Secondary</UIButton>
          </template>
          <p class="txt-base text-secondary-text">Secondary drawer content.</p>
        </UIDrawer>

        <UIDrawer intent="accent" title="Accent" description="Accent intent drawer.">
          <template #trigger>
            <UIButton variant="subtle" intent="accent">Accent</UIButton>
          </template>
          <p class="txt-base text-accent-text">Accent drawer content.</p>
        </UIDrawer>
      </div>
    </section>

    <!-- ── Swipe direction ────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Swipe Direction</h3>
      <div class="flex flex-wrap gap-2">
        <UIDrawer
          swipe-direction="down"
          title="Bottom Drawer"
          description="Slides in from the bottom (default)."
        >
          <template #trigger>
            <UIButton>↓ Bottom</UIButton>
          </template>
          <p class="txt-base text-neutral-text">Bottom drawer — the default.</p>
        </UIDrawer>

        <UIDrawer swipe-direction="up" title="Top Drawer" description="Slides in from the top.">
          <template #trigger>
            <UIButton>↑ Top</UIButton>
          </template>
          <p class="txt-base text-neutral-text">Top drawer.</p>
        </UIDrawer>

        <UIDrawer
          swipe-direction="start"
          title="Left Drawer"
          description="Slides in from the left."
        >
          <template #trigger>
            <UIButton>← Left</UIButton>
          </template>
          <p class="txt-base text-neutral-text">Left side drawer.</p>
        </UIDrawer>

        <UIDrawer
          swipe-direction="end"
          title="Right Drawer"
          description="Slides in from the right."
        >
          <template #trigger>
            <UIButton>→ Right</UIButton>
          </template>
          <p class="txt-base text-neutral-text">Right side drawer.</p>
        </UIDrawer>
      </div>
    </section>

    <!-- ── Sizes ──────────────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Sizes (bottom drawer)</h3>
      <div class="flex flex-wrap gap-2">
        <UIDrawer size="sm" title="Small" description="50% viewport height.">
          <template #trigger>
            <UIButton size="sm">sm</UIButton>
          </template>
          <p class="txt-base text-neutral-text">Small drawer.</p>
        </UIDrawer>

        <UIDrawer size="md" title="Medium" description="75% viewport height (default).">
          <template #trigger>
            <UIButton size="sm">md</UIButton>
          </template>
          <p class="txt-base text-neutral-text">Medium drawer.</p>
        </UIDrawer>

        <UIDrawer size="lg" title="Large" description="90% viewport height.">
          <template #trigger>
            <UIButton size="sm">lg</UIButton>
          </template>
          <p class="txt-base text-neutral-text">Large drawer.</p>
        </UIDrawer>

        <UIDrawer size="full" title="Full" description="Full viewport height.">
          <template #trigger>
            <UIButton size="sm">full</UIButton>
          </template>
          <p class="txt-base text-neutral-text">Full-height drawer.</p>
        </UIDrawer>
      </div>
    </section>

    <!-- ── Snap Points ────────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Snap Points</h3>
      <UIDrawer
        title="Snap Points"
        description="Drawer with intermediate snap positions at 25%, 50%, and 100%."
        :snap-points="[0.25, 0.5, 1]"
        :default-snap-point="0.5"
        size="full"
      >
        <template #trigger>
          <UIButton>Open with snap points</UIButton>
        </template>
        <p class="txt-base text-neutral-text">
          Drag the handle to snap between 25%, 50%, and 100% of the viewport height.
        </p>
      </UIDrawer>
    </section>

    <!-- ── Controlled ─────────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Controlled (v-model:open)</h3>
      <div class="flex flex-wrap items-center gap-3">
        <UIButton @click="isOpen = true">Open programmatically</UIButton>
        <span class="txt-caption text-neutral-text-subtle">
          Drawer is: <strong>{{ isOpen ? 'open' : 'closed' }}</strong>
        </span>
      </div>
      <UIDrawer
        v-model:open="isOpen"
        title="Controlled Drawer"
        description="State is owned by Vue — opened programmatically."
        :hide-trigger="true"
      >
        <p class="txt-base text-neutral-text">
          This drawer is controlled via
          <code class="txt-caption rounded bg-neutral-fill-subtle px-1">v-model:open</code>. Closing
          it updates the ref automatically.
        </p>
        <template #footer>
          <UIButton @click="isOpen = false">Cancel</UIButton>
          <UIButton intent="primary" @click="isOpen = false">Confirm</UIButton>
        </template>
      </UIDrawer>
    </section>

    <!-- ── Scrollable ─────────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Scrollable</h3>
      <UIDrawer
        title="Scrollable Content"
        description="The body scrolls while the header and footer stay fixed."
        scrollable
        size="md"
      >
        <template #trigger>
          <UIButton>Open scrollable</UIButton>
        </template>
        <div class="flex flex-col gap-2">
          <div
            v-for="i in 20"
            :key="i"
            class="txt-label flex h-12 items-center justify-center rounded-lg border border-neutral-border-subtle bg-neutral-fill-subtle text-neutral-text disabled:pointer-events-none disabled:opacity-40"
          >
            Item {{ i }}
          </div>
        </div>
        <template #footer>
          <UIButton>Cancel</UIButton>
          <UIButton intent="primary">Save</UIButton>
        </template>
      </UIDrawer>
    </section>

    <!-- ── Non-draggable ──────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Non-draggable</h3>
      <UIDrawer
        title="Non-draggable Drawer"
        description="Drag-to-dismiss is disabled. Use the close button or press Escape."
        :draggable="false"
        size="md"
      >
        <template #trigger>
          <UIButton>Open non-draggable</UIButton>
        </template>
        <p class="txt-base text-neutral-text">
          This drawer can only be closed with the × button or the Escape key.
        </p>
      </UIDrawer>
    </section>

    <!-- ── No-drag area ───────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">No-drag Area</h3>
      <UIDrawer
        title="No-drag Area"
        description="The text input below prevents drag from starting."
      >
        <template #trigger>
          <UIButton>Open with no-drag area</UIButton>
        </template>
        <div class="flex flex-col gap-3">
          <p class="txt-base text-neutral-text">
            Dragging the grabber or empty areas dismisses the drawer. The input below uses
            <code class="txt-caption rounded bg-neutral-fill-subtle px-1">data-no-drag</code>
            to opt out.
          </p>
          <!-- data-no-drag prevents Ark from starting a drag gesture on this element -->
          <input
            data-no-drag
            type="text"
            placeholder="Type here — drag won't start inside"
            class="txt-base w-full rounded-md border border-neutral-border bg-neutral-surface px-3 py-2 text-neutral-text outline-none focus:border-primary-border focus:ring-1 focus:ring-primary-border"
          />
        </div>
      </UIDrawer>
    </section>

    <!-- ── Multiple triggers ──────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Multiple Triggers</h3>
      <UIDrawer
        title="Multiple Triggers"
        description="Different triggers open the same drawer with different context."
        size="md"
        @trigger-value-change="
          (d: DrawerTriggerValueChangeDetails) => console.log('triggerValueChange', d)
        "
      >
        <template #triggers="{ trigger: Trigger, drawer: drawerContext }">
          <div class="flex flex-wrap gap-2">
            <component :is="Trigger" value="details" as-child>
              <UIButton>View Details</UIButton>
            </component>
            <component :is="Trigger" value="settings" as-child>
              <UIButton>Settings</UIButton>
            </component>
            <component :is="Trigger" value="help" as-child>
              <UIButton variant="subtle">Help</UIButton>
            </component>
          </div>
          <p v-if="drawerContext.triggerValue" class="txt-caption mt-1 text-neutral-text-subtle">
            Active trigger: <strong>{{ drawerContext.triggerValue }}</strong>
          </p>
        </template>
        <template #default="{ drawer: drawerContext }">
          <div class="flex flex-col gap-2">
            <p class="txt-base text-neutral-text">
              Opened via: <strong>{{ drawerContext.triggerValue ?? 'unknown' }}</strong>
            </p>
          </div>
        </template>
      </UIDrawer>
    </section>

    <!-- ── Non-modal ──────────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Non-modal</h3>
      <UIDrawer
        title="Non-modal Drawer"
        description="The rest of the page stays interactive while this drawer is open."
        :modal="false"
        size="sm"
      >
        <template #trigger>
          <UIButton>Open non-modal</UIButton>
        </template>
        <p class="txt-base text-neutral-text">
          You can still interact with the page behind this drawer.
        </p>
      </UIDrawer>
    </section>

    <!-- ── Indent + stack (requires UIDrawerStack) ─────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Indent + indent background</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Uses <code class="rounded bg-neutral-fill-subtle px-1">UIDrawerStack</code>,
        <code class="rounded bg-neutral-fill-subtle px-1">UIDrawerIndentBackground</code>, and
        <code class="rounded bg-neutral-fill-subtle px-1">UIDrawerIndent</code> — Ark requires stack
        context for indent visuals.
      </p>
      <UIDrawerStack>
        <UIDrawerIndentBackground />
        <UIDrawerIndent>
          <UIDrawer
            title="Stacked drawer"
            description="Page content indents and a background overlay fades in while swiping."
            size="md"
          >
            <template #trigger>
              <UIButton>Open stacked drawer</UIButton>
            </template>
            <p class="txt-base text-neutral-text">
              Swipe the grabber to see the indent effect on the page behind this panel.
            </p>
          </UIDrawer>
        </UIDrawerIndent>
      </UIDrawerStack>
    </section>

    <!-- ── RootProvider mode ──────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">RootProvider mode</h3>
      <div class="flex flex-wrap gap-2">
        <UIButton @click="drawer.setOpen(true)">Open via API</UIButton>
        <UIButton @click="drawer.setSnapPoint(0.25)">Snap to 25%</UIButton>
        <UIButton @click="drawer.setSnapPoint(0.5)">Snap to 50%</UIButton>
        <UIButton @click="drawer.setSnapPoint(1)">Snap to 100%</UIButton>
      </div>

      <UIDrawer :value="drawer" title="RootProvider Drawer" size="full">
        <template #default="{ drawer: ctx }">
          <div class="flex flex-col gap-3">
            <p class="txt-base text-neutral-text">
              Controlled externally via
              <code class="txt-caption rounded bg-neutral-fill-subtle px-1">useDrawer()</code>.
            </p>
            <p class="txt-caption text-neutral-text-subtle">
              Active snap point: <strong>{{ ctx.snapPoint }}</strong>
            </p>
            <div class="flex gap-2">
              <UIButton size="sm" @click="ctx.setSnapPoint(0.25)">25%</UIButton>
              <UIButton size="sm" @click="ctx.setSnapPoint(0.5)">50%</UIButton>
              <UIButton size="sm" @click="ctx.setSnapPoint(1)">100%</UIButton>
            </div>
          </div>
        </template>
      </UIDrawer>
    </section>

    <!-- ── Emit forwarding ────────────────────────────────────────────────── -->
    <section class="flex flex-col gap-2">
      <h3 class="txt-h5 text-neutral-text">Emit forwarding</h3>
      <UIDrawer
        title="Event listeners"
        description="All Ark events are forwarded through $attrs."
        @open-change="(d: DrawerOpenChangeDetails) => console.log('openChange', d)"
        @snap-point-change="(d: DrawerSnapPointChangeDetails) => console.log('snapPointChange', d)"
      >
        <template #trigger>
          <UIButton>Open (check console)</UIButton>
        </template>
        <p class="txt-base text-neutral-text">Open the browser console to see events.</p>
      </UIDrawer>
    </section>
  </div>
</template>
