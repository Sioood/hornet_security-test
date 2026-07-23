import { page } from '@vitest/browser/context'
import { test, afterEach } from 'vitest'

import Button from '~ui/app/components/Button.vue'

import { mountForVisual } from './mount'
import { expectPngSnapshot } from './png-snapshot'

const specFolder = 'button.visual.test.ts'
const screenshotDir = `./__screenshots__/${specFolder}`

let cleanup: (() => void) | undefined

afterEach(() => {
  cleanup?.()
  cleanup = undefined
})

test('Button default/neutral renders correctly', async () => {
  const { el, unmount } = mountForVisual(Button, {
    intent: 'neutral',
    size: 'md',
    text: 'Click me',
    variant: 'default',
  })
  cleanup = unmount

  await expectPngSnapshot({
    element: el.querySelector('button')!,
    filename: 'button-default-neutral.png',
    screenshotPathFromTestFile: `${screenshotDir}/button-default-neutral.png`,
    specFolder,
  })
})

test('Button default/primary renders correctly', async () => {
  const { el, unmount } = mountForVisual(Button, {
    intent: 'primary',
    size: 'md',
    text: 'Primary',
    variant: 'default',
  })
  cleanup = unmount

  await expectPngSnapshot({
    element: el.querySelector('button')!,
    filename: 'button-default-primary.png',
    screenshotPathFromTestFile: `${screenshotDir}/button-default-primary.png`,
    specFolder,
  })
})

test('Button default/primary (defaults) hover shows hover styles', async () => {
  const { el, unmount } = mountForVisual(Button, {
    text: 'Hover me',
  })
  cleanup = unmount

  const btn = el.querySelector('button')!
  const locator = page.elementLocator(btn)
  await locator.hover()
  try {
    await expectPngSnapshot({
      element: btn,
      filename: 'button-default-primary-hover.png',
      screenshotPathFromTestFile: `${screenshotDir}/button-default-primary-hover.png`,
      specFolder,
    })
  } finally {
    await locator.unhover()
  }
})

test('Button subtle/secondary renders correctly', async () => {
  const { el, unmount } = mountForVisual(Button, {
    intent: 'secondary',
    size: 'md',
    text: 'Secondary',
    variant: 'subtle',
  })
  cleanup = unmount

  await expectPngSnapshot({
    element: el.querySelector('button')!,
    filename: 'button-subtle-secondary.png',
    screenshotPathFromTestFile: `${screenshotDir}/button-subtle-secondary.png`,
    specFolder,
  })
})

test('Button ghost/accent renders correctly', async () => {
  const { el, unmount } = mountForVisual(Button, {
    intent: 'accent',
    size: 'md',
    text: 'Ghost',
    variant: 'ghost',
  })
  cleanup = unmount

  await expectPngSnapshot({
    element: el.querySelector('button')!,
    filename: 'button-ghost-accent.png',
    screenshotPathFromTestFile: `${screenshotDir}/button-ghost-accent.png`,
    specFolder,
  })
})

test('Button small size renders correctly', async () => {
  const { el, unmount } = mountForVisual(Button, {
    intent: 'primary',
    size: 'sm',
    text: 'Small',
    variant: 'default',
  })
  cleanup = unmount

  await expectPngSnapshot(
    el.querySelector('button')!,
    specFolder,
    `${screenshotDir}/button-size-sm.png`,
    'button-size-sm.png',
  )
})

test('Button large size renders correctly', async () => {
  const { el, unmount } = mountForVisual(Button, {
    intent: 'primary',
    size: 'lg',
    text: 'Large',
    variant: 'default',
  })
  cleanup = unmount

  await expectPngSnapshot({
    element: el.querySelector('button')!,
    filename: 'button-size-lg.png',
    screenshotPathFromTestFile: `${screenshotDir}/button-size-lg.png`,
    specFolder,
  })
})

test('Button disabled state renders correctly', async () => {
  const { el, unmount } = mountForVisual(Button, {
    disabled: true,
    intent: 'primary',
    size: 'md',
    text: 'Disabled',
    variant: 'default',
  })
  cleanup = unmount

  await expectPngSnapshot({
    element: el.querySelector('button')!,
    filename: 'button-disabled.png',
    screenshotPathFromTestFile: `${screenshotDir}/button-disabled.png`,
    specFolder,
  })
})
