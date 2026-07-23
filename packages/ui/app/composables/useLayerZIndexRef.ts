import { onScopeDispose } from 'vue'

import { LAYER_Z_INDEX, type LayerZIndexKey } from '@/utils/layer-z-index'

function resolveHTMLElement(node: unknown): HTMLElement | null {
  if (node instanceof HTMLElement) return node
  if (node && typeof node === 'object' && '$el' in node) {
    const el = (node as { $el: unknown }).$el
    return el instanceof HTMLElement ? el : null
  }
  return null
}

function applyLayerZIndex(el: HTMLElement, zIndex: number): void {
  const current = el.style.getPropertyValue('z-index')
  const priority = el.style.getPropertyPriority('z-index')
  if (current === String(zIndex) && priority === 'important') {
    return
  }
  el.style.setProperty('z-index', String(zIndex), 'important')
}

/**
 * Zag/Ark positioners set `z-index: auto` inline, which beats Tailwind classes.
 * Re-apply the layer z-index when the node mounts and whenever Zag mutates `style`.
 *
 * Tailwind `!important` is intentionally avoided — this DOM workaround is scoped
 * to Ark-managed overlay nodes only.
 */
export function useLayerZIndexRef(layer: LayerZIndexKey = 'floating'): (node: unknown) => void {
  const zIndex = LAYER_Z_INDEX[layer]
  let observer: MutationObserver | undefined

  onScopeDispose(() => {
    observer?.disconnect()
    observer = undefined
  })

  return (node: unknown) => {
    observer?.disconnect()
    observer = undefined

    const el = resolveHTMLElement(node)
    if (!el) return

    applyLayerZIndex(el, zIndex)
    observer = new MutationObserver(() => {
      applyLayerZIndex(el, zIndex)
    })
    observer.observe(el, { attributeFilter: ['style'], attributes: true })
  }
}

/** Alias for select/combobox/date-picker/menu/popover/tooltip positioners. */
export function useFloatingLayerPositionerRef(): (node: unknown) => void {
  return useLayerZIndexRef('floating')
}
