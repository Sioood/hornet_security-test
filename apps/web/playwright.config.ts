import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    locale: 'fr-FR',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm build && pnpm preview',
    reuseExisting: !process.env.CI,
    stdout: 'pipe',
    timeout: 120_000,
    url: 'http://localhost:3000',
  },
})
