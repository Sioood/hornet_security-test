import { useColorMode } from '@vueuse/core'

export type AppThemePreference = 'auto' | 'dark' | 'light'

const THEME_COOKIE_KEY = 'hornet-books-theme'

export function useAppColorMode() {
  const themeCookie = useCookie<AppThemePreference>(THEME_COOKIE_KEY, {
    default: () => 'auto',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const colorMode = useColorMode({
    attribute: 'class',
    initialValue: themeCookie.value,
    modes: {
      auto: '',
      dark: 'dark',
      light: 'light',
    },
    storage: {
      getItem: () => themeCookie.value,
      removeItem: () => {
        themeCookie.value = 'auto'
      },
      setItem: (_key, value) => {
        themeCookie.value = value as AppThemePreference
      },
    },
    storageKey: THEME_COOKIE_KEY,
  })

  const isDark = computed(() => {
    if (themeCookie.value === 'dark') {
      return true
    }
    if (themeCookie.value === 'light') {
      return false
    }
    return colorMode.system.value === 'dark'
  })

  function setTheme(preference: AppThemePreference) {
    themeCookie.value = preference
    colorMode.value = preference
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return {
    colorMode,
    isDark,
    preference: themeCookie,
    setTheme,
    toggleTheme,
  }
}
