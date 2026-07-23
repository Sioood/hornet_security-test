<script setup lang="ts">
import { VisLine, VisXYContainer } from '@unovis/vue'

type Point = { x: number; y: number }

const data: Point[] = Array.from({ length: 12 }, (_, index) => ({
  x: index + 1,
  y: Math.round((Math.sin(index / 2) + 1.5) * 40),
}))

const x = (d: Point) => d.x
const y = (d: Point) => d.y

const xTickFormat = (tick: number | Date) => `M${Number(tick)}`
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-8 p-4">
    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">UIChartAxis</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Must be used inside <code class="font-mono">VisXYContainer</code>. Forwards Unovis axis
        props (ticks, labels, grid, events).
      </p>
      <div
        class="[--vis-axis-grid-color:var(--color-neutral-border-subtle)] [--vis-axis-grid-line-dasharray:5_5] [--vis-axis-text-color:var(--color-neutral-text)] [--vis-axis-tick-color:var(--color-neutral-border-subtle)]"
      >
        <VisXYContainer :data="data" :height="280">
          <VisLine :x="x" :y="y" />
          <UIChartAxis
            type="x"
            label="Month"
            :num-ticks="6"
            :tick-text-hide-overlapping="true"
            :tick-format="xTickFormat"
          />
          <UIChartAxis type="y" label="Value" position="right" :grid-line="true" />
        </VisXYContainer>
      </div>
    </section>
  </div>
</template>
