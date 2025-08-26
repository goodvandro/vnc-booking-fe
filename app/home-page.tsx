"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useLanguage } from "@/hooks/use-language"
import { translations } from "@/lib/translations"
import HeroSection from "@/components/sections/hero-section"
import AboutUsSection from "@/components/sections/about-us-section"
import GuestHousesSection from "@/components/sections/guest-houses-section"
import CarRentalSection from "@/components/sections/car-rental-section"
import MarketingSection from "@/components/sections/marketing-section"
import NewsletterSection from "@/components/sections/newsletter-section"
import ContactSection from "@/components/sections/contact-section"
import Footer from "@/components/layout/footer"
import BackToTopButton from "@/components/common/back-to-top-button"
import LanguageDetector from "@/components/common/language-detector"
import GuestHouseBookingModal from "@/components/common/guest-house-booking-modal"
import CarRentalModal from "@/components/common/car-rental-modal"
import type { SelectedItem } from "@/lib/types"

export default function HomePage() {
  const { user } = useUser()
  const { language, setLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)

  // Guest House Booking Modal State
  const [isGuestHouseModalOpen, setIsGuestHouseModalOpen] = useState(false)
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<SelectedItem | null>(null)

  // Car Rental Modal State
  const [isCarRentalModalOpen, setIsCarRentalModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<SelectedItem | null>(null)

  // Get translations for current language
  const t = translations[language] || translations.en

  useEffect(() => {
    // Simulate loading time for translations
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [language])

  const handleLanguageDetected = (detectedLanguage: string) => {
    if (detectedLanguage && detectedLanguage !== language) {
      setLanguage(detectedLanguage)
    }
  }

  const handleGuestHouseBooking = (item: SelectedItem) => {
    setSelectedGuestHouse(item)
    setIsGuestHouseModalOpen(true)
  }

  const handleCarRentalBooking = (item: SelectedItem) => {
    setSelectedCar(item)
    setIsCarRentalModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <LanguageDetector onLanguageDetected={handleLanguageDetected} />

      <HeroSection t={t} />
      <AboutUsSection t={t} />
      <GuestHousesSection t={t} onBooking={handleGuestHouseBooking} />
      <CarRentalSection t={t} onBooking={handleCarRentalBooking} />
      <MarketingSection t={t} />
      <NewsletterSection t={t} />
      <ContactSection t={t} />
      <Footer t={t} />
      <BackToTopButton />

      {/* Guest House Booking Modal */}
      <GuestHouseBookingModal
        isOpen={isGuestHouseModalOpen}
        onClose={() => setIsGuestHouseModalOpen(false)}
        selectedItem={selectedGuestHouse}
        t={t}
        user={user}
      />

      {/* Car Rental Modal */}
      <CarRentalModal
        isOpen={isCarRentalModalOpen}
        onClose={() => setIsCarRentalModalOpen(false)}
        selectedItem={selectedCar}
        t={t}
        user={user}
      />
    </div>
  )
}
