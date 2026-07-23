<script setup lang="ts">
import { useSteps, type StepChangeDetails } from '@ark-ui/vue/steps'

const externalSteps = useSteps({ count: 3, defaultStep: 0 })

const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const

const controlledStep = ref<number>(0)

// Linear form validation
const linearStep = ref<number>(0)
const step1Accepted = ref(false)
const step2Accepted = ref(false)

function isLinearStepValid(stepIndex: number): boolean {
  if (stepIndex === 0) return step1Accepted.value
  if (stepIndex === 1) return step2Accepted.value
  return true
}

/** Track which step the user attempted to advance from without being valid. */
const attemptedFrom = ref<number | null>(null)

/**
 * Intercept step updates to validate the current step before allowing navigation.
 * Uses manual `:step` + `@update:step` instead of `v-model:step` so we control
 * when the step actually changes. Going backwards is always allowed.
 */
function onLinearStepUpdate(next: number | undefined) {
  if (!next) return
  const current = linearStep.value
  // Going backwards is always allowed
  if (next < current) {
    linearStep.value = next
    attemptedFrom.value = null
    return
  }
  // Going forward requires current step to be valid
  if (!isLinearStepValid(current)) {
    attemptedFrom.value = current
    return
  }
  linearStep.value = next
  attemptedFrom.value = null
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Automated (New) -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Automated (New)</h2>
        <p class="text-sm text-neutral-text-subtle">
          Pass <code>items</code> to automatically render the step list and triggers. Only
          <code>UIStepsContent</code> and <code>UIStepsCompletedContent</code> are needed in the
          slot.
        </p>
      </div>
      <UISteps :items="['Details', 'Shipping', 'Payment']" intent="primary" show-progress>
        <UIStepsContent :index="0">
          <p class="text-sm text-neutral-text-subtle">Automated details content.</p>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <p class="text-sm text-neutral-text-subtle">Automated shipping content.</p>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Automated payment content.</p>
        </UIStepsContent>
        <UIStepsCompletedContent>
          <p class="font-semibold text-success-text">✓ All done automatically!</p>
        </UIStepsCompletedContent>
      </UISteps>
    </section>

    <!-- Basic -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Basic</h2>
        <p class="text-sm text-neutral-text-subtle">
          Three steps with squared indicator (step number → checkmark), separator thread, content,
          and prev/next navigation.
        </p>
      </div>
      <UIStepsRoot :count="3" @step-change="(d: StepChangeDetails) => console.log('stepChange', d)">
        <UIStepsList>
          <UIStepsItem :index="0">
            <UIStepsIndicator />
            <UIStepsTrigger>Details</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="1">
            <UIStepsIndicator />
            <UIStepsTrigger>Shipping</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="2">
            <UIStepsIndicator />
            <UIStepsTrigger>Payment</UIStepsTrigger>
          </UIStepsItem>
        </UIStepsList>

        <UIStepsContent :index="0">
          <p class="text-sm text-neutral-text-subtle">Enter your personal details here.</p>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <p class="text-sm text-neutral-text-subtle">Choose your shipping method.</p>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Complete your payment information.</p>
        </UIStepsContent>

        <UIStepsCompletedContent>
          <p class="font-semibold text-success-text">✓ Order placed successfully!</p>
        </UIStepsCompletedContent>

        <div class="flex justify-between">
          <UIStepsPrevTrigger />
          <UIStepsNextTrigger />
        </div>
      </UIStepsRoot>
    </section>

    <!-- Controlled via v-model:step -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled (v-model:step)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Fully controlled via <code>v-model:step</code>. External buttons jump to arbitrary steps.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="controlledStep = 0">Step 1</UIButton>
        <UIButton size="sm" variant="subtle" @click="controlledStep = 1">Step 2</UIButton>
        <UIButton size="sm" variant="subtle" @click="controlledStep = 2">Step 3</UIButton>
      </div>
      <p class="font-mono text-xs text-neutral-text-subtle">Current step: {{ controlledStep }}</p>
      <UIStepsRoot v-model:step="controlledStep" :count="3">
        <UIStepsList>
          <UIStepsItem v-for="i in 3" :key="i" :index="i - 1">
            <UIStepsIndicator />
            <UIStepsTrigger>Step {{ i }}</UIStepsTrigger>
            <UIStepsSeparator v-if="i < 3" />
          </UIStepsItem>
        </UIStepsList>
        <UIStepsContent v-for="i in 3" :key="i" :index="i - 1">
          <p class="text-sm text-neutral-text-subtle">Content for step {{ i }}</p>
        </UIStepsContent>
        <UIStepsCompletedContent>
          <p class="font-semibold">All done!</p>
        </UIStepsCompletedContent>
        <div class="flex justify-between">
          <UIStepsPrevTrigger />
          <UIStepsNextTrigger />
        </div>
      </UIStepsRoot>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode (external API)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useSteps()</code> — allows calling <code>goToStep()</code>,
        <code>resetStep()</code> imperatively.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalSteps.setStep(0)">Step 1</UIButton>
        <UIButton size="sm" variant="subtle" @click="externalSteps.setStep(1)">Step 2</UIButton>
        <UIButton size="sm" variant="subtle" @click="externalSteps.setStep(2)">Step 3</UIButton>
        <UIButton size="sm" variant="subtle" @click="externalSteps.resetStep()">Reset</UIButton>
      </div>
      <UIStepsRoot :value="externalSteps" intent="primary">
        <UIStepsList>
          <UIStepsItem :index="0">
            <UIStepsIndicator />
            <UIStepsTrigger>Details</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="1">
            <UIStepsIndicator />
            <UIStepsTrigger>Shipping</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="2">
            <UIStepsIndicator />
            <UIStepsTrigger>Payment</UIStepsTrigger>
          </UIStepsItem>
        </UIStepsList>
        <UIStepsContent :index="0">
          <p class="text-sm text-neutral-text-subtle">Personal details.</p>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <p class="text-sm text-neutral-text-subtle">Shipping method.</p>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Payment info.</p>
        </UIStepsContent>
        <UIStepsCompletedContent>
          <p class="font-semibold text-success-text">✓ Done!</p>
        </UIStepsCompletedContent>
        <div class="flex justify-between">
          <UIStepsPrevTrigger />
          <UIStepsNextTrigger />
        </div>
      </UIStepsRoot>
    </section>

    <!-- Linear mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Linear Mode</h2>
      <p class="text-sm text-neutral-text-subtle">
        With <code>:linear="true"</code>, steps must be completed in order — clicking step 3
        directly is blocked.
      </p>
      <UIStepsRoot :count="3" linear intent="secondary">
        <UIStepsList>
          <UIStepsItem :index="0">
            <UIStepsIndicator />
            <UIStepsTrigger>Step 1</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="1">
            <UIStepsIndicator />
            <UIStepsTrigger>Step 2</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="2">
            <UIStepsIndicator />
            <UIStepsTrigger>Step 3</UIStepsTrigger>
          </UIStepsItem>
        </UIStepsList>
        <UIStepsContent :index="0">
          <p class="text-sm text-neutral-text-subtle">You must complete this step first.</p>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <p class="text-sm text-neutral-text-subtle">Now step 2.</p>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Final step.</p>
        </UIStepsContent>
        <UIStepsCompletedContent>
          <p class="font-semibold text-success-text">✓ Complete!</p>
        </UIStepsCompletedContent>
        <div class="flex justify-between">
          <UIStepsPrevTrigger />
          <UIStepsNextTrigger />
        </div>
      </UIStepsRoot>
    </section>

    <!-- Linear with form validation -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Linear with Form Validation</h2>
      <p class="text-sm text-neutral-text-subtle">
        Combine <code>:linear="true"</code> with <code>UIFormCheckbox</code> components to gate
        progression. Tick each step's checkbox to validate it, then click Next. An error message
        appears when you try to advance without completing.
      </p>
      <UIStepsRoot
        :step="linearStep"
        :count="3"
        linear
        intent="primary"
        @update:step="onLinearStepUpdate"
      >
        <UIStepsList>
          <UIStepsItem :index="0">
            <UIStepsIndicator />
            <UIStepsTrigger>Details</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="1">
            <UIStepsIndicator />
            <UIStepsTrigger>Shipping</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="2">
            <UIStepsIndicator />
            <UIStepsTrigger>Payment</UIStepsTrigger>
          </UIStepsItem>
        </UIStepsList>

        <UIStepsContent :index="0">
          <div class="flex flex-col gap-3">
            <p class="text-sm text-neutral-text-subtle">Enter your personal details to continue.</p>
            <UIFormCheckbox v-model="step1Accepted" label="I have filled in my details" />
            <p v-if="attemptedFrom === 0" role="alert" class="txt-caption text-error-text">
              ⚠ Please complete this step before continuing.
            </p>
          </div>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <div class="flex flex-col gap-3">
            <p class="text-sm text-neutral-text-subtle">Choose your shipping method.</p>
            <UIFormCheckbox v-model="step2Accepted" label="I have selected a shipping method" />
            <p v-if="attemptedFrom === 1" role="alert" class="txt-caption text-error-text">
              ⚠ Please complete this step before continuing.
            </p>
          </div>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Complete your payment information.</p>
        </UIStepsContent>

        <UIStepsCompletedContent>
          <p class="font-semibold text-success-text">✓ All steps validated and complete!</p>
        </UIStepsCompletedContent>

        <div class="flex justify-between">
          <UIStepsPrevTrigger />
          <UIStepsNextTrigger />
        </div>
      </UIStepsRoot>
    </section>

    <!-- Custom Indicator Content -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Custom Indicator Content</h2>
      <p class="text-sm text-neutral-text-subtle">
        Override the default indicator via slot — use <code>UIStepsItemContext</code>
        to access step state and render anything custom.
      </p>
      <UIStepsRoot :count="3" intent="accent">
        <UIStepsList>
          <UIStepsItem :index="0">
            <UIStepsIndicator>
              <span class="txt-caption font-bold">01</span>
            </UIStepsIndicator>
            <UIStepsTrigger>Account</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="1">
            <UIStepsIndicator>
              <span class="txt-caption font-bold">02</span>
            </UIStepsIndicator>
            <UIStepsTrigger>Profile</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="2">
            <UIStepsIndicator>
              <span class="txt-caption font-bold">03</span>
            </UIStepsIndicator>
            <UIStepsTrigger>Confirm</UIStepsTrigger>
          </UIStepsItem>
        </UIStepsList>
        <UIStepsContent :index="0">
          <p class="text-sm text-neutral-text-subtle">Account setup.</p>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <p class="text-sm text-neutral-text-subtle">Profile details.</p>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Confirm and submit.</p>
        </UIStepsContent>
        <UIStepsCompletedContent>
          <p class="font-semibold text-success-text">✓ Registration complete!</p>
        </UIStepsCompletedContent>
        <div class="flex justify-between">
          <UIStepsPrevTrigger />
          <UIStepsNextTrigger />
        </div>
      </UIStepsRoot>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div v-for="intent in intents" :key="intent" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ intent }}</p>
          <UIStepsRoot :count="3" :intent>
            <UIStepsList>
              <UIStepsItem :index="0">
                <UIStepsIndicator />
                <UIStepsTrigger>Step 1</UIStepsTrigger>
                <UIStepsSeparator />
              </UIStepsItem>
              <UIStepsItem :index="1">
                <UIStepsIndicator />
                <UIStepsTrigger>Step 2</UIStepsTrigger>
                <UIStepsSeparator />
              </UIStepsItem>
              <UIStepsItem :index="2">
                <UIStepsIndicator />
                <UIStepsTrigger>Step 3</UIStepsTrigger>
              </UIStepsItem>
            </UIStepsList>
            <UIStepsContent :index="0">
              <p class="text-sm">Content 1</p>
            </UIStepsContent>
            <UIStepsContent :index="1">
              <p class="text-sm">Content 2</p>
            </UIStepsContent>
            <UIStepsContent :index="2">
              <p class="text-sm">Content 3</p>
            </UIStepsContent>
            <UIStepsCompletedContent>
              <p class="text-sm font-semibold">Done!</p>
            </UIStepsCompletedContent>
            <div class="flex justify-between">
              <UIStepsPrevTrigger />
              <UIStepsNextTrigger />
            </div>
          </UIStepsRoot>
        </div>
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div class="flex flex-col gap-8">
        <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ size }}</p>
          <UIStepsRoot :count="3" :size intent="primary">
            <UIStepsList>
              <UIStepsItem :index="0">
                <UIStepsIndicator />
                <UIStepsTrigger>Step 1</UIStepsTrigger>
                <UIStepsSeparator />
              </UIStepsItem>
              <UIStepsItem :index="1">
                <UIStepsIndicator />
                <UIStepsTrigger>Step 2</UIStepsTrigger>
                <UIStepsSeparator />
              </UIStepsItem>
              <UIStepsItem :index="2">
                <UIStepsIndicator />
                <UIStepsTrigger>Step 3</UIStepsTrigger>
              </UIStepsItem>
            </UIStepsList>
            <UIStepsContent :index="0">
              <p class="text-sm">Content 1</p>
            </UIStepsContent>
            <UIStepsContent :index="1">
              <p class="text-sm">Content 2</p>
            </UIStepsContent>
            <UIStepsContent :index="2">
              <p class="text-sm">Content 3</p>
            </UIStepsContent>
            <UIStepsCompletedContent>
              <p class="font-semibold">Done!</p>
            </UIStepsCompletedContent>
            <div class="flex justify-between">
              <UIStepsPrevTrigger />
              <UIStepsNextTrigger />
            </div>
          </UIStepsRoot>
        </div>
      </div>
    </section>

    <!-- With Progress bar -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Progress Bar</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use <code>UIStepsProgress</code> to show overall completion progress.
      </p>
      <UIStepsRoot :count="4" intent="primary">
        <UIStepsProgress />
        <UIStepsList>
          <UIStepsItem :index="0">
            <UIStepsIndicator />
            <UIStepsTrigger>Setup</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="1">
            <UIStepsIndicator />
            <UIStepsTrigger>Config</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="2">
            <UIStepsIndicator />
            <UIStepsTrigger>Review</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="3">
            <UIStepsIndicator />
            <UIStepsTrigger>Launch</UIStepsTrigger>
          </UIStepsItem>
        </UIStepsList>
        <UIStepsContent :index="0">
          <p class="text-sm text-neutral-text-subtle">Initial setup.</p>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <p class="text-sm text-neutral-text-subtle">Configuration.</p>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Review settings.</p>
        </UIStepsContent>
        <UIStepsContent :index="3">
          <p class="text-sm text-neutral-text-subtle">Launch your project!</p>
        </UIStepsContent>
        <UIStepsCompletedContent>
          <p class="font-semibold text-success-text">✓ Launched!</p>
        </UIStepsCompletedContent>
        <div class="flex justify-between">
          <UIStepsPrevTrigger />
          <UIStepsNextTrigger />
        </div>
      </UIStepsRoot>
    </section>

    <!-- Context for inline state access -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Context Inline State Access</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use <code>UIStepsContext</code> to read step info inline.
      </p>
      <UIStepsRoot :count="3">
        <UIStepsList>
          <UIStepsItem :index="0">
            <UIStepsIndicator />
            <UIStepsTrigger>Step 1</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="1">
            <UIStepsIndicator />
            <UIStepsTrigger>Step 2</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="2">
            <UIStepsIndicator />
            <UIStepsTrigger>Step 3</UIStepsTrigger>
          </UIStepsItem>
        </UIStepsList>

        <UIStepsContext v-slot="ctx">
          <p class="font-mono text-xs text-neutral-text-subtle">
            Step {{ Number(ctx.value) + 1 }} of {{ ctx.count }}
          </p>
        </UIStepsContext>

        <UIStepsContent :index="0">
          <p class="text-sm text-neutral-text-subtle">Content 1</p>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <p class="text-sm text-neutral-text-subtle">Content 2</p>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Content 3</p>
        </UIStepsContent>
        <UIStepsCompletedContent>
          <p class="font-semibold">Done!</p>
        </UIStepsCompletedContent>
        <div class="flex justify-between">
          <UIStepsPrevTrigger />
          <UIStepsNextTrigger />
        </div>
      </UIStepsRoot>
    </section>

    <!-- Vertical orientation with visual thread -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Vertical Orientation (Thread)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Set <code>orientation="vertical"</code> — separators become vertical thread lines connecting
        steps top-to-bottom. Indicators stack above each step label.
      </p>
      <UIStepsRoot :count="3" orientation="vertical" intent="secondary">
        <UIStepsList>
          <UIStepsItem :index="0">
            <UIStepsIndicator />
            <div class="flex flex-col gap-1">
              <UIStepsTrigger>Details</UIStepsTrigger>
              <UIStepsSeparator />
            </div>
          </UIStepsItem>
          <UIStepsItem :index="1">
            <UIStepsIndicator />
            <div class="flex flex-col gap-1">
              <UIStepsTrigger>Shipping</UIStepsTrigger>
              <UIStepsSeparator />
            </div>
          </UIStepsItem>
          <UIStepsItem :index="2">
            <UIStepsIndicator />
            <div class="flex flex-col gap-1">
              <UIStepsTrigger>Payment</UIStepsTrigger>
            </div>
          </UIStepsItem>
        </UIStepsList>
        <UIStepsContent :index="0">
          <p class="text-sm text-neutral-text-subtle">Enter details.</p>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <p class="text-sm text-neutral-text-subtle">Choose shipping.</p>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Pay securely.</p>
        </UIStepsContent>
        <UIStepsCompletedContent>
          <p class="font-semibold text-success-text">✓ Order complete!</p>
        </UIStepsCompletedContent>
        <div class="flex justify-between">
          <UIStepsPrevTrigger />
          <UIStepsNextTrigger />
        </div>
      </UIStepsRoot>
    </section>

    <!-- asChild triggers -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">asChild Triggers</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use <code>as-child</code> on prev/next triggers to override with custom
        <code>UIButton</code> variants.
      </p>
      <UIStepsRoot :count="3" intent="accent">
        <UIStepsList>
          <UIStepsItem :index="0">
            <UIStepsIndicator />
            <UIStepsTrigger>Step 1</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="1">
            <UIStepsIndicator />
            <UIStepsTrigger>Step 2</UIStepsTrigger>
            <UIStepsSeparator />
          </UIStepsItem>
          <UIStepsItem :index="2">
            <UIStepsIndicator />
            <UIStepsTrigger>Step 3</UIStepsTrigger>
          </UIStepsItem>
        </UIStepsList>
        <UIStepsContent :index="0">
          <p class="text-sm text-neutral-text-subtle">Content 1</p>
        </UIStepsContent>
        <UIStepsContent :index="1">
          <p class="text-sm text-neutral-text-subtle">Content 2</p>
        </UIStepsContent>
        <UIStepsContent :index="2">
          <p class="text-sm text-neutral-text-subtle">Content 3</p>
        </UIStepsContent>
        <UIStepsCompletedContent>
          <p class="font-semibold">Done!</p>
        </UIStepsCompletedContent>
        <div class="flex justify-between">
          <UIStepsPrevTrigger as-child>
            <UIButton variant="ghost" size="md" intent="accent">← Back</UIButton>
          </UIStepsPrevTrigger>
          <UIStepsNextTrigger as-child>
            <UIButton variant="default" size="md" intent="accent">Next →</UIButton>
          </UIStepsNextTrigger>
        </div>
      </UIStepsRoot>
    </section>
  </div>
</template>
