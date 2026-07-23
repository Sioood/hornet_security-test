<script setup lang="ts">
// oxlint-disable no-console
import { Orientation, StackedBar } from '@unovis/ts'

import {
  formatMusicRevenue,
  musicFormatData,
  musicFormatSeries,
  type MusicFormatRecord,
} from './stacked-bar-data'

const x = (d: MusicFormatRecord) => d.year

const reactiveWindow = ref(20)
const chartData = computed(() => musicFormatData.slice(-reactiveWindow.value))

const horizontalOrientation = Orientation.Horizontal
const roundedCorners = true
const barWidth = 5
const barPadding = 0.35

const barEvents = {
  [StackedBar.selectors.bar]: {
    click: (d: MusicFormatRecord) => console.log('bar click', d),
  },
}
</script>

<template>
  <div class="flex w-full max-w-4xl flex-col gap-10 p-4">
    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Basic</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Music industry revenue by format (Unovis stacked bar demo data).
      </p>
      <UIChartStackedBar
        :data="musicFormatData"
        :series="musicFormatSeries"
        :x="x"
        :value-formatter="(value) => formatMusicRevenue(value)"
        :legend="{ show: true }"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Reactive data</h3>
      <div class="flex flex-wrap items-center gap-2">
        <span class="txt-label text-neutral-text-subtle">Years shown: {{ reactiveWindow }}</span>
        <UIButton
          size="sm"
          variant="subtle"
          @click="reactiveWindow = Math.max(5, reactiveWindow - 5)"
        >
          Fewer years
        </UIButton>
        <UIButton
          size="sm"
          variant="subtle"
          @click="reactiveWindow = Math.min(musicFormatData.length, reactiveWindow + 5)"
        >
          More years
        </UIButton>
      </div>
      <UIChartStackedBar
        :data="chartData"
        :series="musicFormatSeries"
        :x="x"
        :value-formatter="(value) => formatMusicRevenue(value)"
        :legend="{ show: true }"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Orientation</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Horizontal layout: hover a bar row for the tooltip (Unovis crosshair is vertical-only).
      </p>
      <UIChartStackedBar
        :data="musicFormatData.slice(-12)"
        :series="musicFormatSeries"
        :x="x"
        :orientation="horizontalOrientation"
        :height="320"
        :value-formatter="(value) => formatMusicRevenue(value)"
        :legend="{ show: true }"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Rounded corners</h3>
      <UIChartStackedBar
        :data="musicFormatData.slice(-15)"
        :series="musicFormatSeries"
        :x="x"
        :rounded-corners="roundedCorners"
        :value-formatter="(value) => formatMusicRevenue(value)"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Bar sizing</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Fixed <code class="font-mono">barWidth</code> and <code class="font-mono">barPadding</code>.
      </p>
      <UIChartStackedBar
        :data="musicFormatData.slice(-8)"
        :series="musicFormatSeries"
        :x="x"
        :bar-width="barWidth"
        :bar-padding="barPadding"
        :value-formatter="(value) => formatMusicRevenue(value)"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Explicit y accessors</h3>
      <UIChartStackedBar
        :data="musicFormatData.slice(-10)"
        :x="x"
        :y="[(d) => d.streaming, (d) => d.download, (d) => d.cd]"
        :color="['var(--vis-color4)', 'var(--vis-color3)', 'var(--vis-color2)']"
        :value-formatter="(value) => formatMusicRevenue(value)"
        :legend="{ show: true }"
        :series="[
          { key: 'streaming', label: 'Streaming', color: 'var(--vis-color4)' },
          { key: 'download', label: 'Download', color: 'var(--vis-color3)' },
          { key: 'cd', label: 'CD', color: 'var(--vis-color2)' },
        ]"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Bar events</h3>
      <p class="txt-caption text-neutral-text-subtle">Click a bar — check the console.</p>
      <UIChartStackedBar
        :data="musicFormatData.slice(-12)"
        :series="musicFormatSeries"
        :x="x"
        :events="barEvents"
        :value-formatter="(value) => formatMusicRevenue(value)"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Axis configuration</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Tick labels, axis titles, and grid styling via
        <code class="font-mono">axis.x</code> / <code class="font-mono">axis.y</code> (Unovis
        <code class="font-mono">VisAxis</code> props).
      </p>
      <UIChartStackedBar
        :data="musicFormatData.slice(-12)"
        :series="musicFormatSeries"
        :x="x"
        :value-formatter="(value) => formatMusicRevenue(value)"
        :axis="{
          variant: 'dashed',
          x: {
            show: true,
            label: 'Year',
            numTicks: 6,
            tickTextHideOverlapping: true,
          },
          y: {
            show: true,
            label: 'Revenue (USD)',
            tickFormat: (tick) =>
              Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
              }).format(Number(tick) * 1e10),
          },
        }"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Legend placement</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Use <code class="font-mono">legend.placement</code> — e.g.
        <code class="font-mono">top-end</code>, <code class="font-mono">right-center</code>,
        <code class="font-mono">bottom-end</code>.
      </p>
      <div class="grid gap-8 lg:grid-cols-2">
        <UIChartStackedBar
          :data="musicFormatData.slice(-10)"
          :series="musicFormatSeries"
          :x="x"
          :height="320"
          :legend="{ show: true, placement: 'top-end' }"
          :value-formatter="(value) => formatMusicRevenue(value)"
          :intent="{ axis: 'neutral', data: 'primary' }"
        />
        <UIChartStackedBar
          :data="musicFormatData.slice(-10)"
          :series="musicFormatSeries"
          :x="x"
          :height="320"
          :legend="{ show: true, placement: 'right-center' }"
          :value-formatter="(value) => formatMusicRevenue(value)"
          :intent="{ axis: 'neutral', data: 'secondary' }"
        />
        <UIChartStackedBar
          :data="musicFormatData.slice(-10)"
          :series="musicFormatSeries"
          :x="x"
          :height="320"
          :legend="{ show: true, placement: 'bottom-center' }"
          :value-formatter="(value) => formatMusicRevenue(value)"
          :intent="{ axis: 'neutral', data: 'accent' }"
        />
        <UIChartStackedBar
          :data="musicFormatData.slice(-10)"
          :series="musicFormatSeries"
          :x="x"
          :height="320"
          :legend="{ show: true, placement: 'left-end' }"
          :value-formatter="(value) => formatMusicRevenue(value)"
          :intent="{ axis: 'primary', data: 'multicolor' }"
        />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Minimal chrome</h3>
      <UIChartStackedBar
        :data="musicFormatData.slice(-6)"
        :series="musicFormatSeries"
        :x="x"
        :crosshair="{ show: false }"
        :tooltip="{ show: false }"
        :axis="{ variant: 'default', x: { show: false }, y: { show: false } }"
      />
    </section>
  </div>
</template>
