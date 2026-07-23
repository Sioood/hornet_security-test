<script setup lang="ts">
import { type ListCollection } from '@ark-ui/vue/select'

import {
  selectItemCVA,
  selectItemGroupLabelCVA,
  selectIconSizeCVA,
} from '~/utils/Components/Form/Select/variants'

import type {
  SelectIntent,
  SelectSize,
  SelectItem,
  UISelectSlots,
} from '~/utils/Components/Form/Select/context'

interface ListContentProps {
  collection: ListCollection<SelectItem>
  intent: SelectIntent
  size: SelectSize
  loading: boolean
  loadingText: string
  emptyText: string
  allowSelectAll: boolean
  isGrouped: boolean
  ui?: Partial<UISelectSlots>
}

const props = withDefaults(defineProps<ListContentProps>(), {
  ui: undefined,
})

const itemClass = computed(() =>
  cn(selectItemCVA({ intent: props.intent, size: props.size }), props.ui?.item),
)

const itemGroupLabelClass = computed(() =>
  cn(selectItemGroupLabelCVA({ intent: props.intent, size: props.size }), props.ui?.itemGroupLabel),
)

const iconClass = computed(() => cn(selectIconSizeCVA({ size: props.size })))

const groups = computed(() => {
  if (!props.isGrouped) return null
  return props.collection.group()
})
</script>

<template>
  <div v-if="loading" :class="cn(itemClass, 'cursor-default gap-2 text-neutral-text-subtle')">
    <UIFormSelectGlyph name="loader" :glyph-class="cn(iconClass, 'animate-spin')" />
    {{ loadingText }}
  </div>

  <div
    v-else-if="collection.size === 0"
    :class="cn(itemClass, 'cursor-default text-neutral-text-subtle')"
  >
    {{ emptyText }}
  </div>

  <template v-else>
    <UIFormSelectContext v-if="allowSelectAll" v-slot="api">
      <button
        type="button"
        :class="cn(itemClass, 'w-full font-medium')"
        @click="
          () => {
            api.selectAll()
            api.setOpen(false)
          }
        "
      >
        <UIFormSelectGlyph name="checks" :glyph-class="iconClass" />
        {{ $t('select.selectAll') }}
      </button>
    </UIFormSelectContext>

    <template v-if="isGrouped && groups">
      <UIFormSelectItemGroup
        v-for="[groupKey, groupItems] in groups"
        :key="groupKey"
        :ui="ui?.itemGroup"
      >
        <UIFormSelectItemGroupLabel :class="itemGroupLabelClass">
          {{ groupKey }}
        </UIFormSelectItemGroupLabel>
        <UIFormSelectItem
          v-for="item in groupItems"
          :key="item.value"
          :item="item"
          :intent
          :size
          :ui="ui?.item"
        >
          <UIFormSelectItemText :ui="ui?.itemText">
            {{ item.label }}
          </UIFormSelectItemText>
          <UIFormSelectItemIndicator :ui="ui?.itemIndicator" />
        </UIFormSelectItem>
      </UIFormSelectItemGroup>
    </template>

    <template v-else>
      <UIFormSelectItem
        v-for="item in collection.items"
        :key="item.value"
        :item="item"
        :intent
        :size
        :ui="ui?.item"
      >
        <UIFormSelectItemText :ui="ui?.itemText">
          {{ item.label }}
        </UIFormSelectItemText>
        <UIFormSelectItemIndicator :ui="ui?.itemIndicator" />
      </UIFormSelectItem>
    </template>
  </template>
</template>
