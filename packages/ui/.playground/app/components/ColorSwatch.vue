<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

type BaseColors = 'primary' | 'secondary' | 'accent'

type SemanticColors = 'neutral' | 'info' | 'success' | 'warning' | 'error'

type PrimariesColors = 'purple' | 'green' | 'orange' | 'red' | 'gray' | 'yellow' | 'blue' | 'pink'

type Colors = BaseColors & SemanticColors & PrimariesColors

const bg50CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-50',
      blue: 'bg-blue-50',
      error: 'bg-error-50',
      gray: 'bg-gray-50',
      green: 'bg-green-50',
      info: 'bg-info-50',
      neutral: 'bg-neutral-50',
      orange: 'bg-orange-50',
      pink: 'bg-pink-50',
      primary: 'bg-primary-50',
      purple: 'bg-purple-50',
      red: 'bg-red-50',
      secondary: 'bg-secondary-50',
      success: 'bg-success-50',
      warning: 'bg-warning-50',
      yellow: 'bg-yellow-50',
    } satisfies Record<Colors, string>,
  },
})

const bg100CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-100',
      blue: 'bg-blue-100',
      error: 'bg-error-100',
      gray: 'bg-gray-100',
      green: 'bg-green-100',
      info: 'bg-info-100',
      neutral: 'bg-neutral-100',
      orange: 'bg-orange-100',
      pink: 'bg-pink-100',
      primary: 'bg-primary-100',
      purple: 'bg-purple-100',
      red: 'bg-red-100',
      secondary: 'bg-secondary-100',
      success: 'bg-success-100',
      warning: 'bg-warning-100',
      yellow: 'bg-yellow-100',
    } satisfies Record<Colors, string>,
  },
})

const bg200CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-200',
      blue: 'bg-blue-200',
      error: 'bg-error-200',
      gray: 'bg-gray-200',
      green: 'bg-green-200',
      info: 'bg-info-200',
      neutral: 'bg-neutral-200',
      orange: 'bg-orange-200',
      pink: 'bg-pink-200',
      primary: 'bg-primary-200',
      purple: 'bg-purple-200',
      red: 'bg-red-200',
      secondary: 'bg-secondary-200',
      success: 'bg-success-200',
      warning: 'bg-warning-200',
      yellow: 'bg-yellow-200',
    } satisfies Record<Colors, string>,
  },
})

const bg300CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-300',
      blue: 'bg-blue-300',
      error: 'bg-error-300',
      gray: 'bg-gray-300',
      green: 'bg-green-300',
      info: 'bg-info-300',
      neutral: 'bg-neutral-300',
      orange: 'bg-orange-300',
      pink: 'bg-pink-300',
      primary: 'bg-primary-300',
      purple: 'bg-purple-300',
      red: 'bg-red-300',
      secondary: 'bg-secondary-300',
      success: 'bg-success-300',
      warning: 'bg-warning-300',
      yellow: 'bg-yellow-300',
    } satisfies Record<Colors, string>,
  },
})

const bg400CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-400',
      blue: 'bg-blue-400',
      error: 'bg-error-400',
      gray: 'bg-gray-400',
      green: 'bg-green-400',
      info: 'bg-info-400',
      neutral: 'bg-neutral-400',
      orange: 'bg-orange-400',
      pink: 'bg-pink-400',
      primary: 'bg-primary-400',
      purple: 'bg-purple-400',
      red: 'bg-red-400',
      secondary: 'bg-secondary-400',
      success: 'bg-success-400',
      warning: 'bg-warning-400',
      yellow: 'bg-yellow-400',
    } satisfies Record<Colors, string>,
  },
})

const bg500CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-500',
      blue: 'bg-blue-500',
      error: 'bg-error-500',
      gray: 'bg-gray-500',
      green: 'bg-green-500',
      info: 'bg-info-500',
      neutral: 'bg-neutral-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      primary: 'bg-primary-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      secondary: 'bg-secondary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      yellow: 'bg-yellow-500',
    } satisfies Record<Colors, string>,
  },
})

const bg600CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-600',
      blue: 'bg-blue-600',
      error: 'bg-error-600',
      gray: 'bg-gray-600',
      green: 'bg-green-600',
      info: 'bg-info-600',
      neutral: 'bg-neutral-600',
      orange: 'bg-orange-600',
      pink: 'bg-pink-600',
      primary: 'bg-primary-600',
      purple: 'bg-purple-600',
      red: 'bg-red-600',
      secondary: 'bg-secondary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      yellow: 'bg-yellow-600',
    } satisfies Record<Colors, string>,
  },
})

const bg700CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-700',
      blue: 'bg-blue-700',
      error: 'bg-error-700',
      gray: 'bg-gray-700',
      green: 'bg-green-700',
      info: 'bg-info-700',
      neutral: 'bg-neutral-700',
      orange: 'bg-orange-700',
      pink: 'bg-pink-700',
      primary: 'bg-primary-700',
      purple: 'bg-purple-700',
      red: 'bg-red-700',
      secondary: 'bg-secondary-700',
      success: 'bg-success-700',
      warning: 'bg-warning-700',
      yellow: 'bg-yellow-700',
    } satisfies Record<Colors, string>,
  },
})

const bg800CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-800',
      blue: 'bg-blue-800',
      error: 'bg-error-800',
      gray: 'bg-gray-800',
      green: 'bg-green-800',
      info: 'bg-info-800',
      neutral: 'bg-neutral-800',
      orange: 'bg-orange-800',
      pink: 'bg-pink-800',
      primary: 'bg-primary-800',
      purple: 'bg-purple-800',
      red: 'bg-red-800',
      secondary: 'bg-secondary-800',
      success: 'bg-success-800',
      warning: 'bg-warning-800',
      yellow: 'bg-yellow-800',
    } satisfies Record<Colors, string>,
  },
})

const bg900CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-900',
      blue: 'bg-blue-900',
      error: 'bg-error-900',
      gray: 'bg-gray-900',
      green: 'bg-green-900',
      info: 'bg-info-900',
      neutral: 'bg-neutral-900',
      orange: 'bg-orange-900',
      pink: 'bg-pink-900',
      primary: 'bg-primary-900',
      purple: 'bg-purple-900',
      red: 'bg-red-900',
      secondary: 'bg-secondary-900',
      success: 'bg-success-900',
      warning: 'bg-warning-900',
      yellow: 'bg-yellow-900',
    } satisfies Record<Colors, string>,
  },
})

const bg950CVA = cva('', {
  variants: {
    color: {
      accent: 'bg-accent-950',
      blue: 'bg-blue-950',
      error: 'bg-error-950',
      gray: 'bg-gray-950',
      green: 'bg-green-950',
      info: 'bg-info-950',
      neutral: 'bg-neutral-950',
      orange: 'bg-orange-950',
      pink: 'bg-pink-950',
      primary: 'bg-primary-950',
      purple: 'bg-purple-950',
      red: 'bg-red-950',
      secondary: 'bg-secondary-950',
      success: 'bg-success-950',
      warning: 'bg-warning-950',
      yellow: 'bg-yellow-950',
    } satisfies Record<Colors, string>,
  },
})

const textDefaultCVA = cva('text-neutral-text')

const text50CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-50',
      blue: 'text-blue-50',
      error: 'text-error-50',
      gray: 'text-gray-50',
      green: 'text-green-50',
      info: 'text-info-50',
      neutral: 'text-neutral-50',
      orange: 'text-orange-50',
      pink: 'text-pink-50',
      primary: 'text-primary-50',
      purple: 'text-purple-50',
      red: 'text-red-50',
      secondary: 'text-secondary-50',
      success: 'text-success-50',
      warning: 'text-warning-50',
      yellow: 'text-yellow-50',
    } satisfies Record<Colors, string>,
  },
})

const text100CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-100',
      blue: 'text-blue-100',
      error: 'text-error-100',
      gray: 'text-gray-100',
      green: 'text-green-100',
      info: 'text-info-100',
      neutral: 'text-neutral-100',
      orange: 'text-orange-100',
      pink: 'text-pink-100',
      primary: 'text-primary-100',
      purple: 'text-purple-100',
      red: 'text-red-100',
      secondary: 'text-secondary-100',
      success: 'text-success-100',
      warning: 'text-warning-100',
      yellow: 'text-yellow-100',
    } satisfies Record<Colors, string>,
  },
})

const text200CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-200',
      blue: 'text-blue-200',
      error: 'text-error-200',
      gray: 'text-gray-200',
      green: 'text-green-200',
      info: 'text-info-200',
      neutral: 'text-neutral-200',
      orange: 'text-orange-200',
      pink: 'text-pink-200',
      primary: 'text-primary-200',
      purple: 'text-purple-200',
      red: 'text-red-200',
      secondary: 'text-secondary-200',
      success: 'text-success-200',
      warning: 'text-warning-200',
      yellow: 'text-yellow-200',
    } satisfies Record<Colors, string>,
  },
})

const text300CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-300',
      blue: 'text-blue-300',
      error: 'text-error-300',
      gray: 'text-gray-300',
      green: 'text-green-300',
      info: 'text-info-300',
      neutral: 'text-neutral-300',
      orange: 'text-orange-300',
      pink: 'text-pink-300',
      primary: 'text-primary-300',
      purple: 'text-purple-300',
      red: 'text-red-300',
      secondary: 'text-secondary-300',
      success: 'text-success-300',
      warning: 'text-warning-300',
      yellow: 'text-yellow-300',
    } satisfies Record<Colors, string>,
  },
})

const text400CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-400',
      blue: 'text-blue-400',
      error: 'text-error-400',
      gray: 'text-gray-400',
      green: 'text-green-400',
      info: 'text-info-400',
      neutral: 'text-neutral-400',
      orange: 'text-orange-400',
      pink: 'text-pink-400',
      primary: 'text-primary-400',
      purple: 'text-purple-400',
      red: 'text-red-400',
      secondary: 'text-secondary-400',
      success: 'text-success-400',
      warning: 'text-warning-400',
      yellow: 'text-yellow-400',
    } satisfies Record<Colors, string>,
  },
})

const text600CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-600',
      blue: 'text-blue-600',
      error: 'text-error-600',
      gray: 'text-gray-600',
      green: 'text-green-600',
      info: 'text-info-600',
      neutral: 'text-neutral-600',
      orange: 'text-orange-600',
      pink: 'text-pink-600',
      primary: 'text-primary-600',
      purple: 'text-purple-600',
      red: 'text-red-600',
      secondary: 'text-secondary-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      yellow: 'text-yellow-600',
    } satisfies Record<Colors, string>,
  },
})

const text700CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-700',
      blue: 'text-blue-700',
      error: 'text-error-700',
      gray: 'text-gray-700',
      green: 'text-green-700',
      info: 'text-info-700',
      neutral: 'text-neutral-700',
      orange: 'text-orange-700',
      pink: 'text-pink-700',
      primary: 'text-primary-700',
      purple: 'text-purple-700',
      red: 'text-red-700',
      secondary: 'text-secondary-700',
      success: 'text-success-700',
      warning: 'text-warning-700',
      yellow: 'text-yellow-700',
    } satisfies Record<Colors, string>,
  },
})

const text800CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-800',
      blue: 'text-blue-800',
      error: 'text-error-800',
      gray: 'text-gray-800',
      green: 'text-green-800',
      info: 'text-info-800',
      neutral: 'text-neutral-800',
      orange: 'text-orange-800',
      pink: 'text-pink-800',
      primary: 'text-primary-800',
      purple: 'text-purple-800',
      red: 'text-red-800',
      secondary: 'text-secondary-800',
      success: 'text-success-800',
      warning: 'text-warning-800',
      yellow: 'text-yellow-800',
    } satisfies Record<Colors, string>,
  },
})

const text900CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-900',
      blue: 'text-blue-900',
      error: 'text-error-900',
      gray: 'text-gray-900',
      green: 'text-green-900',
      info: 'text-info-900',
      neutral: 'text-neutral-900',
      orange: 'text-orange-900',
      pink: 'text-pink-900',
      primary: 'text-primary-900',
      purple: 'text-purple-900',
      red: 'text-red-900',
      secondary: 'text-secondary-900',
      success: 'text-success-900',
      warning: 'text-warning-900',
      yellow: 'text-yellow-900',
    } satisfies Record<Colors, string>,
  },
})

const text950CVA = cva('', {
  variants: {
    color: {
      accent: 'text-accent-950',
      blue: 'text-blue-950',
      error: 'text-error-950',
      gray: 'text-gray-950',
      green: 'text-green-950',
      info: 'text-info-950',
      neutral: 'text-neutral-950',
      orange: 'text-orange-950',
      pink: 'text-pink-950',
      primary: 'text-primary-950',
      purple: 'text-purple-950',
      red: 'text-red-950',
      secondary: 'text-secondary-950',
      success: 'text-success-950',
      warning: 'text-warning-950',
      yellow: 'text-yellow-950',
    } satisfies Record<Colors, string>,
  },
})

const conicCVA = cva('', {
  variants: {
    color: {
      accent: 'bg-conic from-accent-900 to-accent-400',
      blue: 'bg-conic from-blue-900 to-blue-400',
      error: 'bg-conic from-error-900 to-error-400',
      gray: 'bg-conic from-gray-900 to-gray-400',
      green: 'bg-conic from-green-900 to-green-400',
      info: 'bg-conic from-info-900 to-info-400',
      neutral: 'bg-conic from-neutral-900 to-neutral-400',
      orange: 'bg-conic from-orange-900 to-orange-400',
      pink: 'bg-conic from-pink-900 to-pink-400',
      primary: 'bg-conic from-primary-900 to-primary-400',
      purple: 'bg-conic from-purple-900 to-purple-400',
      red: 'bg-conic from-red-900 to-red-400',
      secondary: 'bg-conic from-secondary-900 to-secondary-400',
      success: 'bg-conic from-success-900 to-success-400',
      warning: 'bg-conic from-warning-900 to-warning-400',
      yellow: 'bg-conic from-yellow-900 to-yellow-400',
    } satisfies Record<Colors, string>,
  },
})

const blurCVA = cva('', {
  variants: {
    color: {
      accent: 'bg-primary-400',
      blue: 'bg-primary-400',
      error: 'bg-primary-400',
      gray: 'bg-primary-400',
      green: 'bg-primary-400',
      info: 'bg-primary-400',
      neutral: 'bg-primary-400',
      orange: 'bg-primary-400',
      pink: 'bg-primary-400',
      primary: 'bg-accent-400',
      purple: 'bg-primary-400',
      red: 'bg-primary-400',
      secondary: 'bg-primary-400',
      success: 'bg-primary-400',
      warning: 'bg-primary-400',
      yellow: 'bg-primary-400',
    } satisfies Record<Colors, string>,
  },
})

const gradientCVA = cva('', {
  variants: {
    color: {
      accent: 'bg-gradient-to-b from-accent-900 to-accent-400',
      blue: 'bg-gradient-to-b from-blue-900 to-blue-400',
      error: 'bg-gradient-to-b from-error-900 to-error-400',
      gray: 'bg-gradient-to-b from-gray-900 to-gray-400',
      green: 'bg-gradient-to-b from-green-900 to-green-400',
      info: 'bg-gradient-to-b from-info-900 to-info-400',
      neutral: 'bg-gradient-to-b from-neutral-900 to-neutral-400',
      orange: 'bg-gradient-to-b from-orange-900 to-orange-400',
      pink: 'bg-gradient-to-b from-pink-900 to-pink-400',
      primary: 'bg-gradient-to-b from-primary-900 to-primary-400',
      purple: 'bg-gradient-to-b from-purple-900 to-purple-400',
      red: 'bg-gradient-to-b from-red-900 to-red-400',
      secondary: 'bg-gradient-to-b from-secondary-900 to-secondary-400',
      success: 'bg-gradient-to-b from-success-900 to-success-400',
      warning: 'bg-gradient-to-b from-warning-900 to-warning-400',
      yellow: 'bg-gradient-to-b from-yellow-900 to-yellow-400',
    } satisfies Record<Colors, string>,
  },
})

type colorVariants = VariantProps<typeof bg50CVA>['color']

const props = withDefaults(
  defineProps<{
    color?: colorVariants
    type?: 'base' | 'semantic' | 'primaries'
  }>(),
  {
    color: 'primary',
    type: 'base',
  },
)

const colorScales = [
  { CVA: { bg: bg50CVA, text: text950CVA }, tokens: ['bg-subtle', 'on-fill'], value: 50 },
  {
    CVA: { bg: bg100CVA, text: text900CVA },
    tokens: ['bg', 'fill-inverse', 'text-inverse', 'icon-inverse'],
    value: 100,
  },
  {
    CVA: { bg: bg200CVA, text: text800CVA },
    tokens: [
      'surface-subtle',
      'fill-inverse-hover',
      'border-inverse',
      'text-inverse',
      'icon-inverse',
    ],
    value: 200,
  },
  {
    CVA: { bg: bg300CVA, text: text700CVA },
    tokens: [
      'surface',
      'fill-subtle',
      'fill-inverse-active',
      'border-inverse-hover',
      'text-subtle',
      'text-inverse',
      'icon-subtle',
      'icon-inverse',
    ],
    value: 300,
  },
  {
    CVA: { bg: bg400CVA, text: text600CVA },
    tokens: [
      'fill-subtle-hover',
      'border-subtle',
      'border-inverse-active',
      'text-disabled',
      'icon',
      'icon-disabled',
    ],
    value: 400,
  },
  {
    CVA: { bg: bg500CVA, text: textDefaultCVA },
    tokens: [
      'fill-subtle-active',
      'border-subtle-hover',
      'text-subtle',
      'text-muted',
      'icon-subtle',
    ],
    value: 500,
  },
  {
    CVA: { bg: bg600CVA, text: text400CVA },
    tokens: ['fill', 'fill-hover', 'border-subtle-active', 'border', 'icon-subtle', 'icon-inverse'],
    value: 600,
  },
  {
    CVA: { bg: bg700CVA, text: text300CVA },
    tokens: ['fill-active', 'border-hover', 'border-inverse', 'text', 'icon', 'on-fill'],
    value: 700,
  },
  {
    CVA: { bg: bg800CVA, text: text200CVA },
    tokens: ['surface-inverse', 'border-active', 'border-strong', 'text-inverse', 'icon-inverse'],
    value: 800,
  },
  {
    CVA: { bg: bg900CVA, text: text100CVA },
    tokens: ['bg-inverse', 'border-strong-hover', 'text', 'icon'],
    value: 900,
  },
  {
    CVA: { bg: bg950CVA, text: text50CVA },
    tokens: ['border-strong-active'],
    value: 950,
  },
] as const

function tokensForScale(triggerValue: string | null) {
  if (!triggerValue) return []
  const scale = colorScales.find((entry) => String(entry.value) === triggerValue)
  return scale ? [...scale.tokens] : []
}
</script>

<template>
  <div :class="cn('txt-caption inline-flex font-mono uppercase', textDefaultCVA())">
    <div class="relative z-1 aspect-9/13.5 min-w-87.5 bg-primary-300">
      <div class="flex flex-row-reverse flex-wrap">
        <div
          :class="
            cn('flex aspect-square w-1/2 flex-col items-end justify-end p-2', bg100CVA({ color }))
          "
        >
          <span>100</span>
        </div>
        <div
          :class="cn('flex aspect-square w-1/2 flex-col justify-between p-2', bg500CVA({ color }))"
        >
          <div class="flex flex-col">
            <span>{{ `colours [${type}]` }}</span>
            <span>{{ color }}</span>
            <span>50/950</span>
          </div>
          <span>500</span>
        </div>
        <div
          :class="
            cn('flex aspect-square w-1/2 flex-col-reverse items-end p-2', bg900CVA({ color }))
          "
        >
          900
        </div>
      </div>

      <div
        :class="
          cn(
            'absolute bottom-0 -z-1 flex aspect-square w-full flex-col-reverse p-2',
            gradientCVA({ color }),
          )
        "
      >
        600 -> 100
      </div>

      <div
        :class="
          cn(
            'absolute top-1/3 left-1/2 aspect-square w-3/7 -translate-x-1/2 -translate-y-3/7 rotate-180 rounded-full',
            conicCVA({ color }),
          )
        "
      />

      <div
        :class="
          cn(
            'absolute top-2/3 left-1/2 aspect-square w-1/3 -translate-x-1/2 -translate-y-1/3 rotate-180 rounded-full blur-md',
            blurCVA({ color }),
          )
        "
      />
    </div>

    <div class="flex aspect-9/13.5 min-w-87.5 flex-col bg-primary-100">
      <UITooltip
        class="flex min-h-0 flex-1 flex-col"
        :positioning="{ placement: 'top', gutter: 8 }"
        :open-delay="200"
      >
        <template #triggers="{ trigger: Trigger }">
          <div class="flex min-h-0 flex-1 flex-col">
            <component
              :is="Trigger"
              v-for="scale in colorScales"
              :key="scale.value"
              :value="String(scale.value)"
              :class="
                cn(
                  'flex flex-1 cursor-default items-end justify-between p-2',
                  scale.CVA.bg({ color }),
                  scale.CVA.text({ color }),
                )
              "
            >
              <span>{{ scale.value }}</span>
            </component>
          </div>
        </template>

        <template #content="{ triggerValue }">
          <div v-if="triggerValue" class="flex max-w-56 flex-col gap-1 normal-case">
            <span class="font-bold">{{ props.color }} · {{ triggerValue }}</span>
            <span
              v-for="token in tokensForScale(triggerValue)"
              :key="token"
              class="text-neutral-text-subtle"
            >
              {{ token }}
            </span>
          </div>
        </template>
      </UITooltip>
    </div>
  </div>
</template>
