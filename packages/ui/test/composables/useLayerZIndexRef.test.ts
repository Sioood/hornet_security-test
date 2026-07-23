// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'

import {
  useFloatingLayerPositionerRef,
  useLayerZIndexRef,
} from '../../app/composables/useLayerZIndexRef'
import {
  FLOATING_LAYER_Z_INDEX,
  MODAL_LAYER_Z_INDEX,
  TOAST_LAYER_Z_INDEX,
} from '../../app/utils/layer-z-index'

describe('useLayerZIndexRef', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('applies z-index with important priority on mount', () => {
    const scope = effectScope(true)
    scope.run(() => {
      const setRef = useLayerZIndexRef('floating')
      const el = document.createElement('div')
      setRef(el)

      expect(el.style.getPropertyValue('z-index')).toBe(String(FLOATING_LAYER_Z_INDEX))
      expect(el.style.getPropertyPriority('z-index')).toBe('important')
    })
    scope.stop()
  })

  it('re-applies z-index when Zag mutates style to auto', () => {
    let observerCallback: MutationCallback | undefined
    vi.stubGlobal(
      'MutationObserver',
      class {
        constructor(callback: MutationCallback) {
          observerCallback = callback
        }

        disconnect = vi.fn()
        observe = vi.fn()
      },
    )

    const scope = effectScope(true)
    scope.run(() => {
      const setRef = useLayerZIndexRef('modal')
      const el = document.createElement('div')
      setRef(el)

      el.style.setProperty('z-index', 'auto')
      observerCallback?.([], {} as MutationObserver)

      expect(el.style.getPropertyValue('z-index')).toBe(String(MODAL_LAYER_Z_INDEX))
      expect(el.style.getPropertyPriority('z-index')).toBe('important')
    })
    scope.stop()
  })

  it('resolves Vue component refs via $el', () => {
    const scope = effectScope(true)
    scope.run(() => {
      const setRef = useLayerZIndexRef('toast')
      const el = document.createElement('div')
      setRef({ $el: el })

      expect(el.style.getPropertyValue('z-index')).toBe(String(TOAST_LAYER_Z_INDEX))
      expect(el.style.getPropertyPriority('z-index')).toBe('important')
    })
    scope.stop()
  })

  it('disconnects observer on scope stop', () => {
    const disconnect = vi.fn()
    vi.stubGlobal(
      'MutationObserver',
      class {
        disconnect = disconnect
        observe = vi.fn()
      },
    )

    const scope = effectScope(true)
    scope.run(() => {
      const setRef = useFloatingLayerPositionerRef()
      setRef(document.createElement('div'))
    })
    scope.stop()

    expect(disconnect).toHaveBeenCalled()
  })

  it('disconnects previous observer when ref callback is re-invoked', () => {
    const disconnect = vi.fn()
    vi.stubGlobal(
      'MutationObserver',
      class {
        disconnect = disconnect
        observe = vi.fn()
      },
    )

    const scope = effectScope(true)
    scope.run(() => {
      const setRef = useLayerZIndexRef('floating')
      setRef(document.createElement('div'))
      setRef(document.createElement('div'))
    })
    scope.stop()

    expect(disconnect).toHaveBeenCalled()
  })
})
