<script setup lang="ts">
import {
  Avatar as ArkAvatar,
  type AvatarRootBaseProps as ArkAvatarRootBaseProps,
  type AvatarRootProviderBaseProps as ArkAvatarRootProviderBaseProps,
  type UseAvatarReturn,
} from '@ark-ui/vue/avatar'
import { cva, type VariantProps } from 'class-variance-authority'

import {
  getAnonymousAvatarFallbackText,
  getAvatarSeedFromName,
  getDiceBearNotionistsUrl,
  getInitialsFromName,
} from '@/utils/avatar'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

type AvatarIntent = 'neutral' | 'primary' | 'secondary' | 'accent'
type AvatarSize = 'sm' | 'md' | 'lg'

const avatarRootCVA = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden font-medium select-none',
  ],
  {
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    },
    variants: {
      intent: {
        accent: 'bg-accent-fill-subtle text-accent-text',
        neutral: 'bg-neutral-fill-subtle text-neutral-text',
        primary: 'bg-primary-fill-subtle text-primary-text',
        secondary: 'bg-secondary-fill-subtle text-secondary-text',
      } satisfies Record<AvatarIntent, string>,
      size: {
        lg: 'txt-base size-12 rounded-xs',
        md: 'txt-label size-10 rounded-xs',
        sm: 'txt-caption size-8 rounded-xs',
      } satisfies Record<AvatarSize, string>,
    },
  },
)

const avatarImageCVA = cva('size-full object-cover')

const avatarFallbackCVA = cva('flex size-full items-center justify-center leading-none uppercase')

type AvatarRootCVAProps = VariantProps<typeof avatarRootCVA>

export interface UIAvatarSlots {
  root?: ClassValue
  image?: ClassValue
  fallback?: ClassValue
}

export interface AvatarProps
  extends ArkAvatarRootBaseProps, Omit<ArkAvatarRootProviderBaseProps, 'value'> {
  value?: UseAvatarReturn['value']
  name?: string
  lettersOnly?: boolean
  src?: string
  alt?: string
  intent?: AvatarRootCVAProps['intent']
  size?: AvatarRootCVAProps['size']
  ui?: Partial<UIAvatarSlots>
}

const props = withDefaults(defineProps<AvatarProps>(), {
  alt: undefined,
  intent: 'neutral',
  lettersOnly: false,
  name: undefined,
  size: 'md',
  src: undefined,
  ui: undefined,
  value: undefined,
})

const attrs = useAttrs()

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() => (isProvider.value ? ArkAvatar.RootProvider : ArkAvatar.Root))

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'])
  }
  return pick(props, ['asChild', 'id', 'ids'])
})

const arkAttrs = computed(() =>
  splitArkAttrs(attrs, ['ui', 'intent', 'size', 'name', 'lettersOnly', 'src', 'alt']),
)

const rootBindings = computed(() => ({
  ...rootProps.value,
  ...arkAttrs.value,
  class: cn(
    avatarRootCVA({ intent: props.intent, size: props.size }),
    arkAttrs.value.class as ClassValue,
    props.ui?.root,
  ),
}))

const anonymousSeedKey = 'ui-avatar-anonymous-seed'
const anonymousSeed = useState(anonymousSeedKey, () => crypto.randomUUID())

const displaySeed = computed(() => {
  const fromName = getAvatarSeedFromName(props.name)
  return fromName || anonymousSeed.value
})

const initials = computed(() => {
  const fromName = getInitialsFromName(props.name)
  if (fromName) return fromName
  return getAnonymousAvatarFallbackText()
})

const resolvedSrc = computed(() => {
  if (props.lettersOnly) return undefined
  if (props.src) return props.src
  return getDiceBearNotionistsUrl(displaySeed.value)
})

const resolvedAlt = computed(
  () => props.alt ?? (props.name?.trim() ? `${props.name.trim()} avatar` : 'Avatar'),
)

extendCompodiumMeta({
  defaultProps: {
    intent: 'neutral',
    lettersOnly: false,
    name: 'Ada Lovelace',
    size: 'md',
  },
})
</script>

<template>
  <component :is="rootComponent" v-bind="rootBindings">
    <ArkAvatar.Fallback :class="cn(avatarFallbackCVA(), props.ui?.fallback)">
      <slot name="fallback">
        {{ initials }}
      </slot>
    </ArkAvatar.Fallback>

    <ArkAvatar.Image
      v-if="resolvedSrc"
      :src="resolvedSrc"
      :alt="resolvedAlt"
      :class="cn(avatarImageCVA(), props.ui?.image)"
    />

    <slot />
  </component>
</template>
