"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import Header from "@/components/layout/header"
import HeroSection from "@/components/sections/hero-section"
import GuestHousesSection from "@/components/sections/guest-houses-section"
import CarRentalSection from "@/components/sections/car-rental-section"
import AboutUsSection from "@/components/sections/about-us-section"
import MarketingSection from "@/components/sections/marketing-section"
import ContactSection from "@/components/sections/contact-section"
import NewsletterSection from "@/components/sections/newsletter-section"
import Footer from "@/components/layout/footer"
import BackToTopButton from "@/components/common/back-to-top-button"
import GuestHouseBookingModal from "@/components/common/guest-house-booking-modal"
import CarRentalModal from "@/components/common/car-rental-modal"
import type { GuestHouse, Car } from "@/lib/types"
import type { User } from "@clerk/nextjs/server"

interface BookingSiteProps {
  user: User | null | undefined
}

export default function BookingSite({ user }: BookingSiteProps) {
  const { language, t } = useLanguage()

  // Guest House Booking State
  const [isGuestHouseModalOpen, setIsGuestHouseModalOpen] = useState(false)
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<GuestHouse | null>(null)

  // Car Rental Booking State
  const [isCarRentalModalOpen, setIsCarRentalModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  const handleGuestHouseBooking = (guestHouse: GuestHouse) => {
    setSelectedGuestHouse(guestHouse)
    setIsGuestHouseModalOpen(true)
  }

  const handleCarRental = (car: Car) => {
    setSelectedCar(car)
    setIsCarRentalModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header t={t} user={user} />

      <main>
        <HeroSection t={t} />
        <GuestHousesSection t={t} onBooking={handleGuestHouseBooking} />
        <CarRentalSection t={t} onRental={handleCarRental} />
        <AboutUsSection t={t} />
        <MarketingSection t={t} />
        <ContactSection t={t} />
        <NewsletterSection t={t} />
      </main>

      <Footer t={t} />
      <BackToTopButton />

      {/* Booking Modals */}
      <GuestHouseBookingModal
        isOpen={isGuestHouseModalOpen}
        onClose={() => setIsGuestHouseModalOpen(false)}
        guestHouse={selectedGuestHouse}
        t={t}
        user={user}
      />

      <CarRentalModal
        isOpen={isCarRentalModalOpen}
        onClose={() => setIsCarRentalModalOpen(false)}
        car={selectedCar}
        t={t}
        user={user}
      />
    </div>
  )
}
