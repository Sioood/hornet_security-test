<script setup lang="ts">
import { musicFormatSeries } from './stacked-bar-data'
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-6 p-4">
    <section class="flex flex-col gap-2">
      <h3 class="txt-h3 text-neutral-text">Top center (default)</h3>
      <UIChartLegend :series="musicFormatSeries" placement="top-center" />
    </section>
    <section class="flex flex-col gap-2">
      <h3 class="txt-h3 text-neutral-text">Bottom end</h3>
      <UIChartLegend :series="musicFormatSeries" placement="bottom-end" size="lg" />
    </section>
    <section class="flex flex-row items-center gap-4">
      <h3 class="txt-h3 shrink-0 text-neutral-text">Right</h3>
      <UIChartLegend :series="musicFormatSeries" placement="right-center" />
    </section>
  </div>
</template>
