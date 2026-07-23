<script setup lang="ts">
// oxlint-disable no-console
import { useMenu, type MenuOpenChangeDetails, type MenuSelectionDetails } from '@ark-ui/vue/menu'

import type { MenuListEntry } from '@/components/Menu/index.vue'

const externalMenu = useMenu({ defaultOpen: false })

const toolbarVisible = ref(true)
const statusBarVisible = ref(false)
const sortBy = ref('date')
const selectedAction = ref<string | null>(null)
const controlledOpen = ref(false)

function logAction(name: string, payload?: unknown) {
  console.log(`[menu-example] ${name}`, payload)
}

function handleSelect(source: string, event: { value: string }) {
  selectedAction.value = event.value
  logAction(source, event.value)
}

function onFileMenuSelect(event: { value: string }) {
  handleSelect('file-select', event)
}

function onContextMenuSelect(event: { value: string }) {
  handleSelect('context-select', event)
}

function onControlledMenuSelect(event: { value: string }) {
  handleSelect('controlled-select', event)
}

function onMultipleTriggerMenuSelect(event: { value: string }) {
  handleSelect('multiple-trigger-select', event)
}

function logControlledMenuOpen(open: boolean) {
  logAction('controlled-open', open)
  controlledOpen.value = open
}

const actionItems = computed<MenuListEntry[]>(() => [
  { label: 'New File', onSelect: () => logAction('new-file'), type: 'item', value: 'new-file' },
  { label: 'Open...', onSelect: () => logAction('open'), type: 'item', value: 'open' },
  { label: 'Save', onSelect: () => logAction('save'), type: 'item', value: 'save' },
  { label: 'Save As...', onSelect: () => logAction('save-as'), type: 'item', value: 'save-as' },
  {
    customClass:
      'text-error-text data-[highlighted]:bg-error-fill-subtle-hover data-[disabled]:text-error-text-subtle',
    label: 'Delete',
    onSelect: () => logAction('delete'),
    type: 'item',
    value: 'delete',
  },
  { type: 'separator' },
  {
    items: [
      {
        label: 'PDF',
        onSelect: () => logAction('export-pdf'),
        type: 'item',
        value: 'export-pdf',
      },
      { label: 'PNG', onSelect: () => logAction('export-png'), type: 'item', value: 'export-png' },
      { label: 'SVG', onSelect: () => logAction('export-svg'), type: 'item', value: 'export-svg' },
    ],
    label: 'Export',
    type: 'group',
  },
  {
    items: [
      {
        label: 'Email',
        onSelect: () => logAction('share-email'),
        type: 'item',
        value: 'share-email',
      },
      {
        label: 'Message',
        onSelect: () => logAction('share-message'),
        type: 'item',
        value: 'share-message',
      },
      {
        label: 'AirDrop',
        onSelect: () => logAction('share-airdrop'),
        type: 'item',
        value: 'share-airdrop',
      },
      {
        items: [
          {
            label: 'Copy share link',
            onSelect: () => logAction('share-link'),
            type: 'item',
            value: 'share-link',
          },
          {
            items: [
              {
                label: 'Can view',
                onSelect: () => logAction('permission-view'),
                type: 'item',
                value: 'permission-view',
              },
              {
                items: [
                  {
                    label: '1 hour',
                    onSelect: () => logAction('grant-1h'),
                    type: 'item',
                    value: 'grant-1h',
                  },
                  {
                    label: '24 hours',
                    onSelect: () => logAction('grant-24h'),
                    type: 'item',
                    value: 'grant-24h',
                  },
                  {
                    label: '7 days',
                    onSelect: () => logAction('grant-7d'),
                    type: 'item',
                    value: 'grant-7d',
                  },
                ],
                label: 'Grant temporary access',
                type: 'submenu',
              },
            ],
            label: 'Permissions',
            type: 'submenu',
          },
        ],
        label: 'Advanced',
        type: 'submenu',
      },
      { type: 'separator' },
      {
        items: [
          { label: 'Team', value: 'team' },
          { label: 'Private', value: 'private' },
        ],
        label: 'Visibility',
        onValueChange: (value: string) => logAction('share-visibility', value),
        type: 'radio-group',
        value: 'team',
      },
    ],
    label: 'Share',
    type: 'submenu',
  },
  {
    items: [
      {
        label: 'Documentation',
        onSelect: () => logAction('open-docs'),
        to: 'https://ark-ui.com',
        type: 'item',
        value: 'docs',
      },
      {
        label: 'GitHub',
        onSelect: () => logAction('open-github'),
        target: '_blank',
        to: 'https://github.com/chakra-ui/ark',
        type: 'item',
        value: 'github',
      },
      {
        label: 'Playground',
        onSelect: () => logAction('open-previews'),
        to: '/previews',
        type: 'item',
        value: 'previews',
      },
    ],
    label: 'Links',
    type: 'group',
  },
  { type: 'separator' },
  {
    checked: toolbarVisible.value,
    label: 'Show Toolbar',
    onCheckedChange: (checked: boolean) => {
      toolbarVisible.value = checked
      logAction('toolbar-visibility', checked)
    },
    type: 'checkbox',
    value: 'toolbar',
  },
  {
    checked: statusBarVisible.value,
    label: 'Show Status Bar',
    onCheckedChange: (checked: boolean) => {
      statusBarVisible.value = checked
      logAction('statusbar-visibility', checked)
    },
    type: 'checkbox',
    value: 'status-bar',
  },
  { type: 'separator' },
  {
    items: [
      { label: 'Name', value: 'name' },
      { label: 'Date Modified', value: 'date' },
      { disabled: true, label: 'Size', value: 'size' },
    ],
    label: 'Sort By',
    onValueChange: (value: string) => {
      sortBy.value = value
      logAction('sort-by', value)
    },
    type: 'radio-group',
    value: sortBy.value,
  },
])

const multipleTriggerItems = computed<Record<string, MenuListEntry[]>>(() => ({
  'msg-1': [
    {
      label: 'Reply',
      onSelect: () => logAction('msg-1-reply'),
      type: 'item',
      value: 'msg-1-reply',
    },
    { label: 'Pin', onSelect: () => logAction('msg-1-pin'), type: 'item', value: 'msg-1-pin' },
  ],
  'msg-2': [
    {
      label: 'Forward',
      onSelect: () => logAction('msg-2-forward'),
      type: 'item',
      value: 'msg-2-forward',
    },
    {
      items: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
      ],
      label: 'Priority',
      onValueChange: (value: string) => logAction('msg-2-priority', value),
      type: 'radio-group',
      value: 'normal',
    },
  ],
  'msg-3': [
    {
      label: 'Archive',
      onSelect: () => logAction('msg-3-archive'),
      type: 'item',
      value: 'msg-3-archive',
    },
    {
      label: 'Delete',
      onSelect: () => logAction('msg-3-delete'),
      type: 'item',
      value: 'msg-3-delete',
    },
  ],
}))

function getMultipleTriggerItems(triggerValue: string | null): MenuListEntry[] {
  if (!triggerValue) {
    return actionItems.value
  }
  return multipleTriggerItems.value[triggerValue] ?? actionItems.value
}

const accountUser = {
  name: 'Marie Dupont',
}

const accountMenuItems = computed<MenuListEntry[]>(() => [
  {
    items: [
      {
        label: 'Profile',
        onSelect: () => logAction('account-profile'),
        to: '/previews',
        type: 'item',
        value: 'profile',
      },
      {
        label: 'Settings',
        onSelect: () => logAction('account-settings'),
        to: '/previews/bento',
        type: 'item',
        value: 'settings',
      },
      {
        label: 'Billing',
        onSelect: () => logAction('account-billing'),
        type: 'item',
        value: 'billing',
      },
      {
        label: 'Notifications',
        onSelect: () => logAction('account-notifications'),
        type: 'item',
        value: 'notifications',
      },
      {
        label: 'Help & support',
        onSelect: () => logAction('account-help'),
        to: '/previews',
        type: 'item',
        value: 'help',
      },
    ],
    label: accountUser.name,
    type: 'group',
  },
  { type: 'separator' },
  {
    customClass:
      'text-error-text data-[highlighted]:bg-error-fill-subtle-hover data-[disabled]:text-error-text-subtle',
    label: 'Sign out',
    onSelect: () => logAction('account-sign-out'),
    type: 'item',
    value: 'sign-out',
  },
])

function onAccountMenuSelect(event: { value: string }) {
  handleSelect('account', event)
}
</script>

<template>
  <div class="flex w-fit flex-col gap-5">
    <UIMenu trigger-text="File" :items="actionItems" @select="onFileMenuSelect" />

    <UIMenu :items="actionItems" @select="onContextMenuSelect">
      <template #context-trigger="{ contextTrigger: ContextTrigger }">
        <component
          :is="ContextTrigger"
          class="menuContextTrigger txt-caption rounded-none border border-dashed border-neutral-border-subtle px-3 py-2"
        >
          Right click here
        </component>
      </template>
    </UIMenu>

    <div class="flex items-center gap-2">
      <UIButton
        v-if="!controlledOpen"
        type="button"
        variant="subtle"
        intent="neutral"
        text="Open controlled menu"
        @click="logControlledMenuOpen(true)"
      />
      <UIButton
        v-else
        type="button"
        variant="ghost"
        intent="neutral"
        text="Close controlled menu"
        @click="logControlledMenuOpen(false)"
      />
      <UIMenu
        v-model:open="controlledOpen"
        trigger-text="Controlled"
        :items="actionItems"
        intent="primary"
        @update:open="logAction('controlled-update-open', $event)"
        @select="onControlledMenuSelect"
      />
    </div>

    <div class="flex flex-col items-end gap-2">
      <p class="txt-caption text-neutral-text-subtle">
        Account menu with <code>UIAvatar</code> trigger (profile, settings, billing, notifications,
        help).
      </p>
      <UIMenu
        :items="accountMenuItems"
        :show-indicator="false"
        :portalled="false"
        :positioning="{ placement: 'bottom-end', gutter: 8 }"
        :ui="{ trigger: 'rounded-full' }"
        @select="onAccountMenuSelect"
      >
        <template #trigger>
          <UIAvatar :name="accountUser.name" size="md" intent="primary" />
          <span class="sr-only">Account menu for {{ accountUser.name }}</span>
        </template>
      </UIMenu>
    </div>

    <UIMenu
      trigger-text="Multiple triggers"
      :positioning="{ placement: 'right-start' }"
      @select="onMultipleTriggerMenuSelect"
    >
      <template #triggers="{ trigger: Trigger }">
        <div class="join flex">
          <component
            :is="Trigger"
            v-for="id in ['msg-1', 'msg-2', 'msg-3']"
            :key="id"
            :value="id"
            class="join-item"
          >
            <span
              class="txt-caption inline-flex h-8 min-w-16 items-center justify-center border border-neutral-border-subtle bg-neutral-fill-subtle px-2 text-neutral-text disabled:pointer-events-none disabled:opacity-40"
            >
              {{ id }}
            </span>
          </component>
        </div>
      </template>
      <template #content="{ triggerValue }">
        <UIMenuEntryRenderer :items="getMultipleTriggerItems(triggerValue)" />
      </template>
    </UIMenu>

    <UIMenu trigger-text="Nested (advanced)">
      <template
        #content="{
          item: Item,
          separator: Separator,
          root: Root,
          triggerItem: TriggerItem,
          contentPart: ContentPart,
          positioner: Positioner,
        }"
      >
        <component :is="Item" value="new" class="menuItem" @select="logAction('nested-new-file')">
          New File
        </component>
        <component :is="Item" value="open" class="menuItem" @select="logAction('nested-open')">
          Open...
        </component>
        <component :is="Separator" class="menuSeparator" />
        <component :is="Root">
          <component :is="TriggerItem" class="menuTriggerItem">Share</component>
          <Teleport to="body">
            <component :is="Positioner">
              <component
                :is="ContentPart"
                class="menuContent txt-label border border-neutral-border-subtle bg-neutral-fill-subtle p-1 disabled:pointer-events-none disabled:opacity-40"
              >
                <component
                  :is="Item"
                  value="email"
                  class="menuItem"
                  @select="logAction('nested-share-email')"
                >
                  Email
                </component>
                <component
                  :is="Item"
                  value="message"
                  class="menuItem"
                  @select="logAction('nested-share-message')"
                >
                  Message
                </component>
              </component>
            </component>
          </Teleport>
        </component>
      </template>
    </UIMenu>

    <UIMenu trigger-text="Links only">
      <template #content="{ item: Item, separator: Separator }">
        <component
          :is="Item"
          value="docs"
          as-child
          class="menuItem"
          @select="logAction('links-docs')"
        >
          <a href="https://ark-ui.com">Documentation</a>
        </component>
        <component
          :is="Item"
          value="repo"
          as-child
          class="menuItem"
          @select="logAction('links-repo')"
        >
          <a href="https://github.com/chakra-ui/ark" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </component>
        <component :is="Separator" class="menuSeparator" />
        <component
          :is="Item"
          value="changelog"
          as-child
          class="menuItem"
          @select="logAction('links-changelog')"
        >
          <a
            href="https://github.com/chakra-ui/ark/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            Changelog
          </a>
        </component>
      </template>
    </UIMenu>

    <!-- RootProvider mode -->
    <UIMenu
      :value="externalMenu"
      :items="actionItems"
      trigger-text="RootProvider Menu"
      @select="(e: MenuSelectionDetails) => console.log('select', e)"
      @open-change="(d: MenuOpenChangeDetails) => console.log('openChange', d)"
      @escape-key-down="(d: KeyboardEvent) => console.log('escapeKeyDown', d)"
    />
    <div class="flex items-center gap-2">
      <UIButton size="sm" variant="subtle" @click="externalMenu.api.value.setOpen(true)">
        Force open
      </UIButton>
      <UIButton size="sm" variant="subtle" @click="externalMenu.api.value.setOpen(false)">
        Force close
      </UIButton>
    </div>

    <p class="txt-caption text-neutral-text-subtle">
      Selected: {{ selectedAction ?? 'none' }} | toolbar={{ toolbarVisible }} | statusBar={{
        statusBarVisible
      }}
      | sortBy={{ sortBy }}
    </p>
  </div>
</template>
