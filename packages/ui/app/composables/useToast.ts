import { createToaster } from '@ark-ui/vue/toast'
import { nextTick, shallowRef, type ShallowRef } from 'vue'

type ToasterInstance = ReturnType<typeof createToaster>

const toasterRefs = new WeakMap<object, ShallowRef<ToasterInstance | null>>()

/** Ark toaster is not JSON-serializable; keep it off `payload.state` (do not use `useState`). */
export function useToast(): ShallowRef<ToasterInstance | null> {
  const nuxtApp = useNuxtApp()
  let ref = toasterRefs.get(nuxtApp)
  if (!ref) {
    ref = shallowRef<ToasterInstance | null>(null)
    // Defer creation until after hydration’s first paint.
    // Sync client init made `v-if="toaster"` true while SSR had false → hydration mismatch.
    if (import.meta.client) {
      void nextTick(() => {
        ref!.value = createToaster({
          gap: 8,
          max: 5,
          overlap: true,
          placement: 'bottom-end',
        })
      })
    }
    toasterRefs.set(nuxtApp, ref)
  }
  return ref
}
