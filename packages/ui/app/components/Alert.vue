<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

import type { ButtonProps } from './Button.vue'
import type { UseComponentIconsProps } from '@/composables/useComponentIcons'
import type { ClassValue } from 'vue'

type AlertIntent = 'neutral' | 'success' | 'warning' | 'error' | 'info'
type AlertSize = 'md'

const alertRootCVA = cva(['alertRoot', 'relative'], {
  variants: {
    intent: {
      error: 'border-error-border bg-error-surface-subtle',
      info: 'border-info-border bg-info-surface-subtle',
      neutral: 'border-neutral-border bg-neutral-surface-subtle',
      success: 'border-success-border bg-success-surface-subtle',
      warning: 'border-warning-border bg-warning-surface-subtle',
    } satisfies Record<AlertIntent, string>,
    size: {
      md: 'flex justify-between gap-8 rounded-xs border p-4',
    } satisfies Record<AlertSize, string>,
  },
})

type AlertRootCVAProps = VariantProps<typeof alertRootCVA>

const alertContentCVA = cva(['alertContent', 'group/alertContent'], {
  variants: {
    intent: {
      error: 'text-error-text',
      info: 'text-info-text',
      neutral: 'text-neutral-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
    } satisfies Record<AlertIntent, string>,
    size: {
      md: 'grid gap-4 not-has-[>svg]:grid-rows-[auto_1fr] has-[>svg]:grid-cols-[auto_1fr]',
    } satisfies Record<AlertSize, string>,
  },
})

const alertContentIconCVA = cva(['alertContentIcon'], {
  variants: {
    size: {
      md: 'size-4',
    } satisfies Record<AlertSize, string>,
  },
})

const alertTitleCVA = cva(['alertTitle'], {
  variants: {
    intent: {
      error: 'text-error-text',
      info: 'text-info-text',
      neutral: 'text-neutral-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
    } satisfies Record<AlertIntent, string>,
    size: {
      md: 'txt-label',
    } satisfies Record<AlertSize, string>,
  },
})

const alertDescriptionCVA = cva(['alertDescription'], {
  variants: {
    intent: {
      error: 'text-error-text-subtle',
      info: 'text-info-text-subtle',
      neutral: 'text-neutral-text-subtle',
      success: 'text-success-text-subtle',
      warning: 'text-warning-text-subtle',
    } satisfies Record<AlertIntent, string>,
    size: {
      md: 'txt-caption group-has-[>svg]/alertContent:col-start-2',
    } satisfies Record<AlertSize, string>,
  },
})

const alertSlotContentWrapperCVA = cva(['alertSlotContentWrapper'], {
  variants: {
    size: {
      md: 'group-has-[>svg]/alertContent:col-start-2',
    } satisfies Record<AlertSize, string>,
  },
})

const alertActionsCVA = cva(['alertActions'], {
  variants: {
    size: {
      md: 'flex flex-col items-end gap-2 pt-5',
    } satisfies Record<AlertSize, string>,
  },
})

interface UIAlertSlots {
  action: ClassValue
  actions: ClassValue
  close: ClassValue
  content: ClassValue
  description: ClassValue
  icon: ClassValue
  root: ClassValue
  slotContent: ClassValue
  title: ClassValue
}

interface AlertProps extends UseComponentIconsProps {
  icon?: string
  actions?: ButtonProps[]
  closable?: boolean
  description?: string
  intent?: AlertRootCVAProps['intent']
  title: string
  type?: 'info' | 'success' | 'warning' | 'error' | 'neutral'
  size?: AlertRootCVAProps['size']
  ui?: Partial<UIAlertSlots>
}

const visible = defineModel<boolean>('visible', { default: true })

const props = withDefaults(defineProps<AlertProps>(), {
  actions: undefined,
  description: undefined,
  icon: undefined,
  intent: 'neutral',
  size: 'md',
  type: undefined,
  ui: undefined,
})

const { iconName } = useComponentIcons(() => ({ mode: 'single', ...props }))

type AlertType = NonNullable<AlertProps['type']>

const getAlertTypeIcon = (type: AlertType): string => {
  switch (type) {
    case 'neutral':
    case 'info':
      return useSemanticIcons.info
    case 'success':
      return useSemanticIcons.success
    case 'warning':
      return useSemanticIcons.warning
    case 'error':
      return useSemanticIcons.error
    default:
      assertNever(type)
  }
}

const defaultIcon = computed(() => {
  if (props.type) return getAlertTypeIcon(props.type)
  return props.icon
})

const defaultIntent = computed(() => {
  if (props.type) return props.type
  return props.intent
})

extendCompodiumMeta({
  defaultProps: {
    actions: [
      {
        intent: 'primary',
        onClick: () => {
          // oxlint-disable-next-line no-console
          console.log('Action clicked')
        },
        size: 'sm',
        text: 'Action',
      },
    ],
    description: 'Alert description',
    title: 'Alert title',
  },
})
</script>

<template>
  <div v-if="visible" :class="cn(alertRootCVA({ intent: defaultIntent, size }), ui?.root)">
    <div :class="cn(alertContentCVA({ intent: defaultIntent, size }), ui?.content)">
      <Icon
        v-if="iconName || defaultIcon"
        :name="iconName || defaultIcon!"
        :class="cn(alertContentIconCVA({ size }), ui?.icon)"
      />
      <span :class="cn(alertTitleCVA({ intent: defaultIntent, size }), ui?.title)">{{
        title
      }}</span>
      <div
        v-if="description"
        :class="cn(alertDescriptionCVA({ intent: defaultIntent, size }), ui?.description)"
      >
        {{ description }}
      </div>
      <div v-if="$slots.content" :class="cn(alertSlotContentWrapperCVA({ size }), ui?.slotContent)">
        <slot name="content" />
      </div>
    </div>
    <div v-if="actions?.length" :class="cn(alertActionsCVA({ size }), ui?.actions)">
      <UIButton
        v-if="closable"
        leading-icon="tabler:x"
        variant="ghost"
        size="sm"
        :intent="defaultIntent"
        :ui="{ root: ['w-fit absolute top-2 right-2', ui?.close] }"
        @click="visible = false"
      />
      <UIButton
        v-for="(action, index) in actions"
        :key="index"
        v-bind="action"
        :intent="action.intent || defaultIntent"
        :size="action.size || size"
        :ui="{ root: ['w-fit', ui?.action] }"
      />
    </div>
  </div>
</template>
