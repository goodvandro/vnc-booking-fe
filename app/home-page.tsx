"use client"

import { useState, useMemo, useEffect } from "react"
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
import type { SelectedItem } from "@/lib/types"

export default function HomePage() {
  const [openGuestHouseModal, setOpenGuestHouseModal] = useState(false)
  const [openCarRentalModal, setOpenCarRentalModal] = useState(false)
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<SelectedItem | null>(null)
  const [selectedCar, setSelectedCar] = useState<SelectedItem | null>(null)
  const [showBackToTopButton, setShowBackToTopButton] = useState(false)

  // Use the language hook for automatic browser detection
  const { currentLanguage, setCurrentLanguage, isLoading: isLanguageLoading } = useLanguage()

  const t = translations[currentLanguage as keyof typeof translations]

  // Guest House specific state
  const [ghFirstName, setGhFirstName] = useState("")
  const [ghLastName, setGhLastName] = useState("")
  const [ghPhone, setGhPhone] = useState("")
  const [ghEmail, setGhEmail] = useState("")
  const [ghSpecialRequests, setGhSpecialRequests] = useState("")
  const [ghCheckInDate, setGhCheckInDate] = useState("")
  const [ghCheckOutDate, setGhCheckOutDate] = useState("")
  const [ghNumGuests, setGhNumGuests] = useState(1)

  // Car Rental specific state
  const [crFirstName, setCrFirstName] = useState("")
  const [crLastName, setCrLastName] = useState("")
  const [crEmail, setCrEmail] = useState("")
  const [crPhone, setCrPhone] = useState("")
  const [crSpecialRequests, setCrSpecialRequests] = useState("")
  const [crPickupDate, setCrPickupDate] = useState("")
  const [crReturnDate, setCrReturnDate] = useState("")
  const [crPickupLocation, setCrPickupLocation] = useState("")

  const handleBookNowClick = (itemData: SelectedItem["data"]) => {
    setSelectedGuestHouse({ type: "guestHouse", data: itemData })
    setOpenGuestHouseModal(true)
    // Reset guest house form fields
    setGhFirstName("")
    setGhLastName("")
    setGhPhone("")
    setGhEmail("")
    setGhSpecialRequests("")
    setGhCheckInDate("")
    setGhCheckOutDate("")
    setGhNumGuests(1)
  }

  const handleRentNowClick = (itemData: SelectedItem["data"]) => {
    setSelectedCar({ type: "car", data: itemData })
    setOpenCarRentalModal(true)
    // Reset car rental form fields
    setCrFirstName("")
    setCrLastName("")
    setCrEmail("")
    setCrPhone("")
    setCrSpecialRequests("")
    setCrPickupDate("")
    setCrReturnDate("")
    setCrPickupLocation("")
  }

  const ghTotalPrice = useMemo(() => {
    if (selectedGuestHouse?.type === "guestHouse" && ghCheckInDate && ghCheckOutDate) {
      const checkIn = new Date(ghCheckInDate)
      const checkOut = new Date(ghCheckOutDate)
      if (checkOut <= checkIn) return 0
      const timeDiff = checkOut.getTime() - checkIn.getTime()
      const numNights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      const pricePerNight = selectedGuestHouse.data.price
      return numNights * pricePerNight
    }
    return 0
  }, [selectedGuestHouse, ghCheckInDate, ghCheckOutDate])

  const crTotalPrice = useMemo(() => {
    if (selectedCar?.type === "car" && crPickupDate && crReturnDate) {
      const pickup = new Date(crPickupDate)
      const returns = new Date(crReturnDate)
      if (returns <= pickup) return 0
      const timeDiff = returns.getTime() - pickup.getTime()
      const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
      const pricePerDay = selectedCar.data.price
      return numDays * pricePerDay
    }
    return 0
  }, [selectedCar, crPickupDate, crReturnDate])

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
      <GuestHouseBookingModal
        t={t}
        open={openGuestHouseModal}
        onOpenChange={setOpenGuestHouseModal}
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
        checkInDate={ghCheckInDate}
        setCheckInDate={setGhCheckInDate}
        checkOutDate={ghCheckOutDate}
        setCheckOutDate={setGhCheckOutDate}
        numGuests={ghNumGuests}
        setNumGuests={setGhNumGuests}
        totalPrice={ghTotalPrice}
      />

      {/* Car Rental Modal */}
      <CarRentalModal
        t={t}
        open={openCarRentalModal}
        onOpenChange={setOpenCarRentalModal}
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
        pickupDate={crPickupDate}
        setPickupDate={setCrPickupDate}
        returnDate={crReturnDate}
        setReturnDate={setCrReturnDate}
        pickupLocation={crPickupLocation}
        setPickupLocation={setCrPickupLocation}
        totalPrice={crTotalPrice}
      />
    </div>
  )
}
