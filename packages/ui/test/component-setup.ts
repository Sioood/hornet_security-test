/**
 * GSAP ScrollTrigger (via v-gsap-nuxt) keeps a `_rafBugFix` loop that calls
 * `requestAnimationFrame(_rafBugFix)` from inside rAF callbacks. Happy-dom can
 * remove the global `requestAnimationFrame` while our setTimeout-based polyfill
 * is still delivering those callbacks — so we re-patch all hosts immediately
 * before invoking any rAF callback (and again around each test).
 */
import { afterEach, beforeEach } from 'vitest'

/**
 * Ark Tour (`@zag-js/tour`) reads `window.visualViewport` to track the layout
 * viewport boundaries. Happy-dom does not expose it, so we provide a minimal
 * stub that returns sensible defaults.
 */
function patchVisualViewport(): void {
  if (typeof (globalThis as { visualViewport?: unknown }).visualViewport !== 'undefined') return

  const stub = {
    addEventListener: () => {},
    clientHeight: 720,
    clientWidth: 1280,
    dispatchEvent: () => false,
    height: 720,
    offsetLeft: 0,
    offsetTop: 0,
    onresize: null,
    onscroll: null,
    pageLeft: 0,
    pageTop: 0,
    removeEventListener: () => {},
    scale: 1,
    width: 1280,
  }

  Object.defineProperty(globalThis, 'visualViewport', {
    configurable: true,
    value: stub,
    writable: true,
  })

  const hosts = [
    globalThis as Record<string, unknown>,
    (globalThis as { global?: Record<string, unknown> }).global,
    (globalThis as { window?: Record<string, unknown> }).window,
    (globalThis as { self?: Record<string, unknown> }).self,
  ].filter((h): h is Record<string, unknown> => typeof h === 'object' && h !== null)

  for (const host of hosts) {
    if (!('visualViewport' in host)) {
      host.visualViewport = stub
    }
  }
}

type RafHost = {
  requestAnimationFrame?: (cb: FrameRequestCallback) => number
  cancelAnimationFrame?: (id: number) => void
}

function collectRafHosts(): RafHost[] {
  const hosts: RafHost[] = [globalThis as unknown as RafHost]

  const globalRef = (globalThis as { global?: unknown }).global
  if (typeof globalRef === 'object' && globalRef !== null) {
    hosts.push(globalRef as RafHost)
  }

  const windowRef = (globalThis as { window?: unknown }).window
  if (typeof windowRef === 'object' && windowRef !== null) {
    hosts.push(windowRef as RafHost)
  }

  const selfRef = (globalThis as { self?: unknown }).self
  if (typeof selfRef === 'object' && selfRef !== null) {
    hosts.push(selfRef as RafHost)
  }

  return hosts
}

function patchRafHosts(): void {
  for (const host of collectRafHosts()) {
    host.requestAnimationFrame = raf
    host.cancelAnimationFrame = caf
  }
}

const raf = (cb: FrameRequestCallback): number =>
  setTimeout(() => {
    patchRafHosts()
    cb(Date.now())
  }, 0) as unknown as number

const caf = (id: number): void => {
  clearTimeout(id as unknown as ReturnType<typeof setTimeout>)
}

patchRafHosts()
patchVisualViewport()

beforeEach(() => {
  patchRafHosts()
  patchVisualViewport()
})

afterEach(() => {
  patchRafHosts()
  patchVisualViewport()
})
