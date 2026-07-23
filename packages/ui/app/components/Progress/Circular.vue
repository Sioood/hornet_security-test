<script setup lang="ts">
import {
  Progress as ArkProgress,
  type ProgressRootBaseProps as ArkProgressRootBaseProps,
  type ProgressRootProviderBaseProps as ArkProgressRootProviderBaseProps,
  type UseProgressReturn,
} from '@ark-ui/vue/progress'
import { cva } from 'class-variance-authority'

import type { ClassValue } from 'vue'
import type { ProgressCircularSize, ProgressIntent } from '~/utils/Components/Progress/context'

const progressCircleRootCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<ProgressIntent, string>,
    size: {
      'icon-lg': 'flex w-min flex-col',
      'icon-md': 'flex w-min flex-col',
      'icon-sm': 'flex w-min flex-col',
      lg: 'flex w-min flex-col gap-1',
      md: 'flex w-min flex-col gap-1',
      sm: 'flex w-min flex-col gap-1',
    } satisfies Record<ProgressCircularSize, string>,
  },
})

const progressCircleLabelCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<ProgressIntent, string>,
    size: {
      'icon-lg': 'hidden',
      'icon-md': 'hidden',
      'icon-sm': 'hidden',
      lg: 'txt-lg',
      md: 'txt-base',
      sm: 'txt-small',
    } satisfies Record<ProgressCircularSize, string>,
  },
})

const progressCircleCVA = cva('', {
  variants: {
    size: {
      'icon-lg': '[--size:1.25rem] [--thickness:calc(var(--size)/5)]',
      'icon-md': '[--size:0.94rem] [--thickness:calc(var(--size)/5)]',
      'icon-sm': '[--size:0.785rem] [--thickness:calc(var(--size)/5)]',
      lg: '[--size:5rem] [--thickness:calc(var(--size)/11)]',
      md: '[--size:4rem] [--thickness:calc(var(--size)/11)]',
      sm: '[--size:3rem] [--thickness:calc(var(--size)/11)]',
    } satisfies Record<ProgressCircularSize, string>,
  },
})

const progressCircleTrackCVA = cva('', {
  variants: {
    intent: {
      accent: 'stroke-accent-fill-subtle',
      neutral: 'stroke-neutral-fill-subtle',
      primary: 'stroke-primary-fill-subtle',
      secondary: 'stroke-secondary-fill-subtle',
    } satisfies Record<ProgressIntent, string>,
  },
})

const progressCircleRangeCVA = cva('[transition-[stroke-dasharray,stroke] ease-out] duration-600', {
  variants: {
    intent: {
      accent: 'stroke-accent-fill',
      neutral: 'stroke-neutral-fill',
      primary: 'stroke-primary-fill',
      secondary: 'stroke-secondary-fill',
    } satisfies Record<ProgressIntent, string>,
  },
})

const progressCircleValueTextCVA = cva('absolute text-right font-mono tabular-nums', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    } satisfies Record<ProgressIntent, string>,
    size: {
      'icon-lg': 'hidden',
      'icon-md': 'hidden',
      'icon-sm': 'hidden',
      lg: 'txt-base',
      md: 'txt-caption',
      sm: 'txt-small',
    } satisfies Record<ProgressCircularSize, string>,
  },
})

interface UIProgressCircularSlots {
  circle?: ClassValue
  label?: ClassValue
  track?: ClassValue
  range?: ClassValue
  root?: ClassValue
  valueText?: ClassValue
}

interface UIProgressCircularProps
  extends ArkProgressRootBaseProps, Omit<ArkProgressRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useProgress()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseProgressReturn['value']
  label?: string
  intent?: ProgressIntent
  size?: ProgressCircularSize
  ui?: Partial<UIProgressCircularSlots>
}

const modelValue = defineModel<number>({ default: null })

const props = withDefaults(defineProps<UIProgressCircularProps>(), {
  intent: 'neutral',
  label: '',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const { locale } = useI18n()

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkProgress.RootProvider : ArkProgress.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  return {
    ...pick(props, [
      'asChild',
      'defaultValue',
      'formatOptions',
      'id',
      'ids',
      'max',
      'min',
      'orientation',
      'translations',
    ] as const),
    locale: locale.value,
  }
})

extendCompodiumMeta({
  defaultProps: {
    label: 'Loading...',
  },
})
</script>

<template>
  <component
    :is="rootComponent"
    v-bind="
      isProvider
        ? rootProps
        : {
            ...rootProps,
            modelValue: modelValue,
            'onUpdate:modelValue': (v: number) => (modelValue = v),
          }
    "
    :class="cn(progressCircleRootCVA({ intent, size }), ui?.root)"
  >
    <ArkProgress.Label :class="cn(progressCircleLabelCVA({ intent, size }), ui?.label)">
      {{ $te(label) ? $t(label) : label }}
    </ArkProgress.Label>

    <div class="relative inline-flex items-center justify-center">
      <ArkProgress.Circle :class="cn(progressCircleCVA({ size }), ui?.circle)">
        <ArkProgress.CircleTrack :class="cn(progressCircleTrackCVA({ intent }), ui?.track)" />
        <ArkProgress.CircleRange :class="cn(progressCircleRangeCVA({ intent }), ui?.range)" />
      </ArkProgress.Circle>
      <ArkProgress.ValueText
        :class="cn(progressCircleValueTextCVA({ intent, size }), ui?.valueText)"
      />
    </div>
  </component>
</template>

<style scoped>
@keyframes circle-range-indeterminate {
  0% {
    stroke-dasharray: calc(var(--circumference) / 2) calc(var(--circumference) / 2);
    stroke-dashoffset: 0;
  }

  100% {
    stroke-dasharray: calc(var(--circumference) / 2) calc(var(--circumference) / 2);
    stroke-dashoffset: calc(var(--circumference) * -1);
  }
}

:deep([data-part='circle-range'][data-state='indeterminate']) {
  animation: circle-range-indeterminate 1500ms linear infinite;
}
</style>
