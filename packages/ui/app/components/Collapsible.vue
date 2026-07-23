<script setup lang="ts">
import {
  Collapsible,
  type CollapsibleRootBaseProps as ArkCollapsibleRootBaseProps,
  type CollapsibleRootProviderBaseProps as ArkCollapsibleRootProviderBaseProps,
  type UseCollapsibleReturn,
} from '@ark-ui/vue/collapsible'
import { cva, type VariantProps } from 'class-variance-authority'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

type CollapsibleIntent = 'neutral'
type CollapsibleSize = 'md'

const collapsibleTriggerCVA = cva('flex w-full items-center justify-between text-left', {
  variants: {
    disabled: {
      false: 'cursor-pointer',
      true: 'cursor-not-allowed',
    },
    intent: {
      neutral: 'border-neutral-border text-neutral-text',
    } satisfies Record<CollapsibleIntent, string>,
    size: {
      md: 'txt-h6 gap-3 border-b p-1',
    } satisfies Record<CollapsibleSize, string>,
  },
})

const collapsibleTitleCVA = cva('', {
  variants: {
    size: {
      md: 'txt-h6',
    } satisfies Record<CollapsibleSize, string>,
  },
})

const collapsibleIndicatorCVA = cva(
  'flex shrink-0 items-center justify-center transition-transform duration-200 ease-out will-change-transform data-[state=open]:rotate-180',
  {
    variants: {
      size: {
        md: 'size-5',
      } satisfies Record<CollapsibleSize, string>,
    },
  },
)

const collapsibleIconCVA = cva('shrink-0', {
  variants: {
    size: {
      md: 'size-4',
    } satisfies Record<CollapsibleSize, string>,
  },
})

const collapsibleContentCVA = cva('overflow-hidden', {
  variants: {
    animated: {
      false: '',
      true: '',
    },
    size: {
      md: 'pt-2',
    } satisfies Record<CollapsibleSize, string>,
  },
})

type CollapsibleTriggerVariants = VariantProps<typeof collapsibleTriggerCVA>

interface UICollapsibleSlots {
  content?: ClassValue
  icon?: ClassValue
  indicator?: ClassValue
  title?: ClassValue
  trigger?: ClassValue
}

export interface CollapsibleProps
  extends ArkCollapsibleRootBaseProps, Omit<ArkCollapsibleRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useCollapsible()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseCollapsibleReturn['value']
  /** When false, panel height open/close animation is off (same effect as prefers-reduced-motion for content). */
  contentAnimated?: boolean
  /** Shown when the `#title` slot is empty. */
  heading?: string
  intent?: CollapsibleTriggerVariants['intent']
  ui?: Partial<UICollapsibleSlots>
  size?: CollapsibleTriggerVariants['size']
}

const modelValue = defineModel<boolean>({ required: false })

/**
 * Default `open` to `undefined` so Vue does not coerce absent Boolean props to `false` (controlled stuck closed).
 */
const props = withDefaults(defineProps<CollapsibleProps>(), {
  contentAnimated: true,
  heading: '',
  intent: 'neutral',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? Collapsible.RootProvider : Collapsible.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'lazyMount', 'unmountOnExit', 'value'] as const)
  }
  return pick(props, [
    'asChild',
    'collapsedHeight',
    'collapsedWidth',
    'defaultOpen',
    'disabled',
    'id',
    'ids',
    'lazyMount',
    'unmountOnExit',
  ] as const)
})

const attrs = useAttrs()
const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...arkAttrs.value,
    ...rootProps.value,
    class: arkAttrs.value.class,
  }

  if (!isProvider.value && modelValue.value !== undefined) {
    base.open = modelValue.value
    base['onUpdate:open'] = (next: boolean) => {
      modelValue.value = next
    }
  }

  return base
})

extendCompodiumMeta({
  defaultProps: {
    heading: 'Heading',
    intent: 'neutral',
    size: 'md',
  },
})
</script>

<template>
  <component :is="rootComponent" v-bind="rootBindings">
    <Collapsible.Trigger
      type="button"
      :class="cn(collapsibleTriggerCVA({ intent, size, disabled }), ui?.trigger)"
    >
      <span :class="cn(collapsibleTitleCVA({ size }))">
        <slot name="title">{{ heading }}</slot>
      </span>
      <Collapsible.Indicator :class="cn(collapsibleIndicatorCVA({ size }), ui?.indicator)">
        <Icon name="tabler:chevron-down" :class="cn(collapsibleIconCVA({ size }), ui?.icon)" />
      </Collapsible.Indicator>
    </Collapsible.Trigger>

    <Collapsible.Content
      :class="cn(collapsibleContentCVA({ size, animated: contentAnimated }), ui?.content)"
    >
      <slot />
    </Collapsible.Content>
  </component>
</template>

<style scoped>
/* Height from Ark inline --height / --collapsed-height (content animation guide) */
@keyframes collapsible-expand {
  from {
    height: var(--collapsed-height, 0);
  }

  to {
    height: var(--height);
  }
}

@keyframes collapsible-collapse {
  from {
    height: var(--height);
  }

  to {
    height: var(--collapsed-height, 0);
  }
}

:deep([data-part='content'][data-state='open']) {
  animation: collapsible-expand 150ms ease-out;
}

:deep([data-part='content'][data-state='closed']) {
  animation: collapsible-collapse 100ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  :deep([data-part='content'][data-state='open']),
  :deep([data-part='content'][data-state='closed']) {
    animation: none;
  }
}

:deep([data-part='content']--static[data-state='open']),
:deep([data-part='content']--static[data-state='closed']) {
  animation: none;
}
</style>
