"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/sections/hero-section"
import GuestHousesSection from "@/components/sections/guest-houses-section"
import CarRentalSection from "@/components/sections/car-rental-section"
import MarketingSection from "@/components/sections/marketing-section"
import AboutUsSection from "@/components/sections/about-us-section"
import ContactSection from "@/components/sections/contact-section"
import NewsletterSection from "@/components/sections/newsletter-section"
import BackToTopButton from "@/components/common/back-to-top-button"
import GuestHouseBookingModal from "@/components/common/guest-house-booking-modal"
import CarRentalModal from "@/components/common/car-rental-modal"
import LanguageDetector from "@/components/common/language-detector"
import { useLanguage } from "@/hooks/use-language"
import { translations } from "@/lib/translations"
import type { GuestHouse, Car } from "@/lib/types"

export default function HomePage() {
  const { user } = useUser()
  const { currentLanguage, setCurrentLanguage, isLoading: isLanguageLoading } = useLanguage()

  // Guest House Modal State
  const [isGuestHouseModalOpen, setIsGuestHouseModalOpen] = useState(false)
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<GuestHouse | null>(null)

  // Car Rental Modal State
  const [isCarRentalModalOpen, setIsCarRentalModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  // Get translations for current language
  const t = translations[currentLanguage] || translations.en

  const handleGuestHouseBooking = (guestHouse: GuestHouse) => {
    setSelectedGuestHouse(guestHouse)
    setIsGuestHouseModalOpen(true)
  }

  const handleCarRentalBooking = (car: Car) => {
    setSelectedCar(car)
    setIsCarRentalModalOpen(true)
  }

  // Show loading state while language is being detected
  if (isLanguageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LanguageDetector />

      <Header
        t={t}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        isLanguageLoading={isLanguageLoading}
      />

      <main className="flex-1">
        <HeroSection t={t} />
        <GuestHousesSection t={t} onBooking={handleGuestHouseBooking} />
        <CarRentalSection t={t} onBooking={handleCarRentalBooking} />
        <MarketingSection t={t} />
        <AboutUsSection t={t} />
        <ContactSection t={t} />
        <NewsletterSection t={t} />
      </main>

      <Footer t={t} />
      <BackToTopButton t={t} />

      {/* Guest House Booking Modal */}
      <GuestHouseBookingModal
        isOpen={isGuestHouseModalOpen}
        onClose={() => {
          setIsGuestHouseModalOpen(false)
          setSelectedGuestHouse(null)
        }}
        guestHouse={selectedGuestHouse}
        t={t}
        user={user}
      />

      {/* Car Rental Modal */}
      <CarRentalModal
        isOpen={isCarRentalModalOpen}
        onClose={() => {
          setIsCarRentalModalOpen(false)
          setSelectedCar(null)
        }}
        car={selectedCar}
        t={t}
        user={user}
      />
    </div>
  )
}
