<script setup lang="ts">
// ── Basic ──────────────────────────────────────────────────────────────────
const basicValue = ref<string>('')

// ── Controlled (v-model) ───────────────────────────────────────────────────
const controlledValue = ref<string>('This is a controlled textarea.\nIt supports multiple lines.')

// ── Autoresize ─────────────────────────────────────────────────────────────
const autoresizeValue = ref<string>(
  'This textarea will automatically grow as you type more content.\nTry adding more lines…',
)

// ── Max length ─────────────────────────────────────────────────────────────
const maxLengthValue = ref<string>('')

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
    <h1 class="text-2xl font-bold">UIFormTextarea Examples</h1>

    <!-- Basic -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Basic</h2>
      <UIFormTextarea
        v-model="basicValue"
        label="Bio"
        placeholder="Tell us about yourself…"
        @blur="(e: FocusEvent) => logEvent('blur', (e.target as HTMLTextAreaElement)?.value)"
      />
      <p class="txt-caption text-neutral-text-subtle">Value: {{ basicValue || '(empty)' }}</p>
    </section>

    <!-- Controlled (v-model) -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Controlled (v-model)</h2>
      <UIFormTextarea v-model="controlledValue" label="Comments" />
      <p class="txt-caption text-neutral-text-subtle">Characters: {{ controlledValue.length }}</p>
      <div class="flex gap-2">
        <UIButton variant="ghost" size="sm" @click="controlledValue = ''">Clear</UIButton>
        <UIButton variant="ghost" size="sm" @click="controlledValue = 'Hello\nWorld'">
          Set "Hello\nWorld"
        </UIButton>
      </div>
    </section>

    <!-- Autoresize -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Autoresize</h2>
      <UIFormTextarea
        v-model="autoresizeValue"
        label="Autoresize"
        autoresize
        placeholder="This textarea grows as you type…"
      />
      <UIFormTextarea
        label="Autoresize with rows=2"
        autoresize
        :rows="2"
        placeholder="Starts at 2 rows, then grows…"
      />
    </section>

    <!-- Max length -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Max Length &amp; Character Count</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use the native <code>maxlength</code> attribute to limit input, combined with a live
        character counter.
      </p>
      <UIFormTextarea
        v-model="maxLengthValue"
        label="Short bio"
        placeholder="Write a short bio (max 140 chars)…"
        maxlength="140"
        helper-text="Max 140 characters"
        autoresize
        :rows="2"
      />
      <p class="txt-caption text-neutral-text-subtle">
        {{ maxLengthValue.length }} / 140 characters
      </p>
    </section>

    <!-- With icons -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">With Icons</h2>
      <UIFormTextarea
        label="Leading & Trailing"
        placeholder="Icons on both sides…"
        leading
        leading-icon="tabler:message"
        trailing
        trailing-icon="tabler:pencil"
      />
    </section>

    <!-- Intent -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Intents</h2>
      <div class="grid grid-cols-2 gap-4">
        <UIFormTextarea
          v-for="intent in ['neutral', 'primary', 'secondary', 'accent'] as const"
          :key="intent"
          :label="intent"
          :intent
          :placeholder="`${intent} textarea`"
          size="sm"
        />
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Sizes</h2>
      <UIFormTextarea
        v-for="size in ['sm', 'md', 'lg'] as const"
        :key="size"
        :label="`Size: ${size}`"
        :size
        :placeholder="`${size} textarea`"
      />
    </section>

    <!-- States -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">States</h2>
      <UIFormTextarea
        label="Disabled"
        disabled
        placeholder="This textarea is disabled"
        model-value="You cannot edit this"
      />
      <UIFormTextarea
        label="Read-only"
        read-only
        placeholder="This textarea is read-only"
        model-value="You cannot change this content"
      />
      <UIFormTextarea
        label="Invalid"
        invalid
        error="Please provide a description"
        placeholder="This field is required"
      />
      <UIFormTextarea label="Required" required placeholder="This field is required" />
    </section>

    <!-- With helper text -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Helper text &amp; Character count</h2>
      <UIFormTextarea
        label="Description"
        helper-text="Max 500 characters"
        placeholder="Write a description…"
      />
    </section>

    <!-- Event Log -->
    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Event Log</h2>
      <div class="max-h-40 overflow-y-auto rounded-md bg-neutral-fill-subtle p-3 font-mono text-xs">
        <div v-for="(entry, i) in eventLog" :key="i" class="py-0.5 text-neutral-text-subtle">
          {{ entry }}
        </div>
        <div v-if="eventLog.length === 0" class="text-neutral-text-subtle italic">
          Interact with a textarea to see events…
        </div>
      </div>
    </section>
  </div>
</template>
