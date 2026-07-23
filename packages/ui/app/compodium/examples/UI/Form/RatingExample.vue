<script setup lang="ts">
// oxlint-disable no-console
import {
  useRatingGroup,
  type RatingGroupHoverChangeDetails,
  type RatingGroupValueChangeDetails,
} from '@ark-ui/vue/rating-group'

import { ratingValueTextCVA } from '~/utils/Components/Form/Rating/variants'

const rating = ref<number>()
const halfRating = ref<number>(2.5)
const readOnlyRating = ref<number>(4)

const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
const sizes = ['sm', 'md', 'lg'] as const

const externalApi = useRatingGroup({
  count: 5,
  defaultValue: 2,
})

function onValueChange(d: RatingGroupValueChangeDetails) {
  console.log('valueChange', d)
}

function onHoverChange(d: RatingGroupHoverChangeDetails) {
  console.log('hoverChange', d)
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Basic -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Basic</h2>
        <p class="text-sm text-neutral-text-subtle">
          Default 5-star rating with label and helper text.
        </p>
      </div>
      <UIFormRating
        v-model="rating"
        label="Product rating"
        helper-text="How would you rate this product?"
        :default-value="3"
        @value-change="onValueChange"
        @hover-change="onHoverChange"
      />
      <p class="font-mono text-xs text-neutral-text-subtle">
        Value: {{ rating ?? '(uncontrolled)' }}
      </p>
    </section>

    <!-- Controlled v-model -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled (v-model)</h2>
      <div class="flex flex-wrap gap-2">
        <UIButton size="sm" variant="subtle" @click="rating = 1">Set 1</UIButton>
        <UIButton size="sm" variant="subtle" @click="rating = 3">Set 3</UIButton>
        <UIButton size="sm" variant="subtle" @click="rating = 5">Set 5</UIButton>
        <UIButton size="sm" variant="subtle" @click="rating = undefined">Clear</UIButton>
      </div>
      <UIFormRating v-model="rating" label="Rating" />
    </section>

    <!-- Half stars -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Half stars</h2>
      <p class="text-sm text-neutral-text-subtle">
        Enable <code>allow-half</code> for 0.5 step increments.
      </p>
      <UIFormRating v-model="halfRating" allow-half label="Half-star rating" :default-value="2.5" />
      <p class="font-mono text-xs text-neutral-text-subtle">Value: {{ halfRating }}</p>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UIFormRating
          v-for="intent in intents"
          :key="intent"
          :intent
          :label="`${intent} intent`"
          :default-value="3"
        />
      </div>
    </section>

    <!-- Sizes -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Sizes</h2>
      <div class="flex flex-col gap-4">
        <UIFormRating
          v-for="size in sizes"
          :key="size"
          :size
          :label="`${size} size`"
          :default-value="4"
        />
      </div>
    </section>

    <!-- Disabled & read-only -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Disabled & read-only</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <UIFormRating disabled label="Disabled" :default-value="3" />
        <UIFormRating v-model="readOnlyRating" read-only label="Read-only" />
      </div>
    </section>

    <!-- Value text slot -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Value text slot</h2>
      <UIFormRating v-model="rating" label="With numeric display">
        <template #value-text="{ value, count, format }">
          <span :class="ratingValueTextCVA({ intent: 'primary', size: 'md' })">
            {{ format(value, count) }}
          </span>
        </template>
      </UIFormRating>
    </section>

    <!-- Custom item slot -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Custom item slot</h2>
      <UIFormRating label="Heart rating" intent="accent" :default-value="2">
        <template #item="{ highlighted }">
          <Icon
            :name="highlighted ? 'tabler:heart-filled' : 'tabler:heart'"
            class="size-5 text-accent-fill"
          />
        </template>
      </UIFormRating>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode</h2>
      <p class="text-sm text-neutral-text-subtle">
        Control the rating imperatively via <code>useRatingGroup()</code>.
      </p>
      <div class="flex flex-wrap gap-2">
        <UIButton size="sm" variant="subtle" @click="externalApi.setValue(5)">
          Set 5 stars
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalApi.clearValue()"> Clear </UIButton>
      </div>
      <UIFormRating :value="externalApi" label="External control" />
      <p class="font-mono text-xs text-neutral-text-subtle">API value: {{ externalApi.value }}</p>
    </section>

    <!-- Compound composition -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Compound composition</h2>
      <UIFormRatingRoot :default-value="4" intent="secondary" size="lg">
        <UIFormRatingLabel>Custom compound layout</UIFormRatingLabel>
        <UIFormRatingControl>
          <UIFormRatingContext v-slot="{ items }">
            <UIFormRatingItem v-for="item in items" :key="item" :index="item">
              <UIFormRatingItemContext v-slot="{ highlighted, half }">
                <UIFormRatingStarIndicator :highlighted :half intent="secondary" size="lg" />
              </UIFormRatingItemContext>
            </UIFormRatingItem>
          </UIFormRatingContext>
          <UIFormRatingHiddenInput name="compound-rating" />
        </UIFormRatingControl>
      </UIFormRatingRoot>
    </section>

    <!-- Form usage -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Form usage</h2>
      <form class="flex flex-col gap-4" @submit.prevent="console.log('submit')">
        <UIFormRating
          name="experience"
          required
          label="Overall experience"
          helper-text="Required for submission"
        />
        <UIButton type="submit" size="sm">Submit</UIButton>
      </form>
    </section>
  </div>
</template>
