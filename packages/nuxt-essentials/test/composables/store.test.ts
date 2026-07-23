import { createPinia, defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { computed, isRef, nextTick, ref } from 'vue'

import { extractStore } from '../../app/composables/store'

const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  const increment = () => count.value++
  const reset = () => (count.value = 0)
  return { count, doubled, increment, reset }
})

describe('extractStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns state properties as refs', () => {
    const store = useCounterStore()
    const extracted = extractStore(store)

    expect(isRef(extracted.count)).toBe(true)
    expect(extracted.count.value).toBe(0)
  })

  it('returns getters as computed refs', () => {
    const store = useCounterStore()
    const extracted = extractStore(store)

    expect(isRef(extracted.doubled)).toBe(true)
    expect(extracted.doubled.value).toBe(0)
  })

  it('returns actions as plain functions', () => {
    const store = useCounterStore()
    const extracted = extractStore(store)

    expect(typeof extracted.increment).toBe('function')
    expect(typeof extracted.reset).toBe('function')
  })

  it('state refs react to mutations', async () => {
    const store = useCounterStore()
    const extracted = extractStore(store)

    extracted.increment()
    await nextTick()

    expect(extracted.count.value).toBe(1)
    expect(extracted.doubled.value).toBe(2)
  })

  it('state refs stay in sync with direct store mutations', async () => {
    const store = useCounterStore()
    const extracted = extractStore(store)

    store.count++
    await nextTick()

    expect(extracted.count.value).toBe(1)
  })

  it('reset action works through extracted proxy', async () => {
    const store = useCounterStore()
    const extracted = extractStore(store)

    extracted.increment()
    extracted.increment()
    extracted.reset()
    await nextTick()

    expect(extracted.count.value).toBe(0)
    expect(extracted.doubled.value).toBe(0)
  })
})
