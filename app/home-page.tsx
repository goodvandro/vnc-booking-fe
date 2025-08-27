"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/sections/hero-section"
import GuestHousesSection from "@/components/sections/guest-houses-section"
import CarRentalSection from "@/components/sections/car-rental-section"
import MarketingSection from "@/components/sections/marketing-section"
import AboutUsSection from "@/components/sections/about-us-section"
import NewsletterSection from "@/components/sections/newsletter-section"
import ContactSection from "@/components/sections/contact-section"
import BackToTopButton from "@/components/common/back-to-top-button"
import GuestHouseBookingModal from "@/components/common/guest-house-booking-modal"
import CarRentalModal from "@/components/common/car-rental-modal"
import { translations } from "@/lib/translations"
import { useLanguage } from "@/hooks/use-language"
import { useUser } from "@clerk/nextjs"
import type { SelectedItem } from "@/lib/types"

interface HomePageProps {
  userId: string | null
}

export default function HomePage({ userId }: HomePageProps) {
  const { user } = useUser()
  const [showBackToTopButton, setShowBackToTopButton] = useState(false)

  // Use the language hook for automatic browser detection
  const { currentLanguage, setCurrentLanguage, isLoading: isLanguageLoading } = useLanguage()

  const t = translations[currentLanguage as keyof typeof translations]

  // Modal states
  const [isGuestHouseModalOpen, setIsGuestHouseModalOpen] = useState(false)
  const [isCarRentalModalOpen, setIsCarRentalModalOpen] = useState(false)
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<SelectedItem | null>(null)
  const [selectedCar, setSelectedCar] = useState<SelectedItem | null>(null)

  const handleBookNowClick = (itemData: SelectedItem["data"]) => {
    setSelectedGuestHouse({ type: "guestHouse", data: itemData })
    setIsGuestHouseModalOpen(true)
  }

  const handleRentNowClick = (itemData: SelectedItem["data"]) => {
    setSelectedCar({ type: "car", data: itemData })
    setIsCarRentalModalOpen(true)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTopButton(true)
      } else {
        setShowBackToTopButton(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Show loading state while detecting language
  if (isLanguageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header
        t={t}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        isLanguageLoading={isLanguageLoading}
      />
      <main className="flex-1">
        <HeroSection t={t} />
        <GuestHousesSection t={t} handleBookNowClick={handleBookNowClick} />
        <CarRentalSection t={t} handleRentNowClick={handleRentNowClick} />
        <MarketingSection t={t} />
        <AboutUsSection t={t} />
        <NewsletterSection t={t} />
        <ContactSection t={t} />
      </main>
      <Footer t={t} />
      <BackToTopButton t={t} show={showBackToTopButton} onClick={scrollToTop} />

      {/* Booking Modals */}
      <GuestHouseBookingModal
        isOpen={isGuestHouseModalOpen}
        onClose={() => setIsGuestHouseModalOpen(false)}
        selectedItem={selectedGuestHouse}
        t={t}
        user={user}
      />

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
