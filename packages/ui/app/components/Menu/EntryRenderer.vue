<script setup lang="ts">
import { Menu as ArkMenu } from '@ark-ui/vue/menu'
import { cva } from 'class-variance-authority'

import type { ClassValue } from 'vue'
import type { MenuIntent } from '~/utils/Components/Menu/context'
import type {
  MenuCheckboxEntry,
  MenuItemEntry,
  MenuListEntry,
  MenuListEntryStrict,
  MenuRadioGroupEntry,
  MenuSubmenuEntry,
} from '~/utils/Components/Menu/entries'

const menuSeparatorCVA = cva('block w-full', {
  variants: {
    intent: {
      accent: 'border-accent-border-subtle',
      neutral: 'border-neutral-border-subtle',
      primary: 'border-primary-border-subtle',
      secondary: 'border-secondary-border-subtle',
    },
    size: {
      md: 'my-1 border-t',
    },
  },
})

export interface MenuEntryRendererProps {
  items: MenuListEntry[]
  intent?: MenuIntent
  size?: 'md'
  item?: ClassValue
  itemGroup?: ClassValue
  itemGroupLabel?: ClassValue
  separator?: ClassValue
  itemIndicator?: ClassValue
  itemText?: ClassValue
}

const props = withDefaults(defineProps<MenuEntryRendererProps>(), {
  intent: 'neutral',
  item: undefined,
  itemGroup: undefined,
  itemGroupLabel: undefined,
  itemIndicator: undefined,
  itemText: undefined,
  separator: undefined,
  size: 'md',
})

const sharedStyleProps = computed(() =>
  pick(props, [
    'intent',
    'size',
    'item',
    'itemGroup',
    'itemGroupLabel',
    'itemIndicator',
    'itemText',
  ] as const),
)

function isSeparator(entry: MenuListEntry): entry is Extract<MenuListEntry, { type: 'separator' }> {
  return entry.type === 'separator'
}

function isGroup(entry: MenuListEntry): entry is Extract<MenuListEntry, { type: 'group' }> {
  return entry.type === 'group'
}

function isRadioGroup(entry: MenuListEntry): entry is MenuRadioGroupEntry {
  return entry.type === 'radio-group'
}

function isCheckbox(entry: MenuListEntry): entry is MenuCheckboxEntry {
  return entry.type === 'checkbox'
}

function isSubmenu(entry: MenuListEntry): entry is MenuSubmenuEntry {
  return entry.type === 'submenu'
}

function isItem(entry: MenuListEntry): entry is MenuItemEntry {
  return !entry.type || entry.type === 'item'
}

function itemEntryProps(entry: MenuItemEntry) {
  const { closeOnSelect, onSelect: _onSelect, ...rest } = entry
  return { ...rest, entryCloseOnSelect: closeOnSelect }
}

function checkboxEntryProps(entry: MenuCheckboxEntry) {
  const { closeOnSelect, ...rest } = entry
  return { ...rest, entryCloseOnSelect: closeOnSelect }
}

/**
 * Compile-time proof that all entry types are handled in the template above.
 * If a new type is added to MenuListEntryStrict, this will cause a TS error
 * until the corresponding v-else-if branch is added to the template.
 */
function _getEntryComponent(entry: MenuListEntryStrict): string {
  switch (entry.type) {
    case 'item':
      return 'UIMenuItem'
    case 'checkbox':
      return 'UIMenuCheckboxItem'
    case 'radio-group':
      return 'UIMenuRadioGroup'
    case 'group':
      return 'UIMenuGroup'
    case 'submenu':
      return 'UIMenuSubmenu'
    case 'separator':
      return 'ArkMenu.Separator'
    default:
      assertNever(entry)
  }
}
void _getEntryComponent
</script>

<template>
  <template v-for="(entry, index) in items" :key="`${index}-${entry.type ?? 'item'}`">
    <ArkMenu.Separator
      v-if="isSeparator(entry)"
      :class="cn(menuSeparatorCVA({ intent, size }), separator, entry.customClass)"
    />
    <UIMenuGroup v-else-if="isGroup(entry)" v-bind="{ ...sharedStyleProps, ...entry, separator }" />
    <UIMenuSubmenu
      v-else-if="isSubmenu(entry)"
      v-bind="{ ...sharedStyleProps, ...entry, separator }"
    />
    <UIMenuRadioGroup v-else-if="isRadioGroup(entry)" v-bind="{ ...sharedStyleProps, ...entry }" />
    <UIMenuCheckboxItem
      v-else-if="isCheckbox(entry)"
      v-bind="{ ...sharedStyleProps, ...checkboxEntryProps(entry) }"
    />
    <UIMenuItem
      v-else-if="isItem(entry)"
      v-bind="{ ...sharedStyleProps, ...itemEntryProps(entry) }"
    />
  </template>
</template>
