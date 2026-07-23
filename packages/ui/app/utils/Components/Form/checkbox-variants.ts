import { cva } from 'class-variance-authority'

import type { FormFieldIntent, FormFieldSize } from './context'

export const checkboxControlCVA = cva(
  [
    'size-4 shrink-0 overflow-hidden border',
    'border-primary-border data-hover:border-primary-border-hover data-[disabled]:border-primary-border-subtle data-[invalid]:border-error-border',
  ],
  {
    variants: {
      disabled: {
        false: '',
        true: '',
      } satisfies Record<'false' | 'true', string>,
      intent: {
        accent: '',
        error: '',
        info: '',
        neutral: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
      } satisfies Record<FormFieldIntent, string>,
      invalid: {
        false: '',
        true: '',
      } satisfies Record<'false' | 'true', string>,
      size: {
        lg: 'rounded-xs',
        md: 'rounded-xs',
        sm: 'rounded-xs',
      } satisfies Record<FormFieldSize, string>,
    },
  },
)

export const checkboxIndicatorCVA = cva(
  [
    'flex size-full items-center justify-center',
    'bg-primary-fill-subtle text-primary-text',
    'group-data-[state=checked]:bg-primary-fill group-data-[state=checked]:text-primary-on-fill',
    'group-data-[state=indeterminate]:bg-primary-fill group-data-[state=indeterminate]:text-primary-on-fill',
  ],
  {
    variants: {
      disabled: {
        false: '',
        true: '',
      } satisfies Record<'false' | 'true', string>,
      intent: {
        accent: '',
        error: '',
        info: '',
        neutral: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
      } satisfies Record<FormFieldIntent, string>,
      invalid: {
        false: '',
        true: '',
      } satisfies Record<'false' | 'true', string>,
      size: {
        lg: '',
        md: '',
        sm: '',
      } satisfies Record<FormFieldSize, string>,
    },
  },
)

/** Combined control surface for TreeView `NodeCheckbox` (single element, `data-[state=*]`). */
export const treeNodeCheckboxCVA = cva(
  [
    'inline-flex size-4 shrink-0 items-center justify-center border',
    'border-primary-border bg-primary-fill-subtle text-primary-text disabled:pointer-events-none disabled:opacity-40',
    'data-hover:border-primary-border-hover',
    'data-[state=checked]:border-primary-fill data-[state=checked]:bg-primary-fill data-[state=checked]:text-primary-on-fill',
    'data-[state=indeterminate]:border-primary-fill data-[state=indeterminate]:bg-primary-fill data-[state=indeterminate]:text-primary-on-fill',
    'data-[disabled]:cursor-not-allowed data-[disabled]:border-primary-border-subtle',
  ],
  {
    variants: {
      disabled: {
        false: 'cursor-pointer',
        true: '',
      } satisfies Record<'false' | 'true', string>,
      intent: {
        accent: '',
        error: '',
        info: '',
        neutral: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
      } satisfies Record<FormFieldIntent, string>,
      invalid: {
        false: '',
        true: 'data-[invalid]:border-error-border',
      } satisfies Record<'false' | 'true', string>,
      size: {
        lg: '',
        md: '',
        sm: '',
      } satisfies Record<FormFieldSize, string>,
    },
  },
)

export const treeNodeCheckboxIndicatorCVA = cva('flex size-full items-center justify-center')

export function checkboxDisabledFlag(disabled: boolean): 'false' | 'true' {
  return disabled ? 'true' : 'false'
}

export function checkboxInvalidFlag(invalid: boolean): 'false' | 'true' {
  return invalid ? 'true' : 'false'
}
