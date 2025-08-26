"use client"

import { useEffect } from "react"
import { detectBrowserLanguage, saveLanguagePreference } from "@/lib/language-utils"

interface LanguageDetectorProps {
  onLanguageDetected?: (language: string) => void
  currentLanguage: string
}

export default function LanguageDetector({ onLanguageDetected, currentLanguage }: LanguageDetectorProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Check if onLanguageDetected is provided and is a function
    if (!onLanguageDetected || typeof onLanguageDetected !== "function") {
      return
    }

    // Check if user already has a language preference
    const storedLanguage = localStorage.getItem("preferred-language")

    if (!storedLanguage) {
      // No stored preference, detect from browser
      const detectedLanguage = detectBrowserLanguage()

      if (detectedLanguage !== currentLanguage) {
        onLanguageDetected(detectedLanguage)
        saveLanguagePreference(detectedLanguage)
      }
    }
  }, [onLanguageDetected, currentLanguage])

  // This component doesn't render anything
  return null
}
