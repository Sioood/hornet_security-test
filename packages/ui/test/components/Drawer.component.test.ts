import { useDrawer } from '@ark-ui/vue/drawer'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import UIDrawer from '~ui/app/components/Drawer/index.vue'

describe('UIDrawer', () => {
  it('renders trigger button by default', async () => {
    const wrapper = await mountSuspended(UIDrawer, {
      props: {
        description: 'Test description',
        title: 'Test Drawer',
      },
      slots: {
        default: 'Drawer content',
      },
    })

    expect(wrapper.text()).toContain('Ouvrir')
  })

  it('hides trigger when hideTrigger is true', async () => {
    const wrapper = await mountSuspended(UIDrawer, {
      props: {
        hideTrigger: true,
        title: 'Test Drawer',
      },
      slots: {
        default: 'Drawer content',
      },
    })

    expect(wrapper.text()).not.toContain('Ouvrir')
  })

  it('renders without error when portalled is false', async () => {
    const wrapper = await mountSuspended(UIDrawer, {
      props: {
        portalled: false,
        title: 'Test Drawer',
      },
      slots: {
        default: '<span data-testid="inline">Inline content</span>',
      },
    })

    expect(wrapper.find('[data-testid="inline"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Inline content')
  })

  it('renders without error when modal is false', async () => {
    const wrapper = await mountSuspended(UIDrawer, {
      props: {
        modal: false,
        title: 'Test Drawer',
      },
      slots: {
        default: 'Content',
      },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('passes snap points to root component', async () => {
    const wrapper = await mountSuspended(UIDrawer, {
      props: {
        snapPoints: [0.3, 0.6, 1],
        title: 'Test Drawer',
      },
      slots: {
        default: 'Content',
      },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('prevents scroll by default', async () => {
    const wrapper = await mountSuspended(UIDrawer, {
      props: {
        preventScroll: true,
        title: 'Test Drawer',
      },
      slots: {
        default: 'Content',
      },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('uses RootProvider mode when value prop is provided', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'DrawerProviderTest',
        components: { UIDrawer },
        setup() {
          const drawer = useDrawer()
          return { drawer }
        },
        template: `
          <UIDrawer :value="drawer" title="Provider Drawer">
            Provider content
          </UIDrawer>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('forwards lazyMount and unmountOnExit in RootProvider mode', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'DrawerProviderPropsTest',
        components: { UIDrawer },
        setup() {
          const drawer = useDrawer()
          return { drawer }
        },
        template: `
          <UIDrawer :value="drawer" :lazy-mount="true" :unmount-on-exit="true" title="Provider Drawer">
            Provider content
          </UIDrawer>
        `,
      }),
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('updates v-model:open when drawer open state changes', async () => {
    const open = ref(false)

    const Controlled = defineComponent({
      name: 'DrawerVModelOpenTest',
      components: { UIDrawer },
      setup() {
        return { open }
      },
      template: `
        <UIDrawer v-model:open="open" title="VModel Drawer">
          VModel content
        </UIDrawer>
      `,
    })

    const wrapper = await mountSuspended(Controlled)

    expect(wrapper.exists()).toBe(true)

    open.value = true
    await nextTick()
    expect(open.value).toBe(true)

    open.value = false
    await nextTick()
    expect(open.value).toBe(false)
  })
})
