import nuxtEnvironment from '@nuxt/test-utils/vitest-environment'

/** Vitest 4+ requires `viteEnvironment`; @nuxt/test-utils 4.0.3 omits it on the bundled environment. */
export default {
  ...nuxtEnvironment,
  viteEnvironment: 'client' as const,
}
