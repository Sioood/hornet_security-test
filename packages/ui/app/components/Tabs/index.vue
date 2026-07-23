<script setup lang="ts">
import {
  type TabsRootBaseProps as ArkTabsRootBaseProps,
  type TabsRootProviderBaseProps as ArkTabsRootProviderBaseProps,
  type UseTabsReturn,
} from '@ark-ui/vue/tabs'

import {
  type TabsIntent,
  type TabsSize,
  type TabsTriggerLayout,
  type TabsVariant,
  type UITabOption,
} from '~/utils/Components/Tabs/context'
import { tabsOptionIconCVA, tabsOptionLabelCVA } from '~/utils/Components/Tabs/variants'

import type { UITabsRootSlots } from './Root.vue'
import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

export type { UITabOption } from '~/utils/Components/Tabs/context'

export interface UITabsSlots extends UITabsRootSlots {
  list?: ClassValue
  indicator?: ClassValue
  trigger?: ClassValue
  content?: ClassValue
}

/**
 * High-level Tabs component.
 *
 * Automates rendering of list, triggers (with optional icons), indicator, and content panels
 * from the `options` prop.
 *
 * Set `render-content` to `false` for router-driven navigation (triggers only).
 * Use `trigger-layout="stacked"` for mobile-style icon-above-label triggers.
 *
 * For full control, use `<UITabsRoot>` with `<UITabsList>`, `<UITabsTrigger>`, etc.
 */
export interface TabsProps
  extends ArkTabsRootBaseProps, Omit<ArkTabsRootProviderBaseProps, 'value'> {
  value?: UseTabsReturn['value']
  variant?: TabsVariant
  intent?: TabsIntent
  size?: TabsSize
  triggerLayout?: TabsTriggerLayout
  options?: UITabOption[]
  /** When `false`, content panels are not rendered (e.g. route changes replace the page). */
  renderContent?: boolean
  /** Teleport all option content panels when `contentPortalled` is `true`. */
  contentPortalled?: boolean
  contentTeleportTo?: string
  ui?: Partial<UITabsSlots>
}

const modelValue = defineModel<string>()

const props = withDefaults(defineProps<TabsProps>(), {
  contentPortalled: false,
  contentTeleportTo: 'body',
  intent: 'primary',
  options: () => [],
  orientation: 'horizontal',
  renderContent: true,
  size: 'md',
  triggerLayout: 'inline',
  ui: undefined,
  value: undefined,
  variant: 'line',
})

const resolvedOptions = computed(() => (props.options.length > 0 ? props.options : []))

const hasLinkOptions = computed(() =>
  resolvedOptions.value.some((option) => option.to !== undefined && option.to !== null),
)

/** Fallback when Ark runs `navigateIfNeeded` (e.g. keyboard). Clicks use `navigateTo` on the anchor. */
function onRouterTabNavigate(details: { href: string }) {
  if (details.href.startsWith('http')) return
  void navigateTo(details.href)
}

const rootProps = computed(() => {
  const {
    contentPortalled: _contentPortalled,
    contentTeleportTo: _contentTeleportTo,
    options: _options,
    renderContent: _renderContent,
    ui: _ui,
    ...rest
  } = props

  if (hasLinkOptions.value && rest.navigate === undefined) {
    return { ...rest, navigate: onRouterTabNavigate }
  }

  return rest
})

const optionIconClass = computed(() => tabsOptionIconCVA({ size: props.size }))

function resolveTriggerLayout(option: UITabOption): TabsTriggerLayout {
  return option.triggerLayout ?? props.triggerLayout
}

function resolveOptionLabel(option: UITabOption): string | undefined {
  if (option.hideLabel) return undefined
  return option.label ?? option.value
}

const shouldRenderAutoContent = computed(
  () => props.renderContent && resolvedOptions.value.length > 0,
)

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    modelValue: 'react',
    options: [
      { icon: 'tabler:brand-react', label: 'React', value: 'react' },
      { label: 'Solid', value: 'solid' },
      { icon: 'tabler:brand-svelte', label: 'Svelte', value: 'svelte' },
      { icon: 'tabler:brand-vue', label: 'Vue', value: 'vue' },
    ],
    orientation: 'horizontal',
    size: 'md',
    triggerLayout: 'inline',
    variant: 'line',
  },
})
</script>

<template>
  <UITabsRoot v-bind="{ ...rootProps, ...attrs }" v-model="modelValue" :ui="{ root: ui?.root }">
    <UITabsList :ui="{ root: ui?.list }">
      <template v-if="resolvedOptions.length > 0">
        <UITabsTrigger
          v-for="option in resolvedOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
          :to="option.to"
          :trigger-layout="resolveTriggerLayout(option)"
          :ui="{ root: ui?.trigger }"
        >
          <Icon v-if="option.icon" :name="option.icon" :class="optionIconClass" />
          <span
            v-if="resolveOptionLabel(option)"
            :class="tabsOptionLabelCVA({ triggerLayout: resolveTriggerLayout(option) })"
          >
            {{ resolveOptionLabel(option) }}
          </span>
        </UITabsTrigger>
      </template>

      <slot name="list" />

      <UITabsIndicator :ui="{ root: ui?.indicator }" />
    </UITabsList>

    <template v-if="shouldRenderAutoContent">
      <UITabsContent
        v-for="option in resolvedOptions"
        :key="option.value"
        :value="option.value"
        :portalled="contentPortalled"
        :teleport-to="contentTeleportTo"
        :ui="{ root: ui?.content }"
      >
        <slot :name="`content-${option.value}`">
          Content for {{ option.label ?? option.value }}
        </slot>
      </UITabsContent>
    </template>

    <slot />
  </UITabsRoot>
</template>
