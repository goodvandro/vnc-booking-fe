"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { translations } from "@/lib/translations"
import HeroSection from "@/components/sections/hero-section"
import AboutUsSection from "@/components/sections/about-us-section"
import GuestHousesSection from "@/components/sections/guest-houses-section"
import CarRentalSection from "@/components/sections/car-rental-section"
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

  // Guest House Booking Modal State
  const [guestHouseModalOpen, setGuestHouseModalOpen] = useState(false)
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<SelectedItem | null>(null)
  const [ghFirstName, setGhFirstName] = useState("")
  const [ghLastName, setGhLastName] = useState("")
  const [ghPhone, setGhPhone] = useState("")
  const [ghEmail, setGhEmail] = useState("")
  const [ghSpecialRequests, setGhSpecialRequests] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [numGuests, setNumGuests] = useState(1)
  const [ghTotalPrice, setGhTotalPrice] = useState(0)

  // Car Rental Modal State
  const [carRentalModalOpen, setCarRentalModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<SelectedItem | null>(null)
  const [crFirstName, setCrFirstName] = useState("")
  const [crLastName, setCrLastName] = useState("")
  const [crEmail, setCrEmail] = useState("")
  const [crPhone, setCrPhone] = useState("")
  const [crSpecialRequests, setCrSpecialRequests] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [crTotalPrice, setCrTotalPrice] = useState(0)

  // Calculate total price for guest house bookings
  useEffect(() => {
    if (selectedGuestHouse && checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      if (nights > 0) {
        setGhTotalPrice(nights * selectedGuestHouse.data.price)
      } else {
        setGhTotalPrice(0)
      }
    } else {
      setGhTotalPrice(0)
    }
  }, [selectedGuestHouse, checkInDate, checkOutDate])

  // Calculate total price for car rentals
  useEffect(() => {
    if (selectedCar && pickupDate && returnDate) {
      const pickup = new Date(pickupDate)
      const returnD = new Date(returnDate)
      const days = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))
      if (days > 0) {
        setCrTotalPrice(days * selectedCar.data.price)
      } else {
        setCrTotalPrice(0)
      }
    } else {
      setCrTotalPrice(0)
    }
  }, [selectedCar, pickupDate, returnDate])

  const handleGuestHouseBooking = (item: any) => {
    setSelectedGuestHouse({
      type: "guestHouse",
      data: item,
    })
    setGuestHouseModalOpen(true)
  }

  const handleCarRental = (item: any) => {
    setSelectedCar({
      type: "car",
      data: item,
    })
    setCarRentalModalOpen(true)
  }

  return (
    <div className="min-h-screen">
      <HeroSection t={t} />
      <AboutUsSection t={t} />
      <GuestHousesSection t={t} onBooking={handleGuestHouseBooking} />
      <CarRentalSection t={t} onRental={handleCarRental} />
      <MarketingSection t={t} />
      <ContactSection t={t} />
      <NewsletterSection t={t} />
      <BackToTopButton />

      {/* Guest House Booking Modal */}
      <GuestHouseBookingModal
        t={t}
        open={guestHouseModalOpen}
        onOpenChange={setGuestHouseModalOpen}
        selectedItem={selectedGuestHouse}
        firstName={ghFirstName}
        setFirstName={setGhFirstName}
        lastName={ghLastName}
        setLastName={setGhLastName}
        phone={ghPhone}
        setPhone={setGhPhone}
        email={ghEmail}
        setEmail={setGhEmail}
        specialRequests={ghSpecialRequests}
        setSpecialRequests={setGhSpecialRequests}
        checkInDate={checkInDate}
        setCheckInDate={setCheckInDate}
        checkOutDate={checkOutDate}
        setCheckOutDate={setCheckOutDate}
        numGuests={numGuests}
        setNumGuests={setNumGuests}
        totalPrice={ghTotalPrice}
      />

      {/* Car Rental Modal */}
      <CarRentalModal
        t={t}
        open={carRentalModalOpen}
        onOpenChange={setCarRentalModalOpen}
        selectedItem={selectedCar}
        firstName={crFirstName}
        setFirstName={setCrFirstName}
        lastName={crLastName}
        setLastName={setCrLastName}
        email={crEmail}
        setEmail={setCrEmail}
        phone={crPhone}
        setPhone={setCrPhone}
        specialRequests={crSpecialRequests}
        setSpecialRequests={setCrSpecialRequests}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        pickupLocation={pickupLocation}
        setPickupLocation={setPickupLocation}
        totalPrice={crTotalPrice}
      />
    </div>
  )
}
