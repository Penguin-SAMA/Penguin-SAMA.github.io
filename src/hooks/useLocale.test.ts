// @vitest-environment jsdom

import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  LOCALE_STORAGE_KEY,
  buildLocaleUrl,
  localeDocumentLanguage,
  localeFromSearch,
  readStoredLocale,
  resolveLocale,
  syncLocaleToEnvironment,
  useLocale,
  writeStoredLocale,
} from './useLocale'

describe('locale helpers', () => {
  it('accepts only supported URL values', () => {
    expect(localeFromSearch('?lang=en')).toBe('en')
    expect(localeFromSearch('?lang=zh')).toBe('zh')
    expect(localeFromSearch('?lang=fr')).toBeNull()
    expect(localeFromSearch('')).toBeNull()
  })

  it('prefers a valid URL locale, then storage, then Chinese', () => {
    expect(resolveLocale('?lang=en', 'zh')).toBe('en')
    expect(resolveLocale('?lang=zh', 'en')).toBe('zh')
    expect(resolveLocale('?lang=fr', 'en')).toBe('en')
    expect(resolveLocale('', 'invalid')).toBe('zh')
    expect(resolveLocale('', null)).toBe('zh')
  })

  it('writes English to the URL and removes the Chinese parameter', () => {
    const location = {
      pathname: '/portfolio',
      search: '?source=resume&lang=zh',
      hash: '#projects',
    }

    expect(buildLocaleUrl('en', location)).toBe(
      '/portfolio?source=resume&lang=en#projects',
    )
    expect(buildLocaleUrl('zh', location)).toBe(
      '/portfolio?source=resume#projects',
    )
  })

  it('maps locales to valid document language tags', () => {
    expect(localeDocumentLanguage('zh')).toBe('zh-CN')
    expect(localeDocumentLanguage('en')).toBe('en')
  })

  it('tolerates missing or blocked storage and history', () => {
    const blockedStorage = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }

    expect(readStoredLocale(null)).toBeNull()
    expect(readStoredLocale(blockedStorage)).toBeNull()
    expect(() => writeStoredLocale(blockedStorage, 'en')).not.toThrow()
    expect(() =>
      syncLocaleToEnvironment('en', {
        location: null,
        history: null,
        storage: null,
        documentElement: null,
      }),
    ).not.toThrow()
  })
})

describe('useLocale', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState({}, '', '/portfolio')
    document.documentElement.lang = 'en'
  })

  afterEach(() => {
    cleanup()
  })

  it('defaults to Chinese and synchronizes the browser environment', async () => {
    const { result } = renderHook(() => useLocale())

    expect(result.current.locale).toBe('zh')

    await waitFor(() => {
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('zh')
      expect(document.documentElement.lang).toBe('zh-CN')
      expect(window.location.search).toBe('')
    })
  })

  it('lets a valid URL parameter override localStorage', async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'zh')
    window.history.replaceState({}, '', '/portfolio?source=resume&lang=en')

    const { result } = renderHook(() => useLocale())

    expect(result.current.locale).toBe('en')

    await waitFor(() => {
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en')
      expect(document.documentElement.lang).toBe('en')
      expect(window.location.search).toBe('?source=resume&lang=en')
    })
  })

  it('updates URL, storage, and document language when toggled', async () => {
    window.history.replaceState({}, '', '/portfolio?source=resume#projects')
    const { result } = renderHook(() => useLocale())

    act(() => result.current.toggleLocale())

    await waitFor(() => {
      expect(result.current.locale).toBe('en')
      expect(window.location.search).toBe('?source=resume&lang=en')
      expect(window.location.hash).toBe('#projects')
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en')
      expect(document.documentElement.lang).toBe('en')
    })

    act(() => result.current.setLocale('zh'))

    await waitFor(() => {
      expect(result.current.locale).toBe('zh')
      expect(window.location.search).toBe('?source=resume')
      expect(window.location.hash).toBe('#projects')
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('zh')
      expect(document.documentElement.lang).toBe('zh-CN')
    })
  })
})
