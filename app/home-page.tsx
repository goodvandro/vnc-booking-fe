"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import HeroSection from "@/components/sections/hero-section"
import GuestHousesSection from "@/components/sections/guest-houses-section"
import CarRentalSection from "@/components/sections/car-rental-section"
import MarketingSection from "@/components/sections/marketing-section"
import AboutUsSection from "@/components/sections/about-us-section"
import ContactSection from "@/components/sections/contact-section"
import NewsletterSection from "@/components/sections/newsletter-section"
import Footer from "@/components/layout/footer"
import GuestHouseBookingModal from "@/components/common/guest-house-booking-modal"
import CarRentalModal from "@/components/common/car-rental-modal"
import BackToTopButton from "@/components/common/back-to-top-button"
import FloatingWhatsApp from "@/components/common/floating-whatsapp"
import { useLanguage } from "@/hooks/use-language"
import { useStrapiData } from "@/lib/use-strapi-data"
import type { GuestHouse, Car } from "@/lib/types"

interface SelectedGuestHouse extends GuestHouse {
  id: number
}

interface SelectedCar extends Car {
  id: number
  carId: number
}

export default function HomePage() {
  const { language, t } = useLanguage()
  const { user } = useUser()
  const { guestHouses, cars, loading, error } = useStrapiData()

  // Modal states
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<SelectedGuestHouse | null>(null)
  const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null)
  const [isGuestHouseModalOpen, setIsGuestHouseModalOpen] = useState(false)
  const [isCarModalOpen, setIsCarModalOpen] = useState(false)

  const whatsappNumber = "+1234567890" // Replace with actual WhatsApp number

  const handleBookNowClick = (guestHouse: GuestHouse) => {
    setSelectedGuestHouse({
      ...guestHouse,
      id: guestHouse.id,
    })
    setIsGuestHouseModalOpen(true)
  }

  const handleRentNowClick = (car: Car) => {
    setSelectedCar({
      ...car,
      id: car.id,
      carId: car.id,
    })
    setIsCarModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection t={t} />
        <GuestHousesSection t={t} guestHouses={guestHouses} onBookNow={handleBookNowClick} />
        <CarRentalSection t={t} cars={cars} onRentNow={handleRentNowClick} />
        <MarketingSection t={t} />
        <AboutUsSection t={t} />
        <ContactSection t={t} user={user} />
        <NewsletterSection t={t} />
      </main>

      <Footer t={t} />

      {/* Modals */}
      <GuestHouseBookingModal
        isOpen={isGuestHouseModalOpen}
        onClose={() => setIsGuestHouseModalOpen(false)}
        selectedGuestHouse={selectedGuestHouse}
        t={t}
      />

      <CarRentalModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        selectedCar={selectedCar}
        t={t}
      />

      {/* Floating Components */}
      <BackToTopButton />
      <FloatingWhatsApp phoneNumber={whatsappNumber} t={t} />
    </div>
  )
}
