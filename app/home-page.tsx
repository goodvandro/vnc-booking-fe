"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import HeroSection from "@/components/sections/hero-section"
import GuestHousesSection from "@/components/sections/guest-houses-section"
import CarRentalSection from "@/components/sections/car-rental-section"
import AboutUsSection from "@/components/sections/about-us-section"
import ContactSection from "@/components/sections/contact-section"
import NewsletterSection from "@/components/sections/newsletter-section"
import MarketingSection from "@/components/sections/marketing-section"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import BackToTopButton from "@/components/common/back-to-top-button"
import GuestHouseBookingModal from "@/components/common/guest-house-booking-modal"
import CarRentalModal from "@/components/common/car-rental-modal"
import LanguageDetector from "@/components/common/language-detector"
import { useLanguage } from "@/hooks/use-language"
import { getTranslations } from "@/lib/translations"
import type { GuestHouse, Car } from "@/lib/types"

export default function HomePage() {
  const { user } = useUser()
  const { language, setLanguage } = useLanguage()
  const [translations, setTranslations] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Guest House Modal State
  const [isGuestHouseModalOpen, setIsGuestHouseModalOpen] = useState(false)
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<GuestHouse | null>(null)

  // Car Rental Modal State
  const [isCarRentalModalOpen, setIsCarRentalModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true)
      try {
        const t = await getTranslations(language)
        setTranslations(t)
      } catch (error) {
        console.error("Failed to load translations:", error)
        // Fallback to English if translation loading fails
        const fallbackT = await getTranslations("en")
        setTranslations(fallbackT)
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [language])

  // Handle language detection
  const handleLanguageDetected = (detectedLanguage: string) => {
    setLanguage(detectedLanguage)
  }

  // Guest House Modal Handlers
  const handleGuestHouseBooking = (guestHouse: GuestHouse) => {
    setSelectedGuestHouse(guestHouse)
    setIsGuestHouseModalOpen(true)
  }

  const closeGuestHouseModal = () => {
    setIsGuestHouseModalOpen(false)
    setSelectedGuestHouse(null)
  }

  // Car Rental Modal Handlers
  const handleCarRental = (car: Car) => {
    setSelectedCar(car)
    setIsCarRentalModalOpen(true)
  }

  const closeCarRentalModal = () => {
    setIsCarRentalModalOpen(false)
    setSelectedCar(null)
  }

  // Show loading state while translations are loading
  if (isLoading || !translations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <LanguageDetector onLanguageDetected={handleLanguageDetected} currentLanguage={language} />

      <Header t={translations} />

      <main>
        <HeroSection t={translations} />
        <GuestHousesSection t={translations} onBooking={handleGuestHouseBooking} />
        <CarRentalSection t={translations} onRental={handleCarRental} />
        <AboutUsSection t={translations} />
        <MarketingSection t={translations} />
        <ContactSection t={translations} />
        <NewsletterSection t={translations} />
      </main>

      <Footer t={translations} />
      <BackToTopButton />

      {/* Guest House Booking Modal */}
      <GuestHouseBookingModal
        isOpen={isGuestHouseModalOpen}
        onClose={closeGuestHouseModal}
        guestHouse={selectedGuestHouse}
        t={translations}
        user={user}
      />

      {/* Car Rental Modal */}
      <CarRentalModal
        isOpen={isCarRentalModalOpen}
        onClose={closeCarRentalModal}
        car={selectedCar}
        t={translations}
        user={user}
      />
    </div>
  )
}
