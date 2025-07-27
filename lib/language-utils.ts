import { translations } from "./translations"

// Get supported languages from translations
export const supportedLanguages = Object.keys(translations)

// Detect browser language and return supported language or fallback to English
export function detectBrowserLanguage(): string {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return "en" // Default for server-side rendering
  }

  // Get browser languages in order of preference
  const browserLanguages = navigator.languages || [navigator.language]

  // Check each browser language against supported languages
  for (const browserLang of browserLanguages) {
    // Extract language code (e.g., 'en-US' -> 'en', 'pt-BR' -> 'pt')
    const langCode = browserLang.toLowerCase().split("-")[0]

    // Check if this language is supported
    if (supportedLanguages.includes(langCode)) {
      return langCode
    }
  }

  // Fallback to English if no supported language found
  return "en"
}

// Get initial language (browser detection or stored preference)
export function getInitialLanguage(): string {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return "en"
  }

  // First check if user has a stored language preference
  const storedLanguage = localStorage.getItem("preferred-language")
  if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
    return storedLanguage
  }

  // If no stored preference, detect from browser
  return detectBrowserLanguage()
}

// Save language preference to localStorage
export function saveLanguagePreference(language: string): void {
  if (typeof window !== "undefined" && supportedLanguages.includes(language)) {
    localStorage.setItem("preferred-language", language)
  }
}

// Clear language preference (will fall back to browser detection)
export function clearLanguagePreference(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("preferred-language")
  }
}
