<script setup lang="ts">
// oxlint-disable no-console
import { Donut, DONUT_HALF_ANGLE_RANGE_TOP } from '@unovis/ts'

import {
  formatTrafficPercent,
  trafficSourceData,
  trafficSourceSeries,
  value,
  type TrafficSourceRecord,
} from './donut-data'

const segmentEvents = {
  [Donut.selectors.segment]: {
    click: (d: TrafficSourceRecord) => console.log('segment click', d),
  },
}

const halfDonutAngleRange = DONUT_HALF_ANGLE_RANGE_TOP
</script>

<template>
  <div class="flex w-full max-w-4xl flex-col gap-10 p-4">
    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Basic</h3>
      <p class="txt-caption text-neutral-text-subtle">Traffic mix (Unovis basic donut pattern).</p>
      <UIChartDonut
        :data="trafficSourceData"
        :series="trafficSourceSeries"
        :value="value"
        :value-formatter="(v) => formatTrafficPercent(v)"
        :legend="{ show: true }"
        central-label="100%"
        central-sub-label="Traffic share"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Auto legend</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Legend built from <code class="font-mono">label</code> accessor when
        <code class="font-mono">series</code> is omitted.
      </p>
      <UIChartDonut
        :data="trafficSourceData"
        :value="value"
        :label="(d) => d.label"
        :value-formatter="(v) => formatTrafficPercent(v)"
        :legend="{ show: true, placement: 'right-center' }"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Half donut</h3>
      <UIChartDonut
        :data="trafficSourceData"
        :series="trafficSourceSeries"
        :value="value"
        :angle-range="halfDonutAngleRange"
        :value-formatter="(v) => formatTrafficPercent(v)"
        :legend="{ show: true }"
        central-label="62%"
        central-sub-label="Top channels"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Styling</h3>
      <p class="txt-caption text-neutral-text-subtle">
        <code class="font-mono">cornerRadius</code> and <code class="font-mono">padAngle</code>.
      </p>
      <UIChartDonut
        :data="trafficSourceData"
        :series="trafficSourceSeries"
        :value="value"
        :corner-radius="4"
        :pad-angle="0.02"
        :value-formatter="(v) => formatTrafficPercent(v)"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Pie chart</h3>
      <p class="txt-caption text-neutral-text-subtle">
        Set <code class="font-mono">arcWidth={0}</code> for a filled pie.
      </p>
      <UIChartDonut
        :data="trafficSourceData"
        :series="trafficSourceSeries"
        :value="value"
        :arc-width="0"
        :value-formatter="(v) => formatTrafficPercent(v)"
        :legend="{ show: true }"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Empty segments</h3>
      <UIChartDonut
        :data="[...trafficSourceData, { label: 'Email', value: 0 }]"
        :value="value"
        :label="(d) => d.label"
        :show-empty-segments="true"
        :pad-angle="0.03"
        :value-formatter="(v) => formatTrafficPercent(v)"
        :legend="{ show: true }"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Segment events</h3>
      <p class="txt-caption text-neutral-text-subtle">Click a segment — check the console.</p>
      <UIChartDonut
        :data="trafficSourceData"
        :series="trafficSourceSeries"
        :value="value"
        :events="segmentEvents"
        :value-formatter="(v) => formatTrafficPercent(v)"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Legend placement</h3>
      <div class="grid gap-8 lg:grid-cols-2">
        <UIChartDonut
          :data="trafficSourceData"
          :series="trafficSourceSeries"
          :value="value"
          :height="280"
          :legend="{ show: true, placement: 'top-end' }"
          :intent="'primary'"
        />
        <UIChartDonut
          :data="trafficSourceData"
          :series="trafficSourceSeries"
          :value="value"
          :height="280"
          :legend="{ show: true, placement: 'bottom-center' }"
          :intent="'secondary'"
        />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h3 class="txt-h3 text-neutral-text">Minimal chrome</h3>
      <UIChartDonut
        :data="trafficSourceData"
        :series="trafficSourceSeries"
        :value="value"
        :tooltip="{ show: false }"
        :legend="{ show: false }"
      />
    </section>
  </div>
</template>
