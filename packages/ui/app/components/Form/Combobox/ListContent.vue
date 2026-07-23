<script setup lang="ts">
import { Combobox as ArkCombobox, type ListCollection } from '@ark-ui/vue/combobox'

import {
  comboboxItemCVA,
  comboboxItemGroupLabelCVA,
  comboboxIconSizeCVA,
} from '~/utils/Components/Form/Combobox/variants'

import type {
  ComboboxIntent,
  ComboboxItem,
  ComboboxSize,
  UIComboboxSlots,
} from '~/utils/Components/Form/Combobox/context'

interface ListContentProps {
  collection: ListCollection<ComboboxItem>
  intent: ComboboxIntent
  size: ComboboxSize
  loading: boolean
  loadingText: string
  emptyText: string
  isGrouped: boolean
  ui?: Partial<UIComboboxSlots>
}

const props = withDefaults(defineProps<ListContentProps>(), {
  ui: undefined,
})

const itemClass = computed(() =>
  cn(comboboxItemCVA({ intent: props.intent, size: props.size }), props.ui?.item),
)

const itemGroupLabelClass = computed(() =>
  cn(
    comboboxItemGroupLabelCVA({ intent: props.intent, size: props.size }),
    props.ui?.itemGroupLabel,
  ),
)

const iconClass = computed(() => cn(comboboxIconSizeCVA({ size: props.size })))

const groups = computed(() => {
  if (!props.isGrouped) return null
  return props.collection.group()
})
</script>

<template>
  <div v-if="loading" :class="cn(itemClass, 'cursor-default gap-2 text-neutral-text-subtle')">
    <Icon name="tabler:loader" :class="cn(iconClass, 'animate-spin')" />
    {{ loadingText }}
  </div>

  <UIFormComboboxEmpty v-else-if="collection.size === 0" :size :ui="ui?.empty">
    {{ emptyText }}
  </UIFormComboboxEmpty>

  <template v-else>
    <template v-if="isGrouped && groups">
      <ArkCombobox.ItemGroup
        v-for="[groupKey, groupItems] in groups"
        :key="groupKey"
        :class="cn(ui?.itemGroup)"
      >
        <ArkCombobox.ItemGroupLabel :class="itemGroupLabelClass">
          {{ groupKey }}
        </ArkCombobox.ItemGroupLabel>
        <ArkCombobox.Item
          v-for="item in groupItems"
          :key="item.value"
          :item="item"
          :class="itemClass"
        >
          <ArkCombobox.ItemText :class="cn('flex-1 truncate', ui?.itemText)">
            {{ item.label }}
          </ArkCombobox.ItemText>
          <ArkCombobox.ItemIndicator
            :class="cn('data-[state=unchecked]:invisible', ui?.itemIndicator)"
          >
            <Icon name="tabler:check" :class="iconClass" />
          </ArkCombobox.ItemIndicator>
        </ArkCombobox.Item>
      </ArkCombobox.ItemGroup>
    </template>

    <template v-else>
      <ArkCombobox.Item
        v-for="item in collection.items"
        :key="item.value"
        :item="item"
        :class="itemClass"
      >
        <ArkCombobox.ItemText :class="cn('flex-1 truncate', ui?.itemText)">
          {{ item.label }}
        </ArkCombobox.ItemText>
        <ArkCombobox.ItemIndicator
          :class="cn('data-[state=unchecked]:invisible', ui?.itemIndicator)"
        >
          <Icon name="tabler:check" :class="iconClass" />
        </ArkCombobox.ItemIndicator>
      </ArkCombobox.Item>
    </template>
  </template>
</template>
