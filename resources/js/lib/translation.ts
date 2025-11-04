import { usePage } from '@inertiajs/react'

type Translations = Record<string, Record<string, string | Record<string, string>>>

/**
 * useTrans - global translation function hook
 * @example const __ = useTrans(); __('auth.login.success')
 */
export function useTrans() {
  const { props } = usePage<{ translations: Translations; locale: string }>()
  const translations = props.translations || {}

  const __ = (key: string, fallback?: string): string => {
    const parts = key.split('.')
    let value: unknown = translations

    for (const part of parts) {
      if (typeof value === 'object' && value !== null && part in value)
        value = (value as Record<string, unknown>)[part]
      else
        return fallback ?? key
    }

    return typeof value === 'string' ? value : (fallback ?? key)
  }

  return __
}
