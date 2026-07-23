import { createApp, defineComponent, h, type Component } from 'vue'

const IconStub = defineComponent({
  props: { class: String, name: String },
  setup(props) {
    return () => h('span', { class: props.class, 'data-icon': props.name })
  },
})

const LinkStub = defineComponent({
  props: { disabled: Boolean, to: [String, Object] },
  setup(props, { slots }) {
    return () => h('a', { href: typeof props.to === 'string' ? props.to : '#' }, slots.default?.())
  },
})

/**
 * Mount a real Vue component into the DOM for visual testing.
 * Returns a cleanup function to unmount.
 */
export function mountForVisual(
  component: Component,
  props: Record<string, unknown> = {},
  slotContent?: string,
): { el: HTMLElement; unmount: () => void } {
  const container = document.createElement('div')
  container.setAttribute('data-testid', 'visual-root')
  document.body.appendChild(container)

  const app = createApp({
    render: () => h(component, props, slotContent ? { default: () => slotContent } : undefined),
  })

  app.component('Icon', IconStub)
  app.component('Link', LinkStub)
  app.component('NuxtLink', LinkStub)

  app.mount(container)

  return {
    el: container,
    unmount: () => {
      app.unmount()
      container.remove()
    },
  }
}
