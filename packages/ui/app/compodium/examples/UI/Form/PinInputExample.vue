<script setup lang="ts">
// oxlint-disable no-console
import {
  usePinInput,
  type PinInputValueChangeDetails,
  type PinInputValueInvalidDetails,
} from '@ark-ui/vue/pin-input'

const code = ref<string>('')
const completeCode = ref<string>('')

const maskedCode = ref<string>('')
const otpCode = ref<string>('')

const types = ['alphanumeric', 'numeric', 'alphabetic'] as const
const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const

const externalApi = usePinInput({
  count: 4,
  type: 'numeric',
})

function onValueChange(d: PinInputValueChangeDetails) {
  console.log('valueChange:', d.valueAsString, d.value)
}

function onValueComplete(d: PinInputValueChangeDetails) {
  completeCode.value = d.valueAsString
  console.log('valueComplete:', d.valueAsString)
}

function onValueInvalid(d: PinInputValueInvalidDetails) {
  console.log('valueInvalid:', d)
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Basic -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Basic</h2>
        <p class="text-sm text-neutral-text-subtle">
          Default 5-digit numeric input. Type to fill each slot.
        </p>
      </div>
      <UIFormPinInput
        v-model="code"
        label="Verification code"
        helper-text="Enter the 5-digit code"
        @value-change="onValueChange"
      />
      <p class="font-mono text-xs text-neutral-text-subtle">Value: {{ code || '(empty)' }}</p>
    </section>

    <!-- v-model controlled -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled (v-model)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Fully controlled via <code>v-model</code>. External buttons set the value.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="code = '12345'">Set 12345</UIButton>
        <UIButton size="sm" variant="subtle" @click="code = '99999'">Set 99999</UIButton>
        <UIButton size="sm" variant="subtle" @click="code = ''">Clear</UIButton>
      </div>
      <UIFormPinInput v-model="code" intent="secondary" label="Code" />
    </section>

    <!-- Masked & OTP -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Mask & OTP</h2>
      <p class="text-sm text-neutral-text-subtle">
        <code>:mask="true"</code> hides characters as you type. <code>:otp="true"</code> enables
        browser autofill for SMS codes.
      </p>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Masked</p>
          <UIFormPinInput
            v-model="maskedCode"
            :mask="true"
            label="PIN"
            helper-text="Characters are hidden"
            intent="primary"
          />
          <p class="font-mono text-xs text-neutral-text-subtle">
            Value: {{ maskedCode || '(empty)' }}
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">OTP Mode</p>
          <UIFormPinInput
            v-model="otpCode"
            :otp="true"
            :count="6"
            label="SMS Code"
            helper-text="Browser may suggest codes"
            intent="secondary"
          />
        </div>
      </div>
    </section>

    <!-- blurOnComplete & valueComplete -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Blur on Complete</h2>
      <p class="text-sm text-neutral-text-subtle">
        <code>:blur-on-complete="true"</code> removes focus when all slots are filled.
        <code>@value-complete</code> fires when complete.
      </p>
      <UIFormPinInput
        :blur-on-complete="true"
        :count="4"
        label="4-digit PIN"
        helper-text="Focus is removed when all digits entered"
        @value-complete="onValueComplete"
      />
      <p v-if="completeCode" class="font-mono text-xs text-success-text">
        Complete! Code: {{ completeCode }}
      </p>
    </section>

    <!-- Types -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Input Types</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div v-for="type in types" :key="type" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ type }}</p>
          <UIFormPinInput :type="type" :count="4" :label="type" intent="neutral" />
        </div>
      </div>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="intent in intents" :key="intent" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ intent }}</p>
          <UIFormPinInput :intent :count="4" :label="intent" />
        </div>
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div class="flex flex-col gap-6">
        <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ size }}</p>
          <UIFormPinInput :size :count="4" :label="size" />
        </div>
      </div>
    </section>

    <!-- States: Disabled, ReadOnly, Required, Invalid -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">States</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Disabled</p>
          <UIFormPinInput disabled:count="4" label="Disabled" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Read Only</p>
          <UIFormPinInput read-only:count="4" label="Read Only" :model-value="'1234'" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Required</p>
          <UIFormPinInput required:count="4" label="Required" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">Invalid</p>
          <UIFormPinInput
            invalid
            :count="4"
            label="Invalid"
            error="The code you entered is incorrect"
            @value-invalid="onValueInvalid"
          />
        </div>
      </div>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode (external API)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>usePinInput()</code> — allows setting the value imperatively.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalApi.setValue(['1', '2', '3', '4'])">
          Set 1234
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalApi.setValue([])"> Clear </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalApi.focus()"> Focus </UIButton>
      </div>
      <UIFormPinInput :value="externalApi" :count="4" label="External API" intent="accent" />
    </section>

    <!-- Custom placeholder -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Custom Placeholder</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use <code>placeholder="-"</code> to customize the empty slot indicator.
      </p>
      <UIFormPinInput :count="4" placeholder="-" label="Custom placeholder" intent="neutral" />
    </section>

    <!-- autoFocus & selectOnFocus -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">autoFocus & selectOnFocus</h2>
      <p class="text-sm text-neutral-text-subtle">
        <code>:auto-focus="true"</code> focuses the first input on mount.
        <code>:select-on-focus="true"</code> selects the content when a slot receives focus.
      </p>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">autoFocus</p>
          <UIFormPinInput :auto-focus="true" :count="4" label="Auto focused" intent="primary" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">selectOnFocus</p>
          <UIFormPinInput
            :select-on-focus="true"
            :count="4"
            label="Select on focus"
            intent="secondary"
          />
        </div>
      </div>
    </section>

    <!--:count variations -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Count Variations</h2>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">3 digits</p>
          <UIFormPinInput :count="3" label="CVV" intent="primary" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">6 digits</p>
          <UIFormPinInput :count="6" label="Token" intent="secondary" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle">8 characters</p>
          <UIFormPinInput :count="8" type="alphanumeric" label="Code" intent="accent" />
        </div>
      </div>
    </section>
  </div>
</template>
