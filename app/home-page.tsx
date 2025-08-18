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
import BookingRentalModal from "@/components/common/booking-rental-modal"
import { translations } from "@/lib/translations"
import { useLanguage } from "@/hooks/use-language"
import type { SelectedItem } from "@/lib/types"

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
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

  //   const guestHouses = await getGuestHouses();
  // console.log("guestHouses", guestHouses);

  const handleBookNowClick = (itemData: SelectedItem["data"]) => {
    setSelectedItem({ type: "guestHouse", data: itemData })
    setOpenModal(true)
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
    setSelectedItem({ type: "car", data: itemData })
    setOpenModal(true)
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
    if (selectedItem?.type === "guestHouse" && ghCheckInDate && ghCheckOutDate) {
      const checkIn = new Date(ghCheckInDate)
      const checkOut = new Date(ghCheckOutDate)
      if (checkOut <= checkIn) return 0
      const timeDiff = checkOut.getTime() - checkIn.getTime()
      const numNights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      const pricePerNight = selectedItem.data.price
      return numNights * pricePerNight
    }
    return 0
  }, [selectedItem, ghCheckInDate, ghCheckOutDate])

  const crTotalPrice = useMemo(() => {
    if (selectedItem?.type === "car" && crPickupDate && crReturnDate) {
      const pickup = new Date(crPickupDate)
      const returns = new Date(crReturnDate)
      if (returns <= pickup) return 0
      const timeDiff = returns.getTime() - pickup.getTime()
      const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
      const pricePerDay = selectedItem.data.price
      return numDays * pricePerDay
    }
    return 0
  }, [selectedItem, crPickupDate, crReturnDate])

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
      <BookingRentalModal
        t={t}
        open={openModal}
        onOpenChange={setOpenModal}
        selectedItem={selectedItem}
        ghFirstName={ghFirstName}
        setGhFirstName={setGhFirstName}
        ghLastName={ghLastName}
        setGhLastName={setGhLastName}
        ghPhone={ghPhone}
        setGhPhone={setGhPhone}
        ghEmail={ghEmail}
        setGhEmail={setGhEmail}
        ghSpecialRequests={ghSpecialRequests}
        setGhSpecialRequests={setGhSpecialRequests}
        ghCheckInDate={ghCheckInDate}
        setGhCheckInDate={setGhCheckInDate}
        ghCheckOutDate={ghCheckOutDate}
        setGhCheckOutDate={setGhCheckOutDate}
        ghNumGuests={ghNumGuests}
        setGhNumGuests={setGhNumGuests}
        ghTotalPrice={ghTotalPrice}
        crFirstName={crFirstName}
        setCrFirstName={setCrFirstName}
        crLastName={crLastName}
        setCrLastName={setCrLastName}
        crEmail={crEmail}
        setCrEmail={setCrEmail}
        crPhone={crPhone}
        setCrPhone={setCrPhone}
        crSpecialRequests={crSpecialRequests}
        setCrSpecialRequests={setCrSpecialRequests}
        crPickupDate={crPickupDate}
        setCrPickupDate={setCrPickupDate}
        crReturnDate={crReturnDate}
        setCrReturnDate={setCrReturnDate}
        crPickupLocation={crPickupLocation}
        setCrPickupLocation={setCrPickupLocation}
        crTotalPrice={crTotalPrice}
      />
    </div>
  )
}
