"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { translations } from "@/lib/translations"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/sections/hero-section"
import GuestHousesSection from "@/components/sections/guest-houses-section"
import CarRentalSection from "@/components/sections/car-rental-section"
import AboutUsSection from "@/components/sections/about-us-section"
import MarketingSection from "@/components/sections/marketing-section"
import ContactSection from "@/components/sections/contact-section"
import NewsletterSection from "@/components/sections/newsletter-section"
import BackToTopButton from "@/components/common/back-to-top-button"
import GuestHouseBookingModal from "@/components/common/guest-house-booking-modal"
import CarRentalModal from "@/components/common/car-rental-modal"
import type { SelectedItem } from "@/lib/types"

export default function HomePage() {
  const { currentLanguage, setCurrentLanguage, isLoading: isLanguageLoading } = useLanguage()
  const t = translations[currentLanguage as keyof typeof translations]

  // Modal states
  const [guestHouseModalOpen, setGuestHouseModalOpen] = useState(false)
  const [carRentalModalOpen, setCarRentalModalOpen] = useState(false)
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<SelectedItem["data"] | null>(null)
  const [selectedCar, setSelectedCar] = useState<SelectedItem["data"] | null>(null)
  const [showBackToTopButton, setShowBackToTopButton] = useState(false)

  // Handle guest house booking
  const handleBookNowClick = (itemData: SelectedItem["data"]) => {
    setSelectedGuestHouse({
      ...itemData,
      id: itemData.id || Math.floor(Math.random() * 1000), // Temporary ID for demo
    })
    setGuestHouseModalOpen(true)
  }

  // Handle car rental booking
  const handleRentNowClick = (itemData: SelectedItem["data"]) => {
    setSelectedCar({
      ...itemData,
      id: itemData.id || Math.floor(Math.random() * 1000), // Temporary ID for demo
    })
    setCarRentalModalOpen(true)
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

      {/* Guest House Booking Modal */}
      {selectedGuestHouse && (
        <GuestHouseBookingModal
          isOpen={guestHouseModalOpen}
          onClose={() => {
            setGuestHouseModalOpen(false)
            setSelectedGuestHouse(null)
          }}
          guestHouse={{
            id: selectedGuestHouse.id || 1,
            title: selectedGuestHouse.title,
            price: selectedGuestHouse.price,
            location: selectedGuestHouse.location,
            images: selectedGuestHouse.images || [],
          }}
        />
      )}

      {/* Car Rental Modal */}
      {selectedCar && (
        <CarRentalModal
          isOpen={carRentalModalOpen}
          onClose={() => {
            setCarRentalModalOpen(false)
            setSelectedCar(null)
          }}
          car={{
            id: selectedCar.id || 1,
            title: selectedCar.title,
            price: selectedCar.price,
            seats: selectedCar.seats || 4,
            transmission: selectedCar.transmission || "Manual",
            images: selectedCar.images || [],
          }}
        />
      )}
    </div>
  )
}
