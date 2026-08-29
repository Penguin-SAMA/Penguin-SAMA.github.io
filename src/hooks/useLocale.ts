import { useCallback, useEffect, useState } from 'react'

import type { Locale } from '../content/portfolio'

export const LOCALE_STORAGE_KEY = 'portfolio-locale'

export interface LocaleLocation {
  pathname: string
  search: string
  hash: string
}

export interface LocaleEnvironment {
  location?: LocaleLocation | null
  history?: Pick<History, 'replaceState' | 'state'> | null
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null
  documentElement?: Pick<HTMLElement, 'lang'> | null
}

export interface UseLocaleResult {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

export const isLocale = (value: unknown): value is Locale =>
  value === 'zh' || value === 'en'

export const localeFromSearch = (search: string): Locale | null => {
  const candidate = new URLSearchParams(search).get('lang')
  return isLocale(candidate) ? candidate : null
}

export const resolveLocale = (
  search: string,
  storedLocale: string | null | undefined,
): Locale => localeFromSearch(search) ?? (isLocale(storedLocale) ? storedLocale : 'zh')

export const localeDocumentLanguage = (locale: Locale): string =>
  locale === 'zh' ? 'zh-CN' : 'en'

export const buildLocaleUrl = (
  locale: Locale,
  location: LocaleLocation,
): string => {
  const params = new URLSearchParams(location.search)

  if (locale === 'en') {
    params.set('lang', 'en')
  } else {
    params.delete('lang')
  }

  const search = params.toString()
  return `${location.pathname}${search ? `?${search}` : ''}${location.hash}`
}

export const readStoredLocale = (
  storage: Pick<Storage, 'getItem'> | null | undefined,
): string | null => {
  try {
    return storage?.getItem(LOCALE_STORAGE_KEY) ?? null
  } catch {
    return null
  }
}

export const writeStoredLocale = (
  storage: Pick<Storage, 'setItem'> | null | undefined,
  locale: Locale,
): void => {
  try {
    storage?.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Storage can be unavailable in privacy-restricted or non-browser contexts.
  }
}

export const syncLocaleToEnvironment = (
  locale: Locale,
  environment: LocaleEnvironment,
): void => {
  writeStoredLocale(environment.storage, locale)

  if (environment.documentElement) {
    environment.documentElement.lang = localeDocumentLanguage(locale)
  }

  if (!environment.location || !environment.history) {
    return
  }

  const nextUrl = buildLocaleUrl(locale, environment.location)
  const currentUrl = `${environment.location.pathname}${environment.location.search}${environment.location.hash}`

  if (nextUrl === currentUrl) {
    return
  }

  try {
    environment.history.replaceState(environment.history.state, '', nextUrl)
  } catch {
    // History can be unavailable in embedded, sandboxed, or non-browser contexts.
  }
}

const getBrowserEnvironment = (): LocaleEnvironment => {
  if (typeof window === 'undefined') {
    return {
      documentElement:
        typeof document === 'undefined' ? null : document.documentElement,
    }
  }

  const storage = (() => {
    try {
      return window.localStorage
    } catch {
      return null
    }
  })()

  const history = (() => {
    try {
      return window.history
    } catch {
      return null
    }
  })()

  const location = (() => {
    try {
      return {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      }
    } catch {
      return null
    }
  })()

  return {
    location,
    history,
    storage,
    documentElement:
      typeof document === 'undefined' ? null : document.documentElement,
  }
}

const getInitialLocale = (): Locale => {
  const environment = getBrowserEnvironment()
  return resolveLocale(
    environment.location?.search ?? '',
    readStoredLocale(environment.storage),
  )
}

export const useLocale = (): UseLocaleResult => {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    syncLocaleToEnvironment(locale, getBrowserEnvironment())
  }, [locale])

  const toggleLocale = useCallback(() => {
    setLocale((currentLocale) => (currentLocale === 'zh' ? 'en' : 'zh'))
  }, [])

  return { locale, setLocale, toggleLocale }
}
