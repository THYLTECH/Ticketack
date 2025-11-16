import { usePage } from '@inertiajs/react'

interface TranslationValue {
  [key: string]: string | TranslationValue
}
type Translations = Record<string, TranslationValue>

/**
 * useTrans - translation hook with fallback support
 * @example const __ = useTrans(); __('settings.pages.profile.delete_account.title')
 */
export function useTrans() {
  const { props } = usePage<{
    translations: Translations
    translations_fallback: Translations
    locale: string
    fallback_locale: string
  }>()

  const translations = props.translations || {}
  const translationsFallback = props.translations_fallback || {}

  const findKey = (source: TranslationValue, parts: string[]): string | undefined => {
    let value: TranslationValue | undefined = source
    for (const part of parts) {
      if (typeof value === 'object' && value !== null && part in value)
        value = (value as Record<string, TranslationValue>)[part]
      else
        return undefined
    }
    return typeof value === 'string' ? value : undefined
  }

  const __ = (key: string, fallback?: string, replacements?: Record<string, string | number>): string => {
  const parts = key.split('.')

  let value = findKey(translations, parts)
  if (value === undefined)
    value = findKey(translationsFallback, parts)

  let text = value ?? fallback ?? key

  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(`:${k}`, String(v))
    }
  }

  return text
}


  return __
}
