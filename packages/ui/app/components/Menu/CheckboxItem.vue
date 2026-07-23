<script setup lang="ts">
import { Menu as ArkMenu } from '@ark-ui/vue/menu'
import { cva } from 'class-variance-authority'

import { menuCloseOnSelectKey, type MenuIntent } from '~/utils/Components/Menu/context'

import type { ClassValue } from 'vue'
import type { MenuCheckboxEntry } from '~/utils/Components/Menu/entries'

const menuItemCVA = cva(
  'flex cursor-pointer items-center justify-between outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70',
  {
    variants: {
      intent: {
        accent:
          'text-accent-text data-[disabled]:text-accent-text-subtle data-[highlighted]:bg-accent-fill-subtle-hover',
        neutral:
          'text-neutral-text data-[disabled]:text-neutral-text-subtle data-[highlighted]:bg-neutral-fill-subtle-hover',
        primary:
          'text-primary-text data-[disabled]:text-primary-text-subtle data-[highlighted]:bg-primary-fill-subtle-hover',
        secondary:
          'text-secondary-text data-[disabled]:text-secondary-text-subtle data-[highlighted]:bg-secondary-fill-subtle-hover',
      },
      size: {
        md: 'txt-caption gap-2 px-2 py-1.5',
      },
    },
  },
)
const menuItemIndicatorCVA = cva('inline-flex items-center justify-center', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    },
    size: {
      md: 'size-4',
    },
  },
})
const menuItemIndicatorSlotCVA = cva('inline-flex shrink-0 items-center justify-center', {
  variants: {
    size: {
      md: 'size-4',
    },
  },
})
const menuItemTextCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    },
    size: {
      md: 'txt-caption',
    },
  },
})

export interface MenuCheckboxItemProps extends Omit<MenuCheckboxEntry, 'closeOnSelect'> {
  entryCloseOnSelect?: boolean
  intent?: MenuIntent
  size?: 'md'
  item?: ClassValue
  itemIndicator?: ClassValue
  itemText?: ClassValue
}

const props = withDefaults(defineProps<MenuCheckboxItemProps>(), {
  customClass: undefined,
  entryCloseOnSelect: undefined,
  intent: 'neutral',
  item: undefined,
  itemIndicator: undefined,
  itemText: undefined,
  onCheckedChange: undefined,
  size: 'md',
})

const menuCloseOnSelect = inject(
  menuCloseOnSelectKey,
  computed(() => true),
)

const resolvedCloseOnSelect = computed(() => props.entryCloseOnSelect ?? menuCloseOnSelect.value)

const checkboxProps = computed(() => pick(props, ['checked', 'value', 'disabled'] as const))

function handleCheckedChange(checked: boolean) {
  props.onCheckedChange?.(checked)
}
</script>

<template>
  <ArkMenu.CheckboxItem
    v-bind="checkboxProps"
    :close-on-select="resolvedCloseOnSelect"
    :class="cn(menuItemCVA({ intent, size }), item, customClass)"
    @update:checked="handleCheckedChange(($event as boolean) ?? false)"
  >
    <ArkMenu.ItemText :class="cn(menuItemTextCVA({ intent, size }), itemText)">
      {{ label }}
    </ArkMenu.ItemText>
    <span :class="menuItemIndicatorSlotCVA({ size })">
      <span
        aria-hidden="true"
        :class="
          cn(
            menuItemIndicatorCVA({ intent, size }),
            itemIndicator,
            checked ? 'opacity-100' : 'opacity-0',
          )
        "
      >
        <ClientOnly fallback-tag="span">
          <Icon name="tabler:check" class="size-full" />
        </ClientOnly>
      </span>
    </span>
  </ArkMenu.CheckboxItem>
</template>
