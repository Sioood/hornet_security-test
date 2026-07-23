<script setup lang="ts">
// oxlint-disable no-console
import {
  useAccordion,
  type AccordionFocusChangeDetails,
  type AccordionValueChangeDetails,
} from '@ark-ui/vue/accordion'

const controlled = ref<string[]>([])
const contextValue = ref<string[]>([])

const externalAccordion = useAccordion({ collapsible: true, multiple: true })

const faqItems = [
  {
    content:
      'A high-performance, accessible component library built on top of Ark UI and Tailwind CSS.',
    trigger: 'What is this UI library?',
    value: 'what',
  },
  {
    content:
      'It focuses on extreme type safety, modularity via Nuxt layers, and a cohesive design system.',
    trigger: 'Why choose this over others?',
    value: 'why',
  },
  {
    content:
      'Install the package, add it to your nuxt.config.ts layers, and start using the UI components.',
    trigger: 'How do I get started?',
    value: 'how',
  },
]

const intents = ['neutral', 'primary', 'secondary', 'accent'] as const
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-12 p-6">
    <!-- Basic usage -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-bold">Basic (Root mode)</h2>
        <p class="text-sm text-neutral-text-subtle">Default Root mode with uncontrolled state.</p>
      </div>
      <UIAccordion
        collapsible
        :default-value="['what']"
        @value-change="(d: AccordionValueChangeDetails) => console.log('valueChange', d)"
        @focus-change="(d: AccordionFocusChangeDetails) => console.log('focusChange', d)"
      >
        <UIAccordionItem v-for="item in faqItems" :key="item.value" :value="item.value">
          <UIAccordionItemTrigger>
            <span class="font-medium">{{ item.trigger }}</span>
            <UIAccordionItemIndicator />
          </UIAccordionItemTrigger>
          <UIAccordionItemContent>{{ item.content }}</UIAccordionItemContent>
        </UIAccordionItem>
      </UIAccordion>
    </section>

    <!-- Intents -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Intents</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="intent in intents" :key="intent" class="flex flex-col gap-2">
          <p class="text-sm font-medium text-neutral-text-subtle capitalize">{{ intent }}</p>
          <UIAccordion :intent collapsible>
            <UIAccordionItem value="a">
              <UIAccordionItemTrigger>Panel A <UIAccordionItemIndicator /></UIAccordionItemTrigger>
              <UIAccordionItemContent>Content for {{ intent }} panel A.</UIAccordionItemContent>
            </UIAccordionItem>
            <UIAccordionItem value="b">
              <UIAccordionItemTrigger>Panel B <UIAccordionItemIndicator /></UIAccordionItemTrigger>
              <UIAccordionItemContent>Content for {{ intent }} panel B.</UIAccordionItemContent>
            </UIAccordionItem>
          </UIAccordion>
        </div>
      </div>
    </section>

    <!-- Disabled -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Disabled</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm text-neutral-text-subtle">Entire accordion disabled</p>
          <UIAccordion disabled :default-value="['d1']">
            <UIAccordionItem value="d1">
              <UIAccordionItemTrigger>
                Locked Panel <UIAccordionItemIndicator />
              </UIAccordionItemTrigger>
              <UIAccordionItemContent>This is disabled at the root level.</UIAccordionItemContent>
            </UIAccordionItem>
            <UIAccordionItem value="d2">
              <UIAccordionItemTrigger>
                Also Locked <UIAccordionItemIndicator />
              </UIAccordionItemTrigger>
              <UIAccordionItemContent>Disabled.</UIAccordionItemContent>
            </UIAccordionItem>
          </UIAccordion>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm text-neutral-text-subtle">Single item disabled</p>
          <UIAccordion collapsible :default-value="['e1']">
            <UIAccordionItem value="e1">
              <UIAccordionItemTrigger>
                Active Panel <UIAccordionItemIndicator />
              </UIAccordionItemTrigger>
              <UIAccordionItemContent>This panel works normally.</UIAccordionItemContent>
            </UIAccordionItem>
            <UIAccordionItem value="e2" disabled>
              <UIAccordionItemTrigger>
                Disabled Item <UIAccordionItemIndicator />
              </UIAccordionItemTrigger>
              <UIAccordionItemContent>Hidden.</UIAccordionItemContent>
            </UIAccordionItem>
          </UIAccordion>
        </div>
      </div>
    </section>

    <!-- Controlled state -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Controlled State (v-model)</h2>
      <div class="mb-2 flex gap-2">
        <UIButton size="sm" variant="subtle" @click="controlled = ['c1']">Open 1</UIButton>
        <UIButton size="sm" variant="subtle" @click="controlled = ['c1', 'c2']">Open All</UIButton>
        <UIButton size="sm" variant="subtle" @click="controlled = []">Close All</UIButton>
      </div>
      <p class="font-mono text-xs text-neutral-text-subtle">v-model: {{ controlled }}</p>
      <UIAccordion v-model="controlled" multiple collapsible intent="secondary">
        <UIAccordionItem value="c1">
          <UIAccordionItemTrigger>Panel One <UIAccordionItemIndicator /></UIAccordionItemTrigger>
          <UIAccordionItemContent>Dynamic content for panel one.</UIAccordionItemContent>
        </UIAccordionItem>
        <UIAccordionItem value="c2">
          <UIAccordionItemTrigger>Panel Two <UIAccordionItemIndicator /></UIAccordionItemTrigger>
          <UIAccordionItemContent>Dynamic content for panel two.</UIAccordionItemContent>
        </UIAccordionItem>
      </UIAccordion>
    </section>

    <!-- RootProvider mode -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">RootProvider mode (external API)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Created via <code>useAccordion()</code> — allows calling
        <code>accordion.value.setValue()</code> imperatively.
      </p>
      <div class="flex gap-2">
        <UIButton size="sm" variant="subtle" @click="externalAccordion.setValue(['rp1'])">
          Open 1
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalAccordion.setValue(['rp1', 'rp2'])">
          Open All
        </UIButton>
        <UIButton size="sm" variant="subtle" @click="externalAccordion.setValue([])">
          Close All
        </UIButton>
      </div>
      <UIAccordion :value="externalAccordion" intent="accent">
        <UIAccordionItem value="rp1">
          <UIAccordionItemTrigger>
            External Panel 1 <UIAccordionItemIndicator />
          </UIAccordionItemTrigger>
          <UIAccordionItemContent>
            Controlled by <code>useAccordion()</code> outside.
          </UIAccordionItemContent>
        </UIAccordionItem>
        <UIAccordionItem value="rp2">
          <UIAccordionItemTrigger>
            External Panel 2 <UIAccordionItemIndicator />
          </UIAccordionItemTrigger>
          <UIAccordionItemContent>Same external API controls both items.</UIAccordionItemContent>
        </UIAccordionItem>
      </UIAccordion>
    </section>

    <!-- Context -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Context (UIAccordionContext)</h2>
      <p class="text-sm text-neutral-text-subtle">
        Use <code>&lt;UIAccordionContext&gt;</code> to read <code>value</code> and
        <code>focusedValue</code> inline.
      </p>
      <UIAccordion v-model="contextValue" collapsible multiple intent="primary">
        <UIAccordionContext v-slot="ctx">
          <p class="mb-1 font-mono text-xs text-neutral-text-subtle">
            open={{ JSON.stringify(ctx.value) }} | focused={{ ctx.focusedValue ?? 'null' }}
          </p>
        </UIAccordionContext>
        <UIAccordionItem value="ctx1">
          <UIAccordionItemTrigger>
            Context Item 1 <UIAccordionItemIndicator />
          </UIAccordionItemTrigger>
          <UIAccordionItemContent>Reading context state above.</UIAccordionItemContent>
        </UIAccordionItem>
        <UIAccordionItem value="ctx2">
          <UIAccordionItemTrigger>
            Context Item 2 <UIAccordionItemIndicator />
          </UIAccordionItemTrigger>
          <UIAccordionItemContent>Reading context state above.</UIAccordionItemContent>
        </UIAccordionItem>
      </UIAccordion>
    </section>

    <!-- Horizontal -->
    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Horizontal</h2>
      <UIAccordion
        orientation="horizontal"
        collapsible
        intent="accent"
        class="h-40 overflow-hidden rounded-lg border border-accent-border-subtle"
      >
        <UIAccordionItem value="h1" class="border-r border-accent-border-subtle">
          <UIAccordionItemTrigger class="flex h-full items-center justify-center px-4">
            <span style="writing-mode: vertical-rl">Profile</span>
            <UIAccordionItemIndicator class="mt-2 rotate-90 data-[state=open]:-rotate-90" />
          </UIAccordionItemTrigger>
          <UIAccordionItemContent class="min-w-50 p-4">
            User settings and preferences.
          </UIAccordionItemContent>
        </UIAccordionItem>
        <UIAccordionItem value="h2">
          <UIAccordionItemTrigger class="flex h-full items-center justify-center px-4">
            <span style="writing-mode: vertical-rl">Stats</span>
            <UIAccordionItemIndicator class="mt-2 rotate-90 data-[state=open]:-rotate-90" />
          </UIAccordionItemTrigger>
          <UIAccordionItemContent class="min-w-50 p-4">
            Usage statistics and analytics.
          </UIAccordionItemContent>
        </UIAccordionItem>
      </UIAccordion>
    </section>
  </div>
</template>
