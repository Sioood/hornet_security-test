/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  cleanTempDir: 'always',
  htmlReporter: { fileName: 'reports/stryker-mutation.html' },
  inPlace: true,
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',
  mutate: ['i18n/utils/**/*.ts', 'app/composables/**/*.ts', '!**/*.d.ts'],
  plugins: [import.meta.resolve('@stryker-mutator/vitest-runner')],
  reporters: ['html', 'progress', 'clear-text'],
  tempDirName: '.stryker-tmp',
  testRunner: 'vitest',
  thresholds: { break: null, high: 80, low: 60 },
  vitest: {
    configFile: 'vitest.config.ts',
    dir: '.',
  },
}
