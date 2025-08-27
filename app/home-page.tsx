"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { translations } from "@/lib/translations"
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
  const { language } = useLanguage()
  const t = translations[language]

  // Modal states
  const [guestHouseModalOpen, setGuestHouseModalOpen] = useState(false)
  const [carRentalModalOpen, setCarRentalModalOpen] = useState(false)
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<SelectedItem["data"] | null>(null)
  const [selectedCar, setSelectedCar] = useState<SelectedItem["data"] | null>(null)

  // Handle guest house booking
  const handleBookNowClick = (itemData: SelectedItem["data"]) => {
    setSelectedGuestHouse({
      ...itemData,
      id: Math.floor(Math.random() * 1000), // Temporary ID for demo
    })
    setGuestHouseModalOpen(true)
  }

  // Handle car rental booking
  const handleRentNowClick = (itemData: SelectedItem["data"]) => {
    setSelectedCar({
      ...itemData,
      id: Math.floor(Math.random() * 1000), // Temporary ID for demo
    })
    setCarRentalModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection t={t} />
      <GuestHousesSection t={t} handleBookNowClick={handleBookNowClick} />
      <CarRentalSection t={t} handleRentNowClick={handleRentNowClick} />
      <AboutUsSection t={t} />
      <MarketingSection t={t} />
      <ContactSection t={t} />
      <NewsletterSection t={t} />
      <BackToTopButton />

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
            images: selectedGuestHouse.images,
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
            images: selectedCar.images,
          }}
        />
      )}
    </div>
  )
}
