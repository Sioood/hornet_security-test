<script setup lang="ts">
import { Menu as ArkMenu } from '@ark-ui/vue/menu'
import { cva } from 'class-variance-authority'

import type { ClassValue } from 'vue'
import type { MenuIntent } from '~/utils/Components/Menu/context'
import type { MenuGroupEntry } from '~/utils/Components/Menu/entries'

const menuItemGroupLabelCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
    },
    size: {
      md: 'txt-caption px-2 py-1',
    },
  },
})
const menuSeparatorCVA = cva('block w-full border-t', {
  variants: {
    intent: {
      accent: 'border-accent-border-subtle',
      neutral: 'border-neutral-border-subtle',
      primary: 'border-primary-border-subtle',
      secondary: 'border-secondary-border-subtle',
    },
    size: {
      md: 'my-1',
    },
  },
})

export interface MenuGroupProps extends MenuGroupEntry {
  intent?: MenuIntent
  size?: 'md'
  item?: ClassValue
  itemGroup?: ClassValue
  itemGroupLabel?: ClassValue
  separator?: ClassValue
  itemIndicator?: ClassValue
  itemText?: ClassValue
}

const props = withDefaults(defineProps<MenuGroupProps>(), {
  customClass: undefined,
  intent: 'neutral',
  item: undefined,
  itemGroup: undefined,
  itemGroupLabel: undefined,
  itemIndicator: undefined,
  itemText: undefined,
  label: undefined,
  separator: undefined,
  size: 'md',
})

const groupProps = computed(() => pick(props, ['label', 'items', 'intent', 'size'] as const))
</script>

<template>
  <ArkMenu.ItemGroup :class="cn(itemGroup, customClass)">
    <ArkMenu.ItemGroupLabel
      v-if="label"
      :class="cn(menuItemGroupLabelCVA({ intent, size }), itemGroupLabel)"
    >
      {{ label }}
    </ArkMenu.ItemGroupLabel>

    <template v-for="(groupEntry, groupIndex) in items" :key="groupIndex">
      <ArkMenu.Separator
        v-if="groupEntry.type === 'separator'"
        :class="cn(menuSeparatorCVA({ intent, size }), separator, groupEntry.customClass)"
      />
      <UIMenuCheckboxItem
        v-else-if="groupEntry.type === 'checkbox'"
        v-bind="groupEntry"
        :intent="groupProps.intent"
        :size="groupProps.size"
        :item="item"
        :item-indicator="itemIndicator"
        :item-text="itemText"
      />
      <UIMenuRadioGroup
        v-else-if="groupEntry.type === 'radio-group'"
        v-bind="groupEntry"
        :intent="groupProps.intent"
        :size="groupProps.size"
        :item="item"
        :item-group="itemGroup"
        :item-group-label="itemGroupLabel"
        :item-indicator="itemIndicator"
        :item-text="itemText"
      />
      <UIMenuSubmenu
        v-else-if="groupEntry.type === 'submenu'"
        v-bind="groupEntry"
        :intent="groupProps.intent"
        :size="groupProps.size"
        :item="item"
        :item-group="itemGroup"
        :item-group-label="itemGroupLabel"
        :separator="separator"
        :item-indicator="itemIndicator"
        :item-text="itemText"
      />
      <UIMenuGroup
        v-else-if="groupEntry.type === 'group'"
        v-bind="groupEntry"
        :intent="groupProps.intent"
        :size="groupProps.size"
        :item="item"
        :item-group="itemGroup"
        :item-group-label="itemGroupLabel"
        :separator="separator"
        :item-indicator="itemIndicator"
        :item-text="itemText"
      />
      <UIMenuItem
        v-else
        v-bind="groupEntry"
        :intent="groupProps.intent"
        :size="groupProps.size"
        :item="item"
      />
    </template>
  </ArkMenu.ItemGroup>
</template>
