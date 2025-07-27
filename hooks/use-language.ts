"use client"

import { useState, useEffect } from "react"
import { getInitialLanguage, saveLanguagePreference } from "@/lib/language-utils"

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set initial language based on browser detection or stored preference
    const initialLanguage = getInitialLanguage()
    setCurrentLanguage(initialLanguage)
    setIsLoading(false)
  }, [])

  const changeLanguage = (newLanguage: string) => {
    setCurrentLanguage(newLanguage)
    saveLanguagePreference(newLanguage)
  }

  return {
    currentLanguage,
    setCurrentLanguage: changeLanguage,
    isLoading,
  }
}
