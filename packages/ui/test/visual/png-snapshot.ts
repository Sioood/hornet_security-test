import { commands, page } from '@vitest/browser/context'
import { expect } from 'vitest'

/**
 * Disk path relative to the Vitest project `root` (e.g. `packages/ui`).
 * Must match the `path` passed to `screenshot({ path })` (resolved from the test file dir).
 */
function pngSnapshotDiskPath(specFolder: string, filename: string): string {
  return `test/visual/__screenshots__/${specFolder}/${filename}`
}

type VitestWorker = { config?: { snapshotOptions?: { updateSnapshot?: string } } }

function isSnapshotUpdateMode(): boolean {
  const worker = (globalThis as { __vitest_worker__?: VitestWorker }).__vitest_worker__
  const u = worker?.config?.snapshotOptions?.updateSnapshot
  return u === 'all' || u === 'new'
}

/**
 * Compare or update a PNG baseline. On `vitest -u`, writes a real binary PNG via Playwright.
 * Otherwise compares base64 from the browser with the file read as base64 on the server.
 */
export async function expectPngSnapshot({
  element,
  specFolder,
  screenshotPathFromTestFile,
  filename,
}: {
  element: Element
  specFolder: string
  screenshotPathFromTestFile: string
  filename: string
}): Promise<void> {
  const diskPath = pngSnapshotDiskPath(specFolder, filename)

  if (isSnapshotUpdateMode()) {
    await page.elementLocator(element).screenshot({ path: screenshotPathFromTestFile, save: true })
    return
  }

  const actual = await page.elementLocator(element).screenshot({ base64: true, save: false })
  if (typeof actual !== 'string') {
    throw new Error('Expected base64 string from screenshot({ save: false })')
  }

  let expected: string
  try {
    expected = await commands.readFile(diskPath, { encoding: 'base64' })
  } catch {
    throw new Error(
      `Missing PNG baseline: ${diskPath}. Create it with: pnpm test:visual -- test/visual/<spec>.visual.test.ts -u`,
    )
  }

  expect(actual, diskPath).toBe(expected)
}
