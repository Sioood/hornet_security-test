<script setup lang="ts">
import {
  Menu as ArkMenu,
  type MenuRootBaseProps as ArkMenuRootBaseProps,
  type MenuRootProviderBaseProps as ArkMenuRootProviderBaseProps,
  type UseMenuReturn,
} from '@ark-ui/vue/menu'

import { buttonCVA } from '~/utils/Components/Button/variants'
import {
  menuCloseOnSelectKey,
  type MenuIntent,
  type MenuSize,
  type UIMenuSlots,
} from '~/utils/Components/Menu/context'
import { resolveEntryOnSelect } from '~/utils/Components/Menu/resolve-entry-on-select'
import {
  menuArrowCVA,
  menuArrowTipCVA,
  menuContentCVA,
  menuIndicatorCVA,
  menuUnstyledTriggerCVA,
} from '~/utils/Components/Menu/variants'

import type { MenuListEntry } from '~/utils/Components/Menu/entries'

type MenuSelectionDetails = { value: string }

export type {
  MenuCheckboxEntry,
  MenuGroupEntry,
  MenuItemEntry,
  MenuListEntry,
  MenuListEntryStrict,
  MenuRadioGroupEntry,
  MenuSeparatorEntry,
  MenuSubmenuEntry,
} from '~/utils/Components/Menu/entries'
export type { MenuIntent, MenuSize, UIMenuSlots } from '~/utils/Components/Menu/context'

type MenuTriggerValueSource = { triggerValue?: string | null }

function menuTriggerValue(menu: unknown): string | null {
  return (menu as MenuTriggerValueSource).triggerValue ?? null
}

defineOptions({ inheritAttrs: false })
const slots = useSlots()

export interface MenuProps
  extends ArkMenuRootBaseProps, Omit<ArkMenuRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useMenu()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model:open`.
   */
  value?: UseMenuReturn
  triggerText?: string
  contextTriggerText?: string
  intent?: MenuIntent
  size?: MenuSize
  showIndicator?: boolean
  showArrow?: boolean
  /**
   * Teleport the positioner to `teleportTo` (e.g. escape `overflow: hidden` in tables).
   * Prefer `false` when the trigger uses a custom slot (`#trigger` / `#triggers`) inside
   * transformed or scaled preview panels so floating-ui anchors correctly.
   * @default true
   */
  portalled?: boolean
  teleportTo?: string
  indicatorIcon?: string
  items?: MenuListEntry[]
  ui?: Partial<UIMenuSlots>
  /**
   * Skip default button styles on the built-in trigger.
   * Applied automatically when `#trigger`, `#triggers`, or `#context-trigger` slots are used.
   */
  unstyled?: boolean
}

/** Only bound when the consumer uses `v-model:open` (see `rootProps`). */
const open = defineModel<boolean>('open', { required: false })

const props = withDefaults(defineProps<MenuProps>(), {
  /** Zag defaults to `true`; Vue boolean props must be explicit or they coerce to `false`. */
  closeOnSelect: true,
  contextTriggerText: '',
  indicatorIcon: 'tabler:chevron-down',
  intent: 'neutral',
  items: () => [],
  portalled: true,
  positioning: () => ({ gutter: 8, placement: 'bottom-start' }),
  showArrow: false,
  showIndicator: true,
  size: 'md',
  teleportTo: 'body',
  triggerText: 'Actions',
  ui: undefined,
  unstyled: false,
  value: undefined,
})

const isProvider = computed(() => props.value !== undefined)

provide(
  menuCloseOnSelectKey,
  computed(() => props.closeOnSelect),
)

const rootComponent = computed(() => (isProvider.value ? ArkMenu.RootProvider : ArkMenu.Root))

function menuRootPropsWithoutUndefined<T extends Record<string, unknown>>(props: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined),
  ) as Partial<T>
}

const rootProps = computed(() => {
  if (isProvider.value) {
    return menuRootPropsWithoutUndefined(
      pick(props, ['asChild', 'closeOnSelect', 'lazyMount', 'unmountOnExit', 'value'] as const),
    )
  }

  const base = menuRootPropsWithoutUndefined({
    ...pick(props, [
      'anchorPoint',
      'aria-label',
      'asChild',
      'closeOnSelect',
      'composite',
      'defaultHighlightedValue',
      'defaultOpen',
      'highlightedValue',
      'id',
      'ids',
      'lazyMount',
      'loopFocus',
      'navigate',
      'positioning',
      'typeahead',
      'unmountOnExit',
    ] as const),
  })

  if (open.value !== undefined) {
    return {
      ...base,
      'onUpdate:open': (nextOpen: boolean) => {
        open.value = nextOpen
      },
      open: open.value,
    }
  }

  return base
})

const attrs = useAttrs()
const arkAttrs = computed(() => splitArkAttrs(attrs, ['ui', 'onSelect']))

function handleMenuSelect(details: MenuSelectionDetails) {
  resolveEntryOnSelect(props.items, details.value)
  const userOnSelect = attrs.onSelect as ((details: MenuSelectionDetails) => void) | undefined
  userOnSelect?.(details)
}

const itemUiProps = computed(() => ({
  item: props.ui?.item,
  itemGroup: props.ui?.itemGroup,
  itemGroupLabel: props.ui?.itemGroupLabel,
  itemIndicator: props.ui?.itemIndicator,
  itemText: props.ui?.itemText,
  separator: props.ui?.separator,
}))

const hasTriggersSlot = computed(() => Boolean(slots.triggers))
const hasTriggerSlot = computed(() => Boolean(slots.trigger))
const hasContextTriggerSlot = computed(() => Boolean(slots['context-trigger']))
const hasContextTrigger = computed(
  () => hasContextTriggerSlot.value || Boolean(props.contextTriggerText),
)

/** Built-in trigger (default button or `#trigger` wrapper). Hidden when `#triggers` or context-only. */
const showBuiltInTrigger = computed(() => !hasTriggersSlot.value && !hasContextTrigger.value)

const unstyledTriggerClass = computed(() => cn(menuUnstyledTriggerCVA(), props.ui?.trigger))

const styledTriggerClass = computed(() =>
  props.unstyled
    ? unstyledTriggerClass.value
    : cn(
        'w-fit transition-colors',
        buttonCVA({
          disabled: false,
          intent: props.intent,
          size: 'sm',
          variant: 'subtle',
        }),
        props.ui?.trigger,
      ),
)

extendCompodiumMeta({
  defaultProps: {
    intent: 'neutral',
    showArrow: false,
    showIndicator: true,
    size: 'md',
    triggerText: 'Actions',
  },
})
</script>

<template>
  <component :is="rootComponent" v-bind="{ ...arkAttrs, ...rootProps }" @select="handleMenuSelect">
    <ArkMenu.Context v-slot="menu">
      <slot
        name="context-trigger"
        :context-trigger="ArkMenu.ContextTrigger"
        :menu="menu"
        :trigger-value="menuTriggerValue(menu)"
      >
        <ArkMenu.ContextTrigger
          v-if="contextTriggerText && !hasContextTriggerSlot"
          :class="cn('w-fit', ui?.contextTrigger)"
        >
          {{ contextTriggerText }}
        </ArkMenu.ContextTrigger>
      </slot>

      <slot
        name="triggers"
        :trigger="ArkMenu.Trigger"
        :menu="menu"
        :trigger-value="menuTriggerValue(menu)"
      >
        <template v-if="showBuiltInTrigger">
          <ArkMenu.Trigger v-if="hasTriggerSlot" as-child>
            <span :class="unstyledTriggerClass">
              <slot name="trigger" />
            </span>
          </ArkMenu.Trigger>
          <ArkMenu.Trigger v-else :class="styledTriggerClass">
            <slot name="trigger">{{ triggerText }}</slot>
            <ArkMenu.Indicator v-if="showIndicator" :class="cn(menuIndicatorCVA(), ui?.indicator)">
              <slot name="indicator">
                <Icon :name="indicatorIcon" />
              </slot>
            </ArkMenu.Indicator>
          </ArkMenu.Trigger>
        </template>
      </slot>

      <Teleport :to="teleportTo" :disabled="!portalled">
        <UIMenuPositioner :ui="ui?.positioner">
          <ArkMenu.Content :class="cn(menuContentCVA({ intent, size }), ui?.content)">
            <ArkMenu.Arrow v-if="showArrow" :class="cn(menuArrowCVA({ intent, size }), ui?.arrow)">
              <ArkMenu.ArrowTip :class="cn(menuArrowTipCVA(), ui?.arrowTip)" />
            </ArkMenu.Arrow>

            <slot
              name="content"
              :menu="menu"
              :root="ArkMenu.Root"
              :trigger="ArkMenu.Trigger"
              :trigger-item="ArkMenu.TriggerItem"
              :positioner="ArkMenu.Positioner"
              :content-part="ArkMenu.Content"
              :item="ArkMenu.Item"
              :checkbox-item="ArkMenu.CheckboxItem"
              :radio-item-group="ArkMenu.RadioItemGroup"
              :radio-item="ArkMenu.RadioItem"
              :item-group="ArkMenu.ItemGroup"
              :item-group-label="ArkMenu.ItemGroupLabel"
              :separator="ArkMenu.Separator"
              :item-indicator="ArkMenu.ItemIndicator"
              :item-text="ArkMenu.ItemText"
              :context-trigger="ArkMenu.ContextTrigger"
              :trigger-value="menuTriggerValue(menu)"
            >
              <UIMenuEntryRenderer :items :intent :size v-bind="itemUiProps" />
            </slot>
          </ArkMenu.Content>
        </UIMenuPositioner>
      </Teleport>
    </ArkMenu.Context>
  </component>
</template>

<style scoped>
:deep([data-part='content'][data-state='open']) {
  animation: scale-fade-in 100ms ease-out;
}

:deep([data-part='content'][data-state='closed']) {
  animation: scale-fade-out 50ms ease-in;
}

@keyframes scale-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scale-fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
