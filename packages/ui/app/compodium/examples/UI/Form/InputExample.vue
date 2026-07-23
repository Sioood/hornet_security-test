<script setup lang="ts">
// oxlint-disable no-console
import { controlShellCVA } from '~/utils/Components/Form/variants'

// ── Basic ──────────────────────────────────────────────────────────────────
const basicValue = ref('')

// ── With .com suffix ───────────────────────────────────────────────────────
const domainValue = ref('mywebsite')

// ── With https:// prefix ───────────────────────────────────────────────────
const urlValue = ref('example.com')

// ── With both prefix and suffix ────────────────────────────────────────────
const fullUrlValue = ref('example')

// ── With button addon ──────────────────────────────────────────────────────
const emailValue = ref('hello@example.com')

// ── Phone input ─────────────────────────────────────────────────────────────
const phoneValue = ref('')

const countryItems = [
  { label: '+46 Sweden', value: '+46' },
  { label: '+1 US', value: '+1' },
  { label: '+44 UK', value: '+44' },
  { label: '+33 France', value: '+33' },
  { label: '+49 Germany', value: '+49' },
]

// ── With inner leading indicator ───────────────────────────────────────────
const priceValue = ref('')

// ── With inner trailing indicator ──────────────────────────────────────────
const weightValue = ref('')

// ── Password ───────────────────────────────────────────────────────────────
const passwordValue = ref('')

// ─ With clear button ──────────────────────────────────────────────────────
const searchableValue = ref('searchable input')

// ── With leading icon ──────────────────────────────────────────────────────
const iconLeadingValue = ref('')

// ── With trailing icon ─────────────────────────────────────────────────────
const iconTrailingValue = ref('')

// ── Intents ────────────────────────────────────────────────────────────────
const intentValue = ref('')

// ── Sizes ──────────────────────────────────────────────────────────────────
const sizeValue = ref('')

// ── States ─────────────────────────────────────────────────────────────────
const disabledValue = ref('disabled')
const readOnlyValue = ref('read-only')
const invalidValue = ref('')

// ── Addon helper classes ───────────────────────────────────────────────────
const addonBase = cn(
  controlShellCVA({ disabled: false, intent: 'primary', invalid: false, size: 'md' }),
  'txt-label flex w-auto shrink-0 items-center border-0 text-neutral-text-subtle',
)
const addonLeading = cn(addonBase, 'rounded-r-none')
const addonTrailing = cn(addonBase, 'rounded-l-none')
</script>

<template>
  <div class="mx-auto flex max-w-xl flex-col gap-8 p-6">
    <h1 class="text-2xl font-bold">UIFormInput Examples</h1>

    <!-- Basic -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Basic</p>
      <UIFormInput v-model="basicValue" label="Name" placeholder="Enter your name" />
      <p class="txt-caption text-neutral-text-subtle">Value: {{ basicValue || '(empty)' }}</p>
    </section>

    <!-- With .com suffix (trailing addon) -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">With suffix addon</p>
      <UIFormInput v-model="domainValue" label="Domain">
        <template #trailing>
          <span :class="cn(addonTrailing, 'border border-l-0 px-3')">.com</span>
        </template>
      </UIFormInput>
      <p class="txt-caption text-neutral-text-subtle">Value: {{ domainValue }}.com</p>
    </section>

    <!-- With https:// prefix (leading addon) -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">With prefix addon</p>
      <UIFormInput v-model="urlValue" label="Website">
        <template #leading>
          <span :class="cn(addonLeading, 'border border-r-0 px-3')">https://</span>
        </template>
      </UIFormInput>
      <p class="txt-caption text-neutral-text-subtle">Value: https://{{ urlValue }}</p>
    </section>

    <!-- With both prefix and suffix -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">With prefix and suffix</p>
      <UIFormInput v-model="fullUrlValue" label="URL">
        <template #leading>
          <span :class="cn(addonLeading, 'border border-r-0 px-3')">https://</span>
        </template>
        <template #trailing>
          <span :class="cn(addonTrailing, 'border border-l-0 px-3')">.com</span>
        </template>
      </UIFormInput>
      <p class="txt-caption text-neutral-text-subtle">Value: https://{{ fullUrlValue }}.com</p>
    </section>

    <!-- With button addon -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">With button addon</p>
      <UIFormInput v-model="emailValue" label="Email" type="email">
        <template #trailing>
          <span :class="addonTrailing">
            <UIButton variant="subtle" intent="primary" text="Subscribe" />
          </span>
        </template>
      </UIFormInput>
    </section>

    <!-- Phone input with country code -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Phone with country code</p>
      <UIFormPhoneInput
        v-model="phoneValue"
        label="Phone"
        placeholder="0701234567"
        :items="countryItems"
        required
      />
      <p class="txt-caption text-neutral-text-subtle">Value: {{ phoneValue || '(empty)' }}</p>
    </section>

    <!-- With inner leading indicator ($) -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">With inner leading indicator</p>
      <UIFormInput v-model="priceValue" label="Price" type="number">
        <template #inner-leading>
          <span class="txt-label text-neutral-text-subtle">$</span>
        </template>
      </UIFormInput>
    </section>

    <!-- With inner trailing indicator (%) -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">With inner trailing indicator</p>
      <UIFormInput v-model="weightValue" label="Progress" type="number">
        <template #inner-trailing>
          <span class="txt-label text-neutral-text-subtle">%</span>
        </template>
      </UIFormInput>
    </section>

    <!-- Password -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Password</p>
      <UIFormInput
        v-model="passwordValue"
        type="password"
        label="Password"
        placeholder="Enter password"
      />
    </section>

    <!-- With clear button -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">With clear button</p>
      <UIFormInput v-model="searchableValue" label="Search" clearable />
    </section>

    <!-- With leading icon -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">With leading icon</p>
      <UIFormInput
        v-model="iconLeadingValue"
        label="Username"
        placeholder="Enter username"
        leading
        leading-icon="tabler:user"
      />
    </section>

    <!-- With trailing icon -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">With trailing icon</p>
      <UIFormInput
        v-model="iconTrailingValue"
        label="Website"
        placeholder="example.com"
        trailing
        trailing-icon="tabler:world"
      />
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Intents</p>
      <div class="grid grid-cols-2 gap-3">
        <UIFormInput
          v-for="intent in ['neutral', 'primary', 'secondary', 'accent'] as const"
          :key="intent"
          v-model="intentValue"
          :label="intent"
          :intent
          placeholder="Placeholder"
          size="sm"
        />
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">Sizes</p>
      <UIFormInput
        v-for="size in ['sm', 'md', 'lg'] as const"
        :key="size"
        v-model="sizeValue"
        :label="`Size: ${size}`"
        :size
        placeholder="Placeholder"
      />
    </section>

    <!-- States -->
    <section class="flex flex-col gap-2">
      <p class="txt-label text-neutral-text">States</p>
      <UIFormInput v-model="disabledValue" label="Disabled" disabled />
      <UIFormInput v-model="readOnlyValue" label="Read-only" read-only />
      <UIFormInput
        v-model="invalidValue"
        label="Invalid"
        invalid
        error="This field is required"
        placeholder="Enter value"
      />
    </section>
  </div>
</template>
