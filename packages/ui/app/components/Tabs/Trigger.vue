<script setup lang="ts">
import { TabTrigger, type TabTriggerBaseProps } from '@ark-ui/vue/tabs'

import { segmentedItemCVA } from '~/utils/Components/Segmented/variants'
import {
  tabsChromeKey,
  type TabsIntent,
  type TabsSize,
  type TabsTriggerLayout,
} from '~/utils/Components/Tabs/context'
import { tabsTriggerLayoutCVA } from '~/utils/Components/Tabs/variants'

import type { NuxtLinkProps } from '#app'
import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITabsTriggerSlots {
  root?: ClassValue
}

export interface TabsTriggerProps extends TabTriggerBaseProps {
  intent?: TabsIntent
  size?: TabsSize
  triggerLayout?: TabsTriggerLayout
  /** Renders an anchor (`asChild`) and navigates with `navigateTo` (SPA, no full reload). */
  to?: NuxtLinkProps['to']
  target?: string
  external?: boolean
  ui?: Partial<UITabsTriggerSlots>
}

const props = withDefaults(defineProps<TabsTriggerProps>(), {
  disabled: undefined,
  external: undefined,
  intent: undefined,
  size: undefined,
  target: undefined,
  to: undefined,
  triggerLayout: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const config = useRuntimeConfig()
const router = useRouter()

const chrome = inject(tabsChromeKey, null)

const intent = computed<TabsIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TabsSize>(() => props.size ?? chrome?.size.value ?? 'md')
const listOrientation = computed(() => chrome?.orientation.value ?? 'horizontal')
const variant = computed(() => chrome?.variant.value ?? 'line')
const triggerLayout = computed<TabsTriggerLayout>(
  () => props.triggerLayout ?? chrome?.triggerLayout.value ?? 'inline',
)
const isDisabled = computed(() => props.disabled ?? false)

/** Stacked triggers always use the horizontal item base; list orientation stays on the root. */
const itemOrientation = computed(() =>
  triggerLayout.value === 'stacked' ? 'horizontal' : listOrientation.value,
)

const triggerProps = computed(() => pick(props, ['asChild', 'disabled', 'value'] as const))
const triggerAttrs = computed(() => splitArkAttrs(attrs))
const usesLink = computed(() => props.to !== undefined && props.to !== null)

const isExternalLink = computed(() => {
  if (props.external) return true
  const url = props.to?.toString()
  const { siteUrl } = config.public
  if (siteUrl && url?.startsWith(siteUrl)) return false
  return url?.startsWith('http')
})

const linkTarget = computed(() => props.target || (isExternalLink.value ? '_blank' : undefined))
const linkRel = computed(() => (linkTarget.value === '_blank' ? 'noopener noreferrer' : undefined))

const linkHref = computed(() => {
  const { to } = props
  if (typeof to === 'string') return to
  return to?.toString() ?? ''
})

const anchorHref = computed(() => {
  if (!usesLink.value) return ''
  if (isExternalLink.value) return linkHref.value
  return router.resolve(props.to!).href
})

const triggerClass = computed(() =>
  cn(
    segmentedItemCVA({
      disabled: isDisabled.value,
      intent: intent.value,
      orientation: itemOrientation.value,
      size: size.value,
      variant: variant.value,
    }),
    tabsTriggerLayoutCVA({ triggerLayout: triggerLayout.value }),
    props.ui?.root,
  ),
)

function onInternalLinkClick(event: MouseEvent) {
  if (isDisabled.value) return
  event.preventDefault()
  void navigateTo(props.to!)
}

extendCompodiumMeta({
  defaultProps: {
    value: 'react',
  },
})
</script>

<template>
  <TabTrigger v-if="!usesLink" v-bind="{ ...triggerProps, ...triggerAttrs }" :class="triggerClass">
    <slot />
  </TabTrigger>

  <TabTrigger
    v-else-if="isExternalLink"
    v-bind="{ ...triggerProps, ...triggerAttrs, asChild: true }"
  >
    <a :href="linkHref" :target="linkTarget" :rel="linkRel" :class="triggerClass">
      <slot />
    </a>
  </TabTrigger>

  <TabTrigger v-else v-bind="{ ...triggerProps, ...triggerAttrs, asChild: true }">
    <a :href="anchorHref" :class="triggerClass" @click.prevent="onInternalLinkClick">
      <slot />
    </a>
  </TabTrigger>
</template>
