<script setup lang="ts">
import { cva } from 'class-variance-authority'

import type { NuxtLinkProps } from '#app'
import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

type linkIntent = 'primary' | 'secondary' | 'accent' | 'info' | 'warning' | 'error' | 'neutral'
type linkVariant = 'default' | 'ghost'

const linkCVA = cva('w-fit', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      error: 'text-error-text',
      info: 'text-info-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
      warning: 'text-warning-text',
    } satisfies Record<linkIntent, string>,
    variant: {
      default: 'underline',
      ghost: 'hover:underline',
    } satisfies Record<linkVariant, string>,
  },
})

interface LinkProps extends /* @vue-ignore */ Omit<NuxtLinkProps, 'custom'> {
  to?: NuxtLinkProps['to']
  external?: boolean
  target?: string
  rel?: string
  custom?: boolean
  styled?: boolean
  intent?: linkIntent
  variant?: linkVariant
  ui?: {
    root?: ClassValue
  }
}

const props = withDefaults(defineProps<LinkProps>(), {
  custom: false,
  intent: 'accent',
  rel: undefined,
  styled: true,
  target: undefined,
  to: undefined,
  ui: undefined,
  variant: 'default',
})
const config = useRuntimeConfig()

const isExternal = computed(() => {
  if (props.external) return true
  const url = props.to?.toString()
  const { siteUrl } = config.public
  if (siteUrl && url?.startsWith(siteUrl)) return false
  return url?.startsWith('http')
})

const linkTarget = computed(() => props.target || (isExternal.value ? '_blank' : undefined))
const linkRel = computed(() => props.rel || (isExternal.value ? 'noopener noreferrer' : undefined))

const linkClass = computed(() =>
  cn(
    props.styled
      ? cn(linkCVA({ intent: props.intent, variant: props.variant }), props.ui?.root)
      : cn(props.ui?.root),
  ),
)

const href = computed(() => {
  const { to } = props
  if (typeof to === 'string') return to
  return to?.toString() ?? ''
})
</script>

<template>
  <a
    v-if="isExternal && !props.custom"
    :href="href"
    :target="linkTarget"
    :rel="linkRel"
    :class="linkClass"
  >
    <slot>{{ to }}</slot>
  </a>
  <nuxt-link
    v-else-if="!props.custom"
    v-bind="{
      ...props,
      target: linkTarget,
      rel: linkRel,
      class: linkClass,
    }"
  >
    <slot>{{ to }}</slot>
  </nuxt-link>
  <slot v-else v-bind="{ ...props, target: linkTarget, rel: linkRel, class: linkClass }">
    <span :class="linkClass">{{ to }}</span>
  </slot>
</template>
