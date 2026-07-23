<script setup lang="ts">
import {
  QrCode as ArkQrCode,
  type QrCodeRootProps as ArkQrCodeRootProps,
  type QrCodeDownloadTriggerProps as ArkQrCodeDownloadTriggerProps,
  type QrCodeRootProviderBaseProps as ArkQrCodeRootProviderBaseProps,
  type UseQrCodeReturn,
} from '@ark-ui/vue/qr-code'
import { cva, type VariantProps } from 'class-variance-authority'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

type QrCodeIntent = 'neutral' | 'primary' | 'secondary' | 'accent' | 'blackAndWhite'
type QrCodeSize = 'md'

const qrCodeRootCVA = cva(['flex size-full flex-col items-center justify-center'], {
  variants: {
    intent: {
      accent: 'text-accent-surface',
      blackAndWhite: 'text-black',
      neutral: 'text-neutral-surface',
      primary: 'text-primary-surface',
      secondary: 'text-secondary-surface',
    } satisfies Record<QrCodeIntent, string>,
    size: {
      md: 'gap-2',
    } satisfies Record<QrCodeSize, string>,
  },
})

type QrCodeRootCVAProps = VariantProps<typeof qrCodeRootCVA>

const qrCodeFrameCVA = cva('size-full', {
  variants: {
    intent: {
      accent: 'bg-accent-fill-subtle fill-accent-fill',
      blackAndWhite: 'bg-white fill-black',
      neutral: 'bg-neutral-fill-subtle fill-neutral-fill',
      primary: 'bg-primary-fill-subtle fill-primary-fill',
      secondary: 'bg-secondary-fill-subtle fill-secondary-fill',
    } satisfies Record<QrCodeIntent, string>,
  },
})

interface UIQrCodeSlots {
  root?: ClassValue
  frame?: ClassValue
  pattern?: ClassValue
  overlay?: ClassValue
  downloadTrigger?: ClassValue
}

interface QrCodeProps
  extends
    ArkQrCodeRootProps,
    Omit<ArkQrCodeDownloadTriggerProps, 'value' | 'mimeType' | 'fileName'>,
    Omit<ArkQrCodeRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useQrCode()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseQrCodeReturn['value']
  downloadable?: boolean
  downloadLabel?: string
  intent?: QrCodeRootCVAProps['intent']
  size?: QrCodeRootCVAProps['size']
  ui?: Partial<UIQrCodeSlots>
  mimeType?: ArkQrCodeDownloadTriggerProps['mimeType']
  fileName?: ArkQrCodeDownloadTriggerProps['fileName']
}

const modelValue = defineModel<string>({ required: false })

const props = withDefaults(defineProps<QrCodeProps>(), {
  defaultValue: 'https://theodupont.fr',
  downloadLabel: 'downloadQRCode',
  downloadable: false,
  encoding: () => ({ boostEcc: true, ecc: 'M' }),
  fileName: 'qr-code.png',
  intent: 'neutral',
  mimeType: 'image/png',
  quality: 1,
  size: 'md',
  ui: undefined,
  value: undefined,
})

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() => (isProvider.value ? ArkQrCode.RootProvider : ArkQrCode.Root))

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  const base: Record<string, unknown> = {
    ...pick(props, ['asChild', 'defaultValue', 'encoding', 'id', 'ids', 'pixelSize'] as const),
  }

  if (modelValue.value !== undefined) {
    base.modelValue = modelValue.value
    base['onUpdate:modelValue'] = (next: string) => {
      modelValue.value = next
    }
  }

  return base
})

const rootBindings = computed(() => ({
  ...arkAttrs.value,
  ...rootProps.value,
}))

const attrs = useAttrs()
const arkAttrs = computed(() => splitArkAttrs(attrs))

const downloadTriggerProps = computed(() => ({
  ...pick(props, ['fileName', 'mimeType', 'quality']),
}))
</script>

<template>
  <component
    :is="rootComponent"
    v-bind="rootBindings"
    :class="cn(qrCodeRootCVA({ intent, size }), ui?.root)"
  >
    <div class="relative size-full">
      <ArkQrCode.Frame :class="cn(qrCodeFrameCVA({ intent }), ui?.frame)">
        <ArkQrCode.Pattern :class="cn(ui?.pattern)" />
      </ArkQrCode.Frame>
      <ArkQrCode.Overlay
        :class="cn('flex size-full items-center justify-center overflow-hidden', ui?.overlay)"
      >
        <slot name="overlay" />
      </ArkQrCode.Overlay>
    </div>
    <ArkQrCode.DownloadTrigger
      v-if="downloadable"
      as-child
      v-bind="downloadTriggerProps"
      :class="cn('w-full', ui?.downloadTrigger)"
    >
      <slot name="downloadTrigger">
        <UIButton :intent="intent === 'blackAndWhite' ? 'primary' : intent" :size>
          {{ $t(downloadLabel || 'downloadQRCode') }}
        </UIButton>
      </slot>
    </ArkQrCode.DownloadTrigger>
  </component>
</template>
