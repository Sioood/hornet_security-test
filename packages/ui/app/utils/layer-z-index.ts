/** Above sticky headers (`z-999`) and segmented controls (`z-10`). */
export const FLOATING_LAYER_Z_INDEX = 10_000

/** Above floating dropdowns/popovers. */
export const MODAL_LAYER_Z_INDEX = 11_000

/** Above modals. */
export const TOAST_LAYER_Z_INDEX = 12_000

export const LAYER_Z_INDEX = {
  floating: FLOATING_LAYER_Z_INDEX,
  modal: MODAL_LAYER_Z_INDEX,
  toast: TOAST_LAYER_Z_INDEX,
} as const

export type LayerZIndexKey = keyof typeof LAYER_Z_INDEX
