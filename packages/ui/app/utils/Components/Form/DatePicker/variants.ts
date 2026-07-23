import { cva } from 'class-variance-authority'

import type { DatePickerIntent, DatePickerSize } from './context'

export const datePickerRootCVA = cva('flex w-full flex-col gap-1')

export const datePickerLabelCVA = cva('block', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle data-[disabled]:opacity-50 data-[invalid]:text-error-text',
      neutral: 'text-neutral-text-subtle data-[disabled]:opacity-50 data-[invalid]:text-error-text',
      primary: 'text-primary-text-subtle data-[disabled]:opacity-50 data-[invalid]:text-error-text',
      secondary:
        'text-secondary-text-subtle data-[disabled]:opacity-50 data-[invalid]:text-error-text',
    } satisfies Record<DatePickerIntent, string>,
    size: {
      lg: 'txt-label mb-1.5',
      md: 'txt-caption mb-1',
      sm: 'txt-caption mb-1',
    } satisfies Record<DatePickerSize, string>,
  },
})

export const datePickerControlCVA = cva('flex w-full min-w-0 items-stretch gap-0')

export const datePickerInputCVA = cva(
  'txt-base min-w-0 flex-1 border-0 bg-transparent outline-none',
  {
    variants: {
      intent: {
        accent:
          'text-accent-text placeholder:text-accent-text-muted disabled:text-accent-text-disabled',
        neutral:
          'text-neutral-text placeholder:text-neutral-text-muted disabled:text-neutral-text-disabled',
        primary:
          'text-primary-text placeholder:text-primary-text-muted disabled:text-primary-text-disabled',
        secondary:
          'text-secondary-text placeholder:text-secondary-text-muted disabled:text-secondary-text-disabled',
      } satisfies Record<DatePickerIntent, string>,
      size: {
        lg: 'px-3 py-1.5',
        md: 'px-2 py-1',
        sm: 'px-1.5 py-0.5',
      } satisfies Record<DatePickerSize, string>,
    },
  },
)

export const datePickerTriggerCVA = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent outline-none disabled:cursor-not-allowed',
  {
    variants: {
      intent: {
        accent: 'text-accent-text-subtle hover:text-accent-text disabled:text-accent-text-disabled',
        neutral:
          'text-neutral-text-subtle hover:text-neutral-text disabled:text-neutral-text-disabled',
        primary:
          'text-primary-text-subtle hover:text-primary-text disabled:text-primary-text-disabled',
        secondary:
          'text-secondary-text-subtle hover:text-secondary-text disabled:text-secondary-text-disabled',
      } satisfies Record<DatePickerIntent, string>,
      size: {
        lg: 'size-9',
        md: 'size-8',
        sm: 'size-7',
      } satisfies Record<DatePickerSize, string>,
    },
  },
)

export const datePickerClearTriggerCVA = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  {
    variants: {
      size: {
        lg: 'size-9',
        md: 'size-8',
        sm: 'size-7',
      } satisfies Record<DatePickerSize, string>,
    },
  },
)

export const datePickerPositionerCVA = cva('origin-(--transform-origin)')

export const datePickerContentCVA = cva(
  [
    'flex flex-col gap-3 border p-3 shadow-md outline-none',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
    'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
    'min-w-[17.5rem]',
  ],
  {
    variants: {
      intent: {
        accent:
          'border-accent-border-subtle bg-accent-fill-subtle text-accent-text disabled:pointer-events-none disabled:opacity-40',
        neutral:
          'border-neutral-border-subtle bg-neutral-fill-subtle text-neutral-text disabled:pointer-events-none disabled:opacity-40',
        primary:
          'border-primary-border-subtle bg-primary-fill-subtle text-primary-text disabled:pointer-events-none disabled:opacity-40',
        secondary:
          'border-secondary-border-subtle bg-secondary-fill-subtle text-secondary-text disabled:pointer-events-none disabled:opacity-40',
      } satisfies Record<DatePickerIntent, string>,
    },
  },
)

export const datePickerViewCVA = cva('flex flex-col gap-3 data-[hidden]:hidden')

export const datePickerViewControlCVA = cva('flex min-h-8 items-stretch justify-between gap-2')

export const datePickerRangeTextCVA = cva('txt-label font-semibold', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
    } satisfies Record<DatePickerIntent, string>,
  },
})

export const datePickerSelectCVA = cva(
  'txt-caption h-8 border bg-transparent px-2 outline-none focus-visible:focus-ring',
  {
    variants: {
      intent: {
        accent: 'border-accent-border text-neutral-text',
        neutral: 'border-neutral-border text-neutral-text',
        primary: 'border-primary-border text-neutral-text',
        secondary: 'border-secondary-border text-neutral-text',
      } satisfies Record<DatePickerIntent, string>,
    },
  },
)

export const datePickerTableCVA = cva('w-full border-collapse border-spacing-0')

export const datePickerTableHeaderCVA = cva(
  'txt-caption px-0 py-2 text-center font-medium tracking-wide uppercase',
  {
    variants: {
      intent: {
        accent: 'text-accent-text-subtle',
        neutral: 'text-neutral-text-subtle',
        primary: 'text-primary-text-subtle',
        secondary: 'text-secondary-text-subtle',
      } satisfies Record<DatePickerIntent, string>,
    },
  },
)

export const datePickerTableCellCVA = cva('p-0 text-center')

const dayCellIntentClasses = {
  accent:
    'text-accent-text hover:data-[disabled=false]:data-[selected=false]:data-[unavailable=false]:bg-accent-fill-subtle-hover data-[today]:font-semibold data-[today]:text-accent-text data-[selected]:bg-accent-fill data-[selected]:text-accent-on-fill data-[in-range]:bg-accent-fill-subtle data-[range-start]:bg-accent-fill data-[range-start]:text-accent-on-fill data-[range-end]:bg-accent-fill data-[range-end]:text-accent-on-fill data-[outside-range]:text-accent-text-subtle data-[outside-range]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[unavailable]:cursor-not-allowed data-[unavailable]:line-through data-[unavailable]:opacity-40',
  neutral:
    'text-neutral-text hover:data-[disabled=false]:data-[selected=false]:data-[unavailable=false]:bg-neutral-fill-subtle-hover data-[today]:font-semibold data-[today]:text-neutral-text data-[selected]:bg-neutral-fill data-[selected]:text-neutral-on-fill data-[in-range]:bg-neutral-fill-subtle data-[range-start]:bg-neutral-fill data-[range-start]:text-neutral-on-fill data-[range-end]:bg-neutral-fill data-[range-end]:text-neutral-on-fill data-[outside-range]:text-neutral-text-subtle data-[outside-range]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[unavailable]:cursor-not-allowed data-[unavailable]:line-through data-[unavailable]:opacity-40',
  primary:
    'text-primary-text hover:data-[disabled=false]:data-[selected=false]:data-[unavailable=false]:bg-primary-fill-subtle-hover data-[today]:font-semibold data-[today]:text-primary-text data-[selected]:bg-primary-fill data-[selected]:text-primary-on-fill data-[in-range]:bg-primary-fill-subtle data-[range-start]:bg-primary-fill data-[range-start]:text-primary-on-fill data-[range-end]:bg-primary-fill data-[range-end]:text-primary-on-fill data-[outside-range]:text-primary-text-subtle data-[outside-range]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[unavailable]:cursor-not-allowed data-[unavailable]:line-through data-[unavailable]:opacity-40',
  secondary:
    'text-secondary-text hover:data-[disabled=false]:data-[selected=false]:data-[unavailable=false]:bg-secondary-fill-subtle-hover data-[today]:font-semibold data-[today]:text-secondary-text data-[selected]:bg-secondary-fill data-[selected]:text-secondary-on-fill data-[in-range]:bg-secondary-fill-subtle data-[range-start]:bg-secondary-fill data-[range-start]:text-secondary-on-fill data-[range-end]:bg-secondary-fill data-[range-end]:text-secondary-on-fill data-[outside-range]:text-secondary-text-subtle data-[outside-range]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[unavailable]:cursor-not-allowed data-[unavailable]:line-through data-[unavailable]:opacity-40',
} satisfies Record<DatePickerIntent, string>

export const datePickerDayCellTriggerCVA = cva(
  'txt-label inline-flex size-10 cursor-pointer items-center justify-center border-0 bg-transparent outline-none select-none focus-visible:focus-ring data-[focus]:focus-ring',
  {
    variants: {
      intent: dayCellIntentClasses,
    },
  },
)

export const datePickerMonthCellTriggerCVA = cva(
  'txt-label inline-flex h-10 w-full cursor-pointer items-center justify-center border-0 bg-transparent px-2 outline-none select-none focus-visible:focus-ring data-[focus]:focus-ring data-[outside-range]:invisible',
  {
    variants: {
      intent: dayCellIntentClasses,
    },
  },
)

export const datePickerYearCellTriggerCVA = cva(
  'txt-label inline-flex h-10 w-full cursor-pointer items-center justify-center border-0 bg-transparent px-2 outline-none select-none focus-visible:focus-ring data-[focus]:focus-ring data-[outside-range]:invisible',
  {
    variants: {
      intent: dayCellIntentClasses,
    },
  },
)

export const datePickerWeekNumberHeaderCellCVA = cva(
  'txt-caption w-8 px-0 py-2 text-center font-medium tracking-wide uppercase',
  {
    variants: {
      intent: {
        accent: 'bg-accent-fill-subtle text-accent-text-subtle',
        neutral: 'bg-neutral-fill-subtle text-neutral-text-subtle',
        primary: 'bg-primary-fill-subtle text-primary-text-subtle',
        secondary: 'bg-secondary-fill-subtle text-secondary-text-subtle',
      } satisfies Record<DatePickerIntent, string>,
    },
  },
)

export const datePickerWeekNumberCellCVA = cva('txt-caption w-8 p-0 text-center', {
  variants: {
    intent: {
      accent: 'bg-accent-fill-subtle text-accent-text-subtle',
      neutral: 'bg-neutral-fill-subtle text-neutral-text-subtle',
      primary: 'bg-primary-fill-subtle text-primary-text-subtle',
      secondary: 'bg-secondary-fill-subtle text-secondary-text-subtle',
    } satisfies Record<DatePickerIntent, string>,
  },
})

export const datePickerPresetTriggerCVA = cva(
  'txt-caption inline-flex cursor-pointer items-center justify-center border px-3 py-1.5 outline-none focus-visible:focus-ring data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  {
    variants: {
      intent: {
        accent:
          'border-accent-border text-accent-text hover:bg-accent-fill-subtle-hover disabled:pointer-events-none disabled:opacity-40',
        neutral:
          'border-neutral-border text-neutral-text hover:bg-neutral-fill-subtle-hover disabled:pointer-events-none disabled:opacity-40',
        primary:
          'border-primary-border text-primary-text hover:bg-primary-fill-subtle-hover disabled:pointer-events-none disabled:opacity-40',
        secondary:
          'border-secondary-border text-secondary-text hover:bg-secondary-fill-subtle-hover disabled:pointer-events-none disabled:opacity-40',
      } satisfies Record<DatePickerIntent, string>,
    },
  },
)

export const datePickerPresetGroupCVA = cva('flex flex-wrap gap-2')

export const datePickerSelectedDatesCVA = cva(
  'flex min-h-10 min-w-0 flex-1 flex-wrap items-center gap-1.5 border px-2 py-1',
  {
    variants: {
      intent: {
        accent:
          'border-accent-border bg-accent-fill-subtle disabled:pointer-events-none disabled:opacity-40',
        neutral:
          'border-neutral-border bg-neutral-fill-subtle disabled:pointer-events-none disabled:opacity-40',
        primary:
          'border-primary-border bg-primary-fill-subtle disabled:pointer-events-none disabled:opacity-40',
        secondary:
          'border-secondary-border bg-secondary-fill-subtle disabled:pointer-events-none disabled:opacity-40',
      } satisfies Record<DatePickerIntent, string>,
    },
  },
)

export const datePickerTimeInputCVA = cva(
  'txt-base mt-2 h-10 w-full border bg-transparent px-3 outline-none focus-visible:focus-ring',
  {
    variants: {
      intent: {
        accent: 'border-accent-border text-neutral-text',
        neutral: 'border-neutral-border text-neutral-text',
        primary: 'border-primary-border text-neutral-text',
        secondary: 'border-secondary-border text-neutral-text',
      } satisfies Record<DatePickerIntent, string>,
    },
  },
)

export const datePickerIconSizeCVA = cva('shrink-0', {
  variants: {
    size: {
      lg: 'size-4',
      md: 'size-3.5',
      sm: 'size-3',
    } satisfies Record<DatePickerSize, string>,
  },
})

export const datePickerMultipleMonthsCVA = cva('flex gap-4')
