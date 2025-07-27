"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, MapPin, Star, Users, CalendarDays, Facebook, Twitter, Instagram, Globe, ArrowUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { translations, languageNames } from "@/lib/translations" // Import translations

export default function Component() {
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [currentLanguage, setCurrentLanguage] = useState("en") // State for current language code
  const [showBackToTopButton, setShowBackToTopButton] = useState(false)

  const t = translations[currentLanguage as keyof typeof translations] // Get current translation object

  // State for guest house booking form fields
  const [ghFirstName, setGhFirstName] = useState("")
  const [ghLastName, setGhLastName] = useState("")
  const [ghPhone, setGhPhone] = useState("")
  const [ghEmail, setGhEmail] = useState("")
  const [ghSpecialRequests, setGhSpecialRequests] = useState("")
  const [ghCheckInDate, setGhCheckInDate] = useState("")
  const [ghCheckOutDate, setGhCheckOutDate] = useState("")
  const [ghNumGuests, setGhNumGuests] = useState(1)

  // State for car rental form fields
  const [crFirstName, setCrFirstName] = useState("")
  const [crLastName, setCrLastName] = useState("")
  const [crEmail, setCrEmail] = useState("")
  const [crPhone, setCrPhone] = useState("")
  const [crSpecialRequests, setCrSpecialRequests] = useState("")
  const [crPickupDate, setCrPickupDate] = useState("")
  const [crReturnDate, setCrReturnDate] = useState("")
  const [crPickupLocation, setCrPickupLocation] = useState("")

  const handleBookNowClick = (itemData: any) => {
    setSelectedItem({ type: "guestHouse", data: itemData })
    setOpenModal(true)
    // Reset guest house form fields when opening modal for a new booking
    setGhFirstName("")
    setGhLastName("")
    setGhPhone("")
    setGhEmail("")
    setGhSpecialRequests("")
    setGhCheckInDate("")
    setGhCheckOutDate("")
    setGhNumGuests(1)
  }

  const handleRentNowClick = (itemData: any) => {
    setSelectedItem({ type: "car", data: itemData })
    setOpenModal(true)
    // Reset car rental form fields when opening modal for a new rental
    setCrFirstName("")
    setCrLastName("")
    setCrEmail("")
    setCrPhone("")
    setCrSpecialRequests("")
    setCrPickupDate("")
    setCrReturnDate("")
    setCrPickupLocation("")
  }

  // Calculate total price for guest house booking
  const ghTotalPrice = useMemo(() => {
    if (selectedItem?.type === "guestHouse" && ghCheckInDate && ghCheckOutDate) {
      const checkIn = new Date(ghCheckInDate)
      const checkOut = new Date(ghCheckOutDate)

      // Ensure checkOut is after checkIn
      if (checkOut <= checkIn) {
        return 0 // Invalid date range
      }

      const timeDiff = checkOut.getTime() - checkIn.getTime()
      const numNights = Math.ceil(timeDiff / (1000 * 3600 * 24)) // Convert milliseconds to days (nights)
      const pricePerNight = selectedItem.data.price
      return numNights * pricePerNight
    }
    return 0
  }, [selectedItem, ghCheckInDate, ghCheckOutDate])

  // Calculate total price for car rental
  const crTotalPrice = useMemo(() => {
    if (selectedItem?.type === "car" && crPickupDate && crReturnDate) {
      const pickup = new Date(crPickupDate)
      const returns = new Date(crReturnDate)

      // Ensure return date is after pickup date
      if (returns <= pickup) {
        return 0 // Invalid date range
      }

      const timeDiff = returns.getTime() - pickup.getTime()
      const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) // Convert milliseconds to days
      const pricePerDay = selectedItem.data.price
      return numDays * pricePerDay
    }
    return 0
  }, [selectedItem, crPickupDate, crReturnDate])

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        // Show button after scrolling 300px
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

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-background shadow-sm">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
          <Home className="h-6 w-6" />
          <span className="sr-only">{t.siteTitle}</span>
          <span className="hidden md:inline">{t.siteTitle}</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="#guest-houses" className="text-sm font-medium hover:underline underline-offset-4">
            {t.guestHouses}
          </Link>
          <Link href="#car-rental" className="text-sm font-medium hover:underline underline-offset-4">
            {t.carRental}
          </Link>
          <Link href="#marketing-section" className="text-sm font-medium hover:underline underline-offset-4">
            {t.whyChooseUs}
          </Link>
          <Link href="#about-us" className="text-sm font-medium hover:underline underline-offset-4">
            {t.aboutUs}
          </Link>
          <Link href="#contact-form" className="text-sm font-medium hover:underline underline-offset-4">
            {t.contact}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{languageNames[currentLanguage]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrentLanguage("en")}>{languageNames["en"]}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentLanguage("fr")}>{languageNames["fr"]}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentLanguage("pt")}>{languageNames["pt"]}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm">
            {t.login}
          </Button>
          <Button size="sm">{t.signUp}</Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-48 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            width={1920}
            height={1080}
            alt="Hero Background"
            className="absolute inset-0 object-cover w-full h-full opacity-30"
          />
          <div className="container px-4 md:px-6 relative z-10 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-gray-200">
                {t.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-gray-300">{t.heroSubtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="#guest-houses">{t.findGuestHouse}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
                >
                  <Link href="#car-rental">{t.rentACar}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Guest Houses Section */}
        <section id="guest-houses" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-700">
                  {t.guestHousesSectionTitle}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.guestHousesSectionSubtitle}
                </p>
              </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Card className="flex flex-col overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Riverside Retreat"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Riverside Retreat</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Kyoto, Japan</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4" />
                    <span className="text-muted-foreground ml-1">(4.5)</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    $150<span className="text-base font-normal text-muted-foreground">{t.perNight}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleBookNowClick({
                        imageSrc: "/placeholder.svg?height=300&width=400",
                        title: "Riverside Retreat",
                        location: "Kyoto, Japan",
                        rating: 4.5,
                        price: 150,
                        description:
                          "A serene retreat nestled by the river, offering traditional Japanese aesthetics and modern comforts. Perfect for a peaceful getaway.",
                      })
                    }
                  >
                    {t.bookNow}
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Urban Loft"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Urban Loft</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>New York, USA</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="text-muted-foreground ml-1">(5.0)</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    $220<span className="text-base font-normal text-muted-foreground">{t.perNight}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleBookNowClick({
                        imageSrc: "/placeholder.svg?height=300&width=400",
                        title: "Urban Loft",
                        location: "New York, USA",
                        rating: 5.0,
                        price: 220,
                        description:
                          "A stylish and spacious loft in the heart of the city, offering breathtaking skyline views and easy access to all major attractions.",
                      })
                    }
                  >
                    {t.bookNow}
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Beachfront Villa"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Beachfront Villa</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Bali, Indonesia</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4" />
                    <span className="text-muted-foreground ml-1">(4.8)</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    $300<span className="text-base font-normal text-muted-foreground">{t.perNight}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleBookNowClick({
                        imageSrc: "/placeholder.svg?height=300&width=400",
                        title: "Beachfront Villa",
                        location: "Bali, Indonesia",
                        rating: 4.8,
                        price: 300,
                        description:
                          "Experience luxury by the sea in this stunning beachfront villa. Enjoy private access to the beach and breathtaking ocean views.",
                      })
                    }
                  >
                    {t.bookNow}
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Mountain Cabin"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Mountain Cabin</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Aspen, USA</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="text-muted-foreground ml-1">(4.9)</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    $250<span className="text-base font-normal text-muted-foreground">{t.perNight}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleBookNowClick({
                        imageSrc: "/placeholder.svg?height=300&width=400",
                        title: "Mountain Cabin",
                        location: "Aspen, USA",
                        rating: 4.9,
                        price: 250,
                        description:
                          "A rustic yet luxurious cabin nestled in the mountains, offering stunning views and direct access to hiking and skiing trails.",
                      })
                    }
                  >
                    {t.bookNow}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Car Rental Section */}
        <section id="car-rental" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-700">
                  {t.carRentalSectionTitle}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.carRentalSectionSubtitle}
                </p>
              </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Card className="flex flex-col overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Toyota Camry"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Toyota Camry</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>5 {t.seats}</span>
                    <span className="mx-1">•</span>
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>{t.automatic}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-2xl font-bold mt-2">
                    $50<span className="text-base font-normal text-muted-foreground">{t.perDay}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleRentNowClick({
                        imageSrc: "/placeholder.svg?height=300&width=400",
                        title: "Toyota Camry",
                        seats: 5,
                        transmission: "Automatic",
                        price: 50,
                        description:
                          "A reliable and fuel-efficient sedan, perfect for city driving and long road trips. Enjoy a smooth and comfortable ride.",
                      })
                    }
                  >
                    {t.rentNow}
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Honda CR-V"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Honda CR-V</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>5 {t.seats}</span>
                    <span className="mx-1">•</span>
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>{t.automatic}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-2xl font-bold mt-2">
                    $65<span className="text-base font-normal text-muted-foreground">{t.perDay}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleRentNowClick({
                        imageSrc: "/placeholder.svg?height=300&width=400",
                        title: "Honda CR-V",
                        seats: 5,
                        transmission: "Automatic",
                        price: 65,
                        description:
                          "A versatile and spacious SUV, ideal for families and adventurers. Offers ample cargo space and a comfortable ride.",
                      })
                    }
                  >
                    {t.rentNow}
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Mercedes-Benz C-Class"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Mercedes-Benz C-Class</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>4 {t.seats}</span>
                    <span className="mx-1">•</span>
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>{t.automatic}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-2xl font-bold mt-2">
                    $120<span className="text-base font-normal text-muted-foreground">{t.perDay}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleRentNowClick({
                        imageSrc: "/placeholder.svg?height=300&width=400",
                        title: "Mercedes-Benz C-Class",
                        seats: 4,
                        transmission: "Automatic",
                        price: 120,
                        description:
                          "Drive in style and comfort with this luxurious sedan. Perfect for business trips or a sophisticated city experience.",
                      })
                    }
                  >
                    {t.rentNow}
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Chrysler Pacifica"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Chrysler Pacifica</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>7 {t.seats}</span>
                    <span className="mx-1">•</span>
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>{t.automatic}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-2xl font-bold mt-2">
                    $90<span className="text-base font-normal text-muted-foreground">{t.perDay}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleRentNowClick({
                        imageSrc: "/placeholder.svg?height=300&width=400",
                        title: "Chrysler Pacifica",
                        seats: 7,
                        transmission: "Automatic",
                        price: 90,
                        description:
                          "The ultimate family minivan, offering ample space, comfort, and entertainment features for long journeys with kids.",
                      })
                    }
                  >
                    {t.rentNow}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Marketing Section */}
        <section id="marketing-section" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-700">
                  {t.whyChooseV0Booking}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.whyChooseV0BookingSubtitle}
                </p>
              </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col items-center text-center p-6">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  width={150}
                  height={150}
                  alt="Easy Booking"
                  className="mb-4 rounded-full object-cover"
                />
                <CardTitle className="text-xl font-bold mb-2">{t.effortlessBookingTitle}</CardTitle>
                <CardDescription>{t.effortlessBookingDescription}</CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  width={150}
                  height={150}
                  alt="Diverse Options"
                  className="mb-4 rounded-full object-cover"
                />
                <CardTitle className="text-xl font-bold mb-2">{t.diverseSelectionTitle}</CardTitle>
                <CardDescription>{t.diverseSelectionDescription}</CardDescription>
              </Card>
              <Card className="flex flex-col items-center text-center p-6">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  width={150}
                  height={150}
                  alt="24/7 Support"
                  className="mb-4 rounded-full object-cover"
                />
                <CardTitle className="text-xl font-bold mb-2">{t.supportTitle}</CardTitle>
                <CardDescription>{t.supportDescription}</CardDescription>
              </Card>
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="#guest-houses">{t.startYourJourney}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about-us" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-700">
                  {t.aboutV0BookingTitle}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.aboutV0BookingSubtitle}
                </p>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-center">
              <div className="md:col-span-1 lg:col-span-2 space-y-6">
                <p className="text-lg text-muted-foreground">{t.aboutV0BookingParagraph1}</p>
                <p className="text-lg text-muted-foreground">{t.aboutV0BookingParagraph2}</p>
                <p className="text-lg text-muted-foreground">{t.aboutV0BookingParagraph3}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:col-span-1 lg:col-span-1">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  width={200}
                  height={200}
                  alt="Happy Travelers"
                  className="rounded-lg object-cover w-full h-full"
                />
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  width={200}
                  height={200}
                  alt="Diverse Destinations"
                  className="rounded-lg object-cover w-full h-full"
                />
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  width={200}
                  height={200}
                  alt="Customer Support"
                  className="rounded-lg object-cover w-full h-full"
                />
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  width={200}
                  height={200}
                  alt="Modern Cars"
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action / Newsletter */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-200 dark:bg-gray-700">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t.newsletterTitle}</h2>
              <p className="text-muted-foreground md:text-xl">{t.newsletterSubtitle}</p>
              <form className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                <Input type="email" placeholder={t.enterYourEmail} className="flex-1" />
                <Button type="submit">{t.subscribe}</Button>
              </form>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact-form" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-700">{t.getInTouchTitle}</h2>
              <p className="text-muted-foreground md:text-xl">{t.getInTouchSubtitle}</p>
              <div className="space-y-2 text-muted-foreground text-left max-w-md mx-auto mb-8">
                <p>
                  <strong>{t.email}:</strong> info@v0booking.com
                </p>
                <p>
                  <strong>{t.phone}:</strong> +1 (123) 456-7890
                </p>
                <p>
                  <strong>{t.address}:</strong> 123 Booking Lane, Travel City, TC 12345
                </p>
              </div>
              <form className="space-y-4 max-w-md mx-auto text-left">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    {t.firstName}
                  </Label>
                  <Input id="name" type="text" placeholder={t.yourName} />
                </div>
                <div>
                  <Label htmlFor="email-contact" className="block text-sm font-medium text-foreground mb-1">
                    {t.email}
                  </Label>
                  <Input id="email-contact" type="email" placeholder={t.yourEmail} />
                </div>
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                    {t.message}
                  </Label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder={t.yourMessage}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">
                  {t.sendMessage}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="footer-contact"
        className="flex flex-col gap-6 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background"
      >
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          <span className="font-semibold">{t.siteTitle}</span>
        </div>
        <nav className="flex flex-wrap justify-center sm:ml-auto gap-4 sm:gap-6 text-sm">
          <Link href="#guest-houses" className="hover:underline underline-offset-4">
            {t.guestHouses}
          </Link>
          <Link href="#car-rental" className="hover:underline underline-offset-4">
            {t.carRental}
          </Link>
          <Link href="#marketing-section" className="hover:underline underline-offset-4">
            {t.whyChooseUs}
          </Link>
          <Link href="#about-us" className="hover:underline underline-offset-4">
            {t.aboutUs}
          </Link>
          <Link href="#contact-form" className="hover:underline underline-offset-4">
            {t.contact}
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            {t.privacyPolicy}
          </Link>
        </nav>
        <div className="flex flex-col items-center sm:items-start gap-1 text-sm text-muted-foreground">
          <span>{t.email}: info@v0booking.com</span>
          <span>{t.phone}: +1 (123) 456-7890</span>
          <span>{t.address}: 123 Booking Lane, Travel City, TC 12345</span>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="#" aria-label="Facebook">
            <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="Twitter">
            <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="Instagram">
            <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4 sm:mt-0 sm:ml-auto">
          &copy; {new Date().getFullYear()} {t.siteTitle}. {t.allRightsReserved}
        </p>
      </footer>

      {/* Dynamic Booking/Rental Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[900px] p-0">
          {" "}
          {/* Increased max-width and removed padding */}
          {selectedItem && selectedItem.type === "guestHouse" && (
            <div className="grid md:grid-cols-2 gap-0">
              {" "}
              {/* Grid for two columns */}
              {/* Left Column: Image and Details */}
              <div className="p-6 bg-muted/40 flex flex-col justify-between">
                {" "}
                {/* Added padding and background */}
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-bold text-gray-700">
                    {t.bookGuestHouseTitle.replace("{title}", selectedItem.data.title)}
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div>
                      <Image
                        src={selectedItem.data.imageSrc || "/placeholder.svg"}
                        width={400}
                        height={300}
                        alt={selectedItem.data.title}
                        className="w-full h-48 object-cover mb-4 rounded-md"
                      />
                      <div className="text-sm text-muted-foreground mb-2">{selectedItem.data.description}</div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedItem.data.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(selectedItem.data.rating) ? "fill-yellow-500" : ""}`}
                          />
                        ))}
                        <span className="text-muted-foreground ml-1">({selectedItem.data.rating})</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">
                        ${selectedItem.data.price}
                        <span className="text-base font-normal text-muted-foreground">{t.perNight}</span>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </div>
              {/* Right Column: Form Fields */}
              <div className="p-6">
                {" "}
                {/* Added padding */}
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="first-name" className="text-right">
                      {t.firstName}
                    </Label>
                    <Input
                      id="first-name"
                      type="text"
                      value={ghFirstName}
                      onChange={(e) => setGhFirstName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="last-name" className="text-right">
                      {t.lastName}
                    </Label>
                    <Input
                      id="last-name"
                      type="text"
                      value={ghLastName}
                      onChange={(e) => setGhLastName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      {t.phone}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={ghPhone}
                      onChange={(e) => setGhPhone(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      {t.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={ghEmail}
                      onChange={(e) => setGhEmail(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="check-in" className="text-right">
                      {t.checkIn}
                    </Label>
                    <Input
                      id="check-in"
                      type="date"
                      value={ghCheckInDate}
                      onChange={(e) => setGhCheckInDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="check-out" className="text-right">
                      {t.checkOut}
                    </Label>
                    <Input
                      id="check-out"
                      type="date"
                      value={ghCheckOutDate}
                      onChange={(e) => setGhCheckOutDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="guests" className="text-right">
                      {t.guests}
                    </Label>
                    <Input
                      id="guests"
                      type="number"
                      value={ghNumGuests}
                      onChange={(e) => setGhNumGuests(Number.parseInt(e.target.value))}
                      min={1}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="special-requests" className="text-right">
                      {t.requests}
                    </Label>
                    <textarea
                      id="special-requests"
                      rows={3}
                      value={ghSpecialRequests}
                      onChange={(e) => setGhSpecialRequests(e.target.value)}
                      placeholder={t.anySpecialRequests}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 font-bold text-lg">
                    <div className="col-span-1 text-right">{t.total}:</div>
                    <div className="col-span-3 text-left">${ghTotalPrice.toFixed(2)}</div>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {t.confirmBooking}
                </Button>
              </div>
            </div>
          )}
          {selectedItem && selectedItem.type === "car" && (
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Column: Image and Details */}
              <div className="p-6 bg-muted/40 flex flex-col justify-between">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-bold text-gray-700">
                    {t.rentCarTitle.replace("{title}", selectedItem.data.title)}
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div>
                      <Image
                        src={selectedItem.data.imageSrc || "/placeholder.svg"}
                        width={400}
                        height={300}
                        alt={selectedItem.data.title}
                        className="w-full h-48 object-cover mb-4 rounded-md"
                      />
                      <div className="text-sm text-muted-foreground mb-2">{selectedItem.data.description}</div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>
                          {selectedItem.data.seats} {t.seats}
                        </span>
                        <span className="mx-1">•</span>
                        <CalendarDays className="w-4 h-4" />
                        <span>{selectedItem.data.transmission}</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">
                        ${selectedItem.data.price}
                        <span className="text-base font-normal text-muted-foreground">{t.perDay}</span>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </div>
              {/* Right Column: Form Fields */}
              <div className="p-6">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cr-first-name" className="text-right">
                      {t.firstName}
                    </Label>
                    <Input
                      id="cr-first-name"
                      type="text"
                      value={crFirstName}
                      onChange={(e) => setCrFirstName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cr-last-name" className="text-right">
                      {t.lastName}
                    </Label>
                    <Input
                      id="cr-last-name"
                      type="text"
                      value={crLastName}
                      onChange={(e) => setCrLastName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cr-email" className="text-right">
                      {t.email}
                    </Label>
                    <Input
                      id="cr-email"
                      type="email"
                      value={crEmail}
                      onChange={(e) => setCrEmail(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cr-phone" className="text-right">
                      {t.phone}
                    </Label>
                    <Input
                      id="cr-phone"
                      type="tel"
                      value={crPhone}
                      onChange={(e) => setCrPhone(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pickup-date" className="text-right">
                      {t.pickupDate}
                    </Label>
                    <Input
                      id="pickup-date"
                      type="date"
                      value={crPickupDate}
                      onChange={(e) => setCrPickupDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="return-date" className="text-right">
                      {t.returnDate}
                    </Label>
                    <Input
                      id="return-date"
                      type="date"
                      value={crReturnDate}
                      onChange={(e) => setCrReturnDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pickup-location" className="text-right">
                      {t.pickupLocation}
                    </Label>
                    <Input
                      id="pickup-location"
                      type="text"
                      value={crPickupLocation}
                      onChange={(e) => setCrPickupLocation(e.target.value)}
                      placeholder={t.cityOrAirport}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cr-special-requests" className="text-right">
                      {t.requests}
                    </Label>
                    <textarea
                      id="cr-special-requests"
                      rows={3}
                      value={crSpecialRequests}
                      onChange={(e) => setCrSpecialRequests(e.target.value)}
                      placeholder={t.anySpecialRequests}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 font-bold text-lg">
                    <div className="col-span-1 text-right">{t.total}:</div>
                    <div className="col-span-3 text-left">${crTotalPrice.toFixed(2)}</div>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {t.confirmRental}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Back to Top Button */}
      {showBackToTopButton && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg z-50"
          aria-label={t.backToTop}
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
