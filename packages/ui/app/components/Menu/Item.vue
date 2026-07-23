<script setup lang="ts">
import { Menu as ArkMenu } from '@ark-ui/vue/menu'
import { cva } from 'class-variance-authority'

import { menuCloseOnSelectKey, type MenuIntent } from '~/utils/Components/Menu/context'

import type { ClassValue } from 'vue'
import type { MenuItemEntry } from '~/utils/Components/Menu/entries'

const menuItemCVA = cva(
  'flex w-full cursor-pointer items-center gap-2 outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70',
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
        md: 'txt-caption px-2 py-1.5',
      },
    },
  },
)

export interface MenuItemProps extends Omit<MenuItemEntry, 'closeOnSelect'> {
  intent?: MenuIntent
  size?: 'md'
  item?: ClassValue
  /** From `MenuItemEntry.closeOnSelect` — kept separate so Ark always gets an explicit boolean. */
  entryCloseOnSelect?: boolean
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  customClass: undefined,
  entryCloseOnSelect: undefined,
  external: undefined,
  intent: 'neutral',
  item: undefined,
  onSelect: undefined,
  size: 'md',
  target: undefined,
  to: undefined,
  type: undefined,
  valueText: undefined,
})

const config = useRuntimeConfig()
const menuCloseOnSelect = inject(
  menuCloseOnSelectKey,
  computed(() => true),
)

const resolvedCloseOnSelect = computed(() => props.entryCloseOnSelect ?? menuCloseOnSelect.value)

const itemProps = computed(() => pick(props, ['value', 'disabled', 'valueText'] as const))

const itemClass = computed(() =>
  cn(menuItemCVA({ intent: props.intent, size: props.size }), props.item, props.customClass),
)

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
</script>

<template>
  <ArkMenu.Item
    v-bind="itemProps"
    :close-on-select="resolvedCloseOnSelect"
    :class="to ? undefined : itemClass"
    :as-child="Boolean(to)"
  >
    <a
      v-if="to && isExternalLink"
      :href="linkHref"
      :target="linkTarget"
      :rel="linkRel"
      :class="itemClass"
    >
      {{ label }}
    </a>
    <NuxtLink v-else-if="to" :to="to" :class="itemClass">
      {{ label }}
    </NuxtLink>
    <template v-else>{{ label }}</template>
  </ArkMenu.Item>
</template>
