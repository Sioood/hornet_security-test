<script setup lang="ts">
import { Menu as ArkMenu } from '@ark-ui/vue/menu'
import { cva } from 'class-variance-authority'

import type { ClassValue } from 'vue'
import type { MenuIntent } from '~/utils/Components/Menu/context'
import type { MenuRadioGroupEntry } from '~/utils/Components/Menu/entries'

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

export interface MenuRadioGroupProps extends MenuRadioGroupEntry {
  intent?: MenuIntent
  size?: 'md'
  item?: ClassValue
  itemGroup?: ClassValue
  itemGroupLabel?: ClassValue
  itemIndicator?: ClassValue
  itemText?: ClassValue
}

const props = withDefaults(defineProps<MenuRadioGroupProps>(), {
  customClass: undefined,
  intent: 'neutral',
  item: undefined,
  itemGroup: undefined,
  itemGroupLabel: undefined,
  itemIndicator: undefined,
  itemText: undefined,
  label: undefined,
  onValueChange: undefined,
  size: 'md',
  value: undefined,
})

const groupProps = computed(() => pick(props, ['value'] as const))

function handleValueChange(value: string) {
  props.onValueChange?.(value)
}
</script>

<template>
  <ArkMenu.RadioItemGroup
    v-bind="groupProps"
    :class="cn(itemGroup)"
    @update:model-value="handleValueChange(($event as string) ?? '')"
  >
    <ArkMenu.ItemGroupLabel
      v-if="label"
      :class="cn(menuItemGroupLabelCVA({ intent, size }), itemGroupLabel)"
    >
      {{ label }}
    </ArkMenu.ItemGroupLabel>

    <ArkMenu.RadioItem
      v-for="radioItem in items"
      :key="radioItem.value"
      :class="cn(menuItemCVA({ intent, size }), item, customClass)"
      :value="radioItem.value"
      :disabled="radioItem.disabled"
    >
      <ArkMenu.ItemText :class="cn(menuItemTextCVA({ intent, size }), itemText)">
        {{ radioItem.label }}
      </ArkMenu.ItemText>
      <span :class="menuItemIndicatorSlotCVA({ size })">
        <span
          aria-hidden="true"
          :class="
            cn(
              menuItemIndicatorCVA({ intent, size }),
              itemIndicator,
              value === radioItem.value ? 'opacity-100' : 'opacity-0',
            )
          "
        >
          <ClientOnly fallback-tag="span">
            <Icon name="tabler:check" class="size-full" />
          </ClientOnly>
        </span>
      </span>
    </ArkMenu.RadioItem>
  </ArkMenu.RadioItemGroup>
</template>
