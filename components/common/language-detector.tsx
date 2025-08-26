"use client"

import { useEffect } from "react"

interface LanguageDetectorProps {
  onLanguageDetected?: (language: string) => void
}

export default function LanguageDetector({ onLanguageDetected }: LanguageDetectorProps) {
  useEffect(() => {
    const detectLanguage = () => {
      try {
        // Get browser language
        const browserLang = navigator.language || navigator.languages?.[0] || "en"
        const langCode = browserLang.split("-")[0].toLowerCase()

        // Supported languages
        const supportedLanguages = ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"]
        const detectedLang = supportedLanguages.includes(langCode) ? langCode : "en"

        // Call the callback if provided and is a function
        if (onLanguageDetected && typeof onLanguageDetected === "function") {
          onLanguageDetected(detectedLang)
        }
      } catch (error) {
        console.warn("Language detection failed:", error)
        // Fallback to English
        if (onLanguageDetected && typeof onLanguageDetected === "function") {
          onLanguageDetected("en")
        }
      }
    }

    // Detect language on mount
    detectLanguage()
  }, [onLanguageDetected])

  return null // This component doesn't render anything
}
