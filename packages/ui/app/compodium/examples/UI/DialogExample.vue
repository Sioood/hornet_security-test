<script setup lang="ts">
// oxlint-disable no-console
import {
  useDialog,
  type DialogOpenChangeDetails,
  type DialogTriggerValueChangeDetails,
} from '@ark-ui/vue/dialog'

import type { UIButtonExpose } from '@/components/Button.vue'
import type { UIFormInputExpose } from '@/components/Form/Input.vue'

// ── Controlled ────────────────────────────────────────────────
const controlledOpen = ref(false)

// ── Initial / Final focus ─────────────────────────────────────
const initialSearchInputRef = ref<UIFormInputExpose | null>(null)
const searchQuery = ref('')
const finalFocusButtonRef = ref<UIButtonExpose | null>(null)

// ── Multiple triggers ─────────────────────────────────────────
const activeTrigger = ref<string | null>(null)
const productContent: Record<string, { name: string; price: string; desc: string }> = {
  jacket: { desc: 'Waterproof shell for alpine conditions.', name: 'Shell Jacket', price: '$240' },
  pack: { desc: '30L daypack with hydration sleeve.', name: 'Summit Pack', price: '$180' },
  shoes: { desc: 'Lightweight trail running shoes.', name: 'Trail Runners', price: '$120' },
}

// ── Confirmation ──────────────────────────────────────────────
const editOpen = ref(false)
const confirmOpen = ref(false)
const editName = ref('')
const editDirty = ref(false)

function tryCloseEdit() {
  if (editDirty.value) {
    confirmOpen.value = true
  } else {
    editOpen.value = false
  }
}

function discardEdit() {
  editDirty.value = false
  editName.value = ''
  confirmOpen.value = false
  editOpen.value = false
}

function saveEdit() {
  editDirty.value = false
  editOpen.value = false
}

// ── RootProvider ──────────────────────────────────────────────
const externalDialog = useDialog({ defaultOpen: false })
</script>

<template>
  <div class="flex flex-col gap-12 p-6">
    <!-- ── BASIC ──────────────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Basic</h3>
      <div class="flex flex-wrap gap-3">
        <UIDialog
          title="Welcome"
          description="This is the default dialog with title and description."
          @open-change="(d: DialogOpenChangeDetails) => console.log('openChange', d)"
        >
          <template #default>
            <p class="txt-base text-neutral-text">
              Dialog content goes here. You can place any elements inside the default slot.
            </p>
          </template>
          <template #footer>
            <UIButton variant="subtle" intent="neutral">Cancel</UIButton>
            <UIButton intent="primary">Confirm</UIButton>
          </template>
        </UIDialog>

        <UIDialog
          title="No Close Button"
          description="showCloseTrigger set to false."
          :show-close-trigger="false"
        >
          <template #default>
            <p class="txt-base text-neutral-text">Use the footer buttons to dismiss.</p>
          </template>
          <template #trigger>
            <UIButton variant="subtle" intent="neutral">No × Button</UIButton>
          </template>
          <template #footer="{ dialog }">
            <UIButton intent="primary" @click="dialog.setOpen(false)">Got it</UIButton>
          </template>
        </UIDialog>
      </div>
    </section>

    <!-- ── INTENTS ────────────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Intents</h3>
      <div class="flex flex-wrap gap-3">
        <UIDialog
          v-for="intent in ['neutral', 'primary', 'secondary', 'accent'] as const"
          :key="intent"
          :intent
          :title="`${intent.charAt(0).toUpperCase() + intent.slice(1)} Dialog`"
          :description="`This dialog uses the '${intent}' intent.`"
        >
          <template #trigger>
            <UIButton :intent variant="subtle">{{ intent }}</UIButton>
          </template>
          <template #default>
            <p class="txt-base text-neutral-text">Intent controls the header color scheme.</p>
          </template>
          <template #footer>
            <UIButton :intent>Close</UIButton>
          </template>
        </UIDialog>
      </div>
    </section>

    <!-- ── SIZES ──────────────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Sizes</h3>
      <div class="flex flex-wrap gap-3">
        <UIDialog
          v-for="size in ['sm', 'md', 'lg', 'full'] as const"
          :key="size"
          :size
          :title="`Size: ${size}`"
          description="Dialog width controlled by the size prop."
        >
          <template #trigger>
            <UIButton variant="subtle" intent="neutral">{{ size }}</UIButton>
          </template>
          <template #default>
            <p class="txt-base text-neutral-text">
              Max width is constrained to
              <code class="txt-caption bg-neutral-fill-subtle px-1">{{ size }} </code>.
            </p>
          </template>
        </UIDialog>
      </div>
    </section>

    <!-- ── ALERT DIALOG ────────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Alert Dialog</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Use <code>role="alertdialog"</code>. Focus moves to the first focusable element (the Cancel
        button). Cannot be closed by clicking outside.
      </p>
      <UIDialog
        role="alertdialog"
        title="Delete Account"
        description="This action is permanent and cannot be undone."
        intent="accent"
        :close-on-interact-outside="false"
      >
        <template #trigger>
          <UIButton intent="accent" variant="subtle">Delete Account</UIButton>
        </template>
        <template #default>
          <p class="txt-base text-neutral-text">
            All your data will be permanently removed. You will lose access immediately.
          </p>
        </template>
        <template #footer="{ dialog }">
          <UIButton variant="subtle" intent="neutral" @click="dialog.setOpen(false)">
            Cancel
          </UIButton>
          <UIButton intent="accent" @click="dialog.setOpen(false)">Delete Forever</UIButton>
        </template>
      </UIDialog>
    </section>

    <!-- ── LAZY MOUNT ──────────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Lazy Mount</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Content renders only when first opened (<code>lazyMount</code>) and unmounts when closed
        (<code>unmountOnExit</code>). Both are enabled by default in this component.
      </p>
      <UIDialog
        title="Lazy Mounted"
        description="This content was not in the DOM until you clicked Open."
        :lazy-mount="true"
        :unmount-on-exit="true"
      >
        <template #default>
          <p class="txt-base text-neutral-text">
            Check the DOM — this element is removed after closing.
          </p>
        </template>
      </UIDialog>
    </section>

    <!-- ── INITIAL FOCUS ───────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Initial Focus</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Pass <code>:initial-focus-el="() => inputRef?.getControlElement() ?? undefined"</code> on a
        <code>UIFormInput</code> ref so the real <code>&lt;input&gt;</code> receives focus when the
        dialog opens.
      </p>
      <UIDialog
        title="Search"
        :initial-focus-el="() => initialSearchInputRef?.getControlElement() ?? null"
        description="The search input receives focus on open."
      >
        <template #default>
          <UIFormInput
            id="dialog-example-search"
            ref="initialSearchInputRef"
            v-model="searchQuery"
            label="Search query"
            placeholder="Type to search…"
          />
        </template>
      </UIDialog>
    </section>

    <!-- ── FINAL FOCUS ─────────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Final Focus</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Pass <code>:final-focus-el="() => buttonRef?.getControlElement()"</code> so focus moves to a
        specific element when the dialog closes (instead of the trigger).
      </p>
      <div class="flex items-center gap-3">
        <UIDialog
          title="Final Focus"
          :final-focus-el="() => finalFocusButtonRef?.getControlElement() ?? null"
          description="After closing, focus moves to the accent button."
        >
          <template #default>
            <p class="txt-base text-neutral-text">Close this dialog to see focus shift.</p>
          </template>
        </UIDialog>
        <UIButton ref="finalFocusButtonRef" type="button" intent="accent" variant="default">
          Focus returns here
        </UIButton>
      </div>
    </section>

    <!-- ── NON-MODAL ────────────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Non-Modal</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Set <code>:modal="false"</code> to allow interaction outside the dialog. Focus is NOT
        trapped and scroll is NOT prevented.
      </p>
      <UIDialog
        title="Non-Modal Panel"
        description="You can still interact with the page behind."
        :modal="false"
        size="sm"
      >
        <template #default>
          <p class="txt-base text-neutral-text">
            Click anywhere outside — the page remains interactive.
          </p>
        </template>
      </UIDialog>
    </section>

    <!-- ── SCROLL: INSIDE ──────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Scroll: Inside</h3>
      <p class="txt-caption text-neutral-text-subtle">
        <code>scrollBehavior="inside"</code> — dialog has a max-height and its body area scrolls.
        Header and footer stay fixed.
      </p>
      <UIDialog
        title="Terms of Service"
        description="Please read before accepting."
        scroll-behavior="inside"
      >
        <template #default>
          <div class="flex flex-col gap-2">
            <p v-for="i in 20" :key="i" class="txt-base text-neutral-text">
              Section {{ i }} — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              vehicula nisi at purus hendrerit, in mollis enim facilisis.
            </p>
          </div>
        </template>
        <template #footer="{ dialog }">
          <UIButton variant="subtle" intent="neutral" @click="dialog.setOpen(false)">
            Decline
          </UIButton>
          <UIButton intent="secondary" @click="dialog.setOpen(false)">Accept</UIButton>
        </template>
      </UIDialog>
    </section>

    <!-- ── SCROLL: OUTSIDE ─────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Scroll: Outside</h3>
      <p class="txt-caption text-neutral-text-subtle">
        <code>scrollBehavior="outside"</code> — the positioner scrolls so the dialog can extend
        beyond the viewport.
      </p>
      <UIDialog
        title="Long Form"
        description="Dialog can grow taller than the viewport."
        scroll-behavior="outside"
      >
        <template #default>
          <div class="flex flex-col gap-3">
            <div v-for="i in 15" :key="i" class="flex flex-col gap-1">
              <label :for="`field-${i}`" class="txt-label text-neutral-text"> Field {{ i }} </label>
              <input
                :id="`field-${i}`"
                class="txt-base border border-neutral-border bg-neutral-surface p-2 text-neutral-text outline-none"
              />
            </div>
          </div>
        </template>
        <template #footer="{ dialog }">
          <UIButton variant="subtle" intent="neutral" @click="dialog.setOpen(false)">
            Cancel
          </UIButton>
          <UIButton intent="primary" @click="dialog.setOpen(false)">Submit</UIButton>
        </template>
      </UIDialog>
    </section>

    <!-- ── MULTIPLE TRIGGERS ───────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Multiple Triggers</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Each <code>Dialog.Trigger</code> carries a <code>value</code>. Use
        <code>@trigger-value-change</code> to update dialog content based on which was clicked.
      </p>
      <UIDialog
        title="Product Details"
        :trigger-value="activeTrigger"
        @trigger-value-change="(d: DialogTriggerValueChangeDetails) => (activeTrigger = d.value)"
      >
        <template #triggers="{ trigger: Trigger }">
          <div class="flex flex-wrap gap-2">
            <component
              :is="Trigger"
              v-for="key in ['shoes', 'jacket', 'pack']"
              :key="key"
              :value="key"
              as-child
            >
              <UIButton variant="subtle" intent="neutral" class="capitalize">{{ key }}</UIButton>
            </component>
          </div>
        </template>
        <template #default>
          <div v-if="activeTrigger" class="flex flex-col gap-2">
            <template v-if="productContent[activeTrigger]">
              <p class="txt-h5 text-neutral-text">
                {{ productContent[activeTrigger]!.name }}
              </p>
              <p class="txt-label text-primary-text">
                {{ productContent[activeTrigger]!.price }}
              </p>
              <p class="txt-base text-neutral-text">
                {{ productContent[activeTrigger]!.desc }}
              </p>
            </template>
          </div>
        </template>
      </UIDialog>
    </section>

    <!-- ── CONTROLLED ──────────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Controlled (v-model:open)</h3>
      <div class="flex flex-wrap gap-3">
        <UIButton size="sm" variant="subtle" @click="controlledOpen = true">Open</UIButton>
        <UIButton size="sm" variant="subtle" @click="controlledOpen = false">Close</UIButton>
      </div>
      <p class="txt-caption font-mono text-neutral-text-subtle">open={{ controlledOpen }}</p>
      <UIDialog
        v-model:open="controlledOpen"
        title="Controlled Dialog"
        description="State is managed by the parent via v-model:open."
        :hide-trigger="true"
      >
        <template #default>
          <p class="txt-base text-neutral-text">
            Use the buttons above to open and close this dialog programmatically.
          </p>
        </template>
        <template #footer>
          <UIButton intent="primary" @click="controlledOpen = false">Close</UIButton>
        </template>
      </UIDialog>
    </section>

    <!-- ── NESTED DIALOGS ──────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Nested Dialogs</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Opening an inner dialog adds <code>data-has-nested</code> to the parent content. The parent
        scales down slightly via CSS.
      </p>
      <UIDialog title="Outer Dialog" description="Open the inner dialog from here.">
        <template #default>
          <p class="txt-base mb-4 text-neutral-text">This is the outer dialog's content.</p>
          <!-- Inner dialog rendered inside outer dialog content -->
          <UIDialog
            title="Inner Dialog"
            description="You are two levels deep."
            size="sm"
            intent="primary"
          >
            <template #default>
              <p class="txt-base text-neutral-text">
                The outer dialog scaled down when this opened.
              </p>
            </template>
            <template #footer="{ dialog }">
              <UIButton intent="primary" @click="dialog.setOpen(false)">Close Inner</UIButton>
            </template>
          </UIDialog>
        </template>
        <template #footer="{ dialog }">
          <UIButton intent="neutral" variant="subtle" @click="dialog.setOpen(false)">
            Close Outer
          </UIButton>
        </template>
      </UIDialog>
    </section>

    <!-- ── CONFIRMATION ────────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">Confirmation (Unsaved Changes)</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Intercepts close attempts when there are unsaved changes.
        <code>closeOnInteractOutside</code> is disabled; Escape is overridden.
      </p>

      <!-- Main edit dialog -->
      <UIDialog
        v-model:open="editOpen"
        title="Edit Profile"
        description="Make changes to your profile."
        :close-on-interact-outside="false"
        @escape-key-down="
          (e: KeyboardEvent) => {
            if (editDirty) {
              e.preventDefault()
              tryCloseEdit()
            }
          }
        "
      >
        <template #trigger>
          <UIButton intent="primary">Edit Profile</UIButton>
        </template>
        <template #default>
          <div class="flex flex-col gap-2">
            <label for="edit-name" class="txt-label text-neutral-text">Name</label>
            <input
              id="edit-name"
              v-model="editName"
              class="txt-base border border-neutral-border bg-neutral-surface p-2 text-neutral-text outline-none focus:border-primary-border"
              placeholder="Enter your name…"
              @input="editDirty = true"
            />
            <p v-if="editDirty" class="txt-caption text-accent-text">You have unsaved changes.</p>
          </div>
        </template>
        <template #footer>
          <UIButton variant="subtle" intent="neutral" @click="tryCloseEdit">Cancel</UIButton>
          <UIButton intent="primary" @click="saveEdit">Save</UIButton>
        </template>
      </UIDialog>

      <!-- Confirmation prompt (alert dialog, no trigger in DOM) -->
      <!-- POSITION IS IMPORTANT, CONFIRMATION DIALOG SHOULD BE AFTER THE EDIT DIALOG -->
      <UIDialog
        v-model:open="confirmOpen"
        role="alertdialog"
        title="Discard Changes?"
        description="You have unsaved changes. They will be lost if you close now."
        intent="accent"
        :show-close-trigger="false"
        :close-on-interact-outside="false"
        :hide-trigger="true"
      >
        <template #default>
          <p class="txt-base text-neutral-text">This action cannot be undone.</p>
        </template>
        <template #footer>
          <UIButton variant="subtle" intent="neutral" @click="confirmOpen = false">
            Keep Editing
          </UIButton>
          <UIButton intent="accent" @click="discardEdit">Discard</UIButton>
        </template>
      </UIDialog>
    </section>

    <!-- ── ROOT PROVIDER ───────────────────────────────────────── -->
    <section class="flex flex-col gap-3">
      <h3 class="txt-h4 text-neutral-text">RootProvider Mode</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Created via <code>useDialog()</code>. Call <code>externalDialog.value.setOpen(true)</code>
        from anywhere to open programmatically.
      </p>
      <div class="flex flex-wrap gap-2">
        <UIButton size="sm" variant="subtle" @click="externalDialog.setOpen(true)">Open</UIButton>
        <UIButton size="sm" variant="subtle" @click="externalDialog.setOpen(false)">Close</UIButton>
      </div>
      <UIDialog
        :value="externalDialog"
        title="RootProvider Dialog"
        description="Controlled entirely from outside via useDialog()."
        intent="secondary"
        :hide-trigger="true"
      >
        <template #default>
          <p class="txt-base text-neutral-text">
            This dialog has no trigger element — it's opened by the buttons above.
          </p>
        </template>
        <template #footer="{ dialog }">
          <UIButton intent="secondary" @click="dialog.setOpen(false)">Close</UIButton>
        </template>
      </UIDialog>
    </section>
  </div>
</template>
