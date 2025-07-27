"use client"

import { MapPin, Star, Users, CalendarDays } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import ImageSlider from "@/components/common/image-slider"
import type { SelectedItem } from "@/lib/types"
import { useEffect } from "react"

interface BookingRentalModalProps {
  t: any // Translation object
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItem: SelectedItem | null

  // Guest House specific props
  ghFirstName: string
  setGhFirstName: (value: string) => void
  ghLastName: string
  setGhLastName: (value: string) => void
  ghPhone: string
  setGhPhone: (value: string) => void
  ghEmail: string
  setGhEmail: (value: string) => void
  ghSpecialRequests: string
  setGhSpecialRequests: (value: string) => void
  ghCheckInDate: string
  setGhCheckInDate: (value: string) => void
  ghCheckOutDate: string
  setGhCheckOutDate: (value: string) => void
  ghNumGuests: number
  setGhNumGuests: (value: number) => void
  ghTotalPrice: number

  // Car Rental specific props
  crFirstName: string
  setCrFirstName: (value: string) => void
  crLastName: string
  setCrLastName: (value: string) => void
  crEmail: string
  setCrEmail: (value: string) => void
  crPhone: string
  setCrPhone: (value: string) => void
  crSpecialRequests: string
  setCrSpecialRequests: (value: string) => void
  crPickupDate: string
  setCrPickupDate: (value: string) => void
  crReturnDate: string
  setCrReturnDate: (value: string) => void
  crPickupLocation: string
  setCrPickupLocation: (value: string) => void
  crTotalPrice: number
}

export default function BookingRentalModal({
  t,
  open,
  onOpenChange,
  selectedItem,
  ghFirstName,
  setGhFirstName,
  ghLastName,
  setGhLastName,
  ghPhone,
  setGhPhone,
  ghEmail,
  setGhEmail,
  ghSpecialRequests,
  setGhSpecialRequests,
  ghCheckInDate,
  setGhCheckInDate,
  ghCheckOutDate,
  setGhCheckOutDate,
  ghNumGuests,
  setGhNumGuests,
  ghTotalPrice,
  crFirstName,
  setCrFirstName,
  crLastName,
  setCrLastName,
  crEmail,
  setCrEmail,
  crPhone,
  setCrPhone,
  crSpecialRequests,
  setCrSpecialRequests,
  crPickupDate,
  setCrPickupDate,
  crReturnDate,
  setCrReturnDate,
  crPickupLocation,
  setCrPickupLocation,
  crTotalPrice,
}: BookingRentalModalProps) {
  const { user, isLoaded } = useUser()

  // Auto-fill user information when modal opens and user is signed in
  useEffect(() => {
    if (isLoaded && user && open) {
      const firstName = user.firstName || ""
      const lastName = user.lastName || ""
      const email = user.emailAddresses[0]?.emailAddress || ""
      const phone = user.phoneNumbers[0]?.phoneNumber || ""

      if (selectedItem?.type === "guestHouse") {
        if (!ghFirstName) setGhFirstName(firstName)
        if (!ghLastName) setGhLastName(lastName)
        if (!ghEmail) setGhEmail(email)
        if (!ghPhone) setGhPhone(phone)
      } else if (selectedItem?.type === "car") {
        if (!crFirstName) setCrFirstName(firstName)
        if (!crLastName) setCrLastName(lastName)
        if (!crEmail) setCrEmail(email)
        if (!crPhone) setCrPhone(phone)
      }
    }
  }, [
    isLoaded,
    user,
    open,
    selectedItem,
    ghFirstName,
    ghLastName,
    ghEmail,
    ghPhone,
    crFirstName,
    crLastName,
    crEmail,
    crPhone,
    setGhFirstName,
    setGhLastName,
    setGhEmail,
    setGhPhone,
    setCrFirstName,
    setCrLastName,
    setCrEmail,
    setCrPhone,
  ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[900px] p-0 max-h-[95vh] overflow-y-auto">
        {selectedItem && selectedItem.type === "guestHouse" && (
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-4 sm:p-6 bg-muted/40 flex flex-col justify-between">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-700">
                  {t.bookGuestHouseTitle.replace("{title}", selectedItem.data.title)}
                </DialogTitle>
                <DialogDescription asChild>
                  <div>
                    <ImageSlider
                      images={selectedItem.data.images}
                      alt={selectedItem.data.title}
                      className="mb-4"
                      enableFullscreen={true}
                    />
                    <div className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {selectedItem.data.description}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{selectedItem.data.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(selectedItem.data.rating || 0) ? "fill-yellow-500" : ""}`}
                        />
                      ))}
                      <span className="text-muted-foreground ml-1">({selectedItem.data.rating})</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold mt-2">
                      ${selectedItem.data.price}
                      <span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perNight}</span>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="first-name" className="sm:text-right text-sm">
                    {t.firstName}
                  </Label>
                  <Input
                    id="first-name"
                    type="text"
                    value={ghFirstName}
                    onChange={(e) => setGhFirstName(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="last-name" className="sm:text-right text-sm">
                    {t.lastName}
                  </Label>
                  <Input
                    id="last-name"
                    type="text"
                    value={ghLastName}
                    onChange={(e) => setGhLastName(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="phone" className="sm:text-right text-sm">
                    {t.phone}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={ghPhone}
                    onChange={(e) => setGhPhone(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="email" className="sm:text-right text-sm">
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={ghEmail}
                    onChange={(e) => setGhEmail(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="check-in" className="sm:text-right text-sm">
                    {t.checkIn}
                  </Label>
                  <Input
                    id="check-in"
                    type="date"
                    value={ghCheckInDate}
                    onChange={(e) => setGhCheckInDate(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="check-out" className="sm:text-right text-sm">
                    {t.checkOut}
                  </Label>
                  <Input
                    id="check-out"
                    type="date"
                    value={ghCheckOutDate}
                    onChange={(e) => setGhCheckOutDate(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="guests" className="sm:text-right text-sm">
                    {t.guests}
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    value={ghNumGuests}
                    onChange={(e) => setGhNumGuests(Number.parseInt(e.target.value))}
                    min={1}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                  <Label htmlFor="special-requests" className="sm:text-right text-sm">
                    {t.requests}
                  </Label>
                  <textarea
                    id="special-requests"
                    rows={3}
                    value={ghSpecialRequests}
                    onChange={(e) => setGhSpecialRequests(e.target.value)}
                    placeholder={t.anySpecialRequests}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-3"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 font-bold text-base sm:text-lg">
                  <div className="sm:col-span-1 sm:text-right">{t.total}:</div>
                  <div className="sm:col-span-3 sm:text-left">${ghTotalPrice.toFixed(2)}</div>
                </div>
              </div>
              <Button type="submit" className="w-full">
                {t.confirmBooking}
              </Button>
            </div>
          </div>
        )}
        {selectedItem && selectedItem.type === "car" && (
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-4 sm:p-6 bg-muted/40 flex flex-col justify-between">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-700">
                  {t.rentCarTitle.replace("{title}", selectedItem.data.title)}
                </DialogTitle>
                <DialogDescription asChild>
                  <div>
                    <ImageSlider
                      images={selectedItem.data.images}
                      alt={selectedItem.data.title}
                      className="mb-4"
                      enableFullscreen={true}
                    />
                    <div className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {selectedItem.data.description}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm flex-wrap">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {selectedItem.data.seats} {t.seats}
                      </span>
                      <span className="mx-1">•</span>
                      <CalendarDays className="w-4 h-4 flex-shrink-0" />
                      <span>{selectedItem.data.transmission}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold mt-2">
                      ${selectedItem.data.price}
                      <span className="text-sm sm:text-base font-normal text-muted-foreground">{t.perDay}</span>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="cr-first-name" className="sm:text-right text-sm">
                    {t.firstName}
                  </Label>
                  <Input
                    id="cr-first-name"
                    type="text"
                    value={crFirstName}
                    onChange={(e) => setCrFirstName(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="cr-last-name" className="sm:text-right text-sm">
                    {t.lastName}
                  </Label>
                  <Input
                    id="cr-last-name"
                    type="text"
                    value={crLastName}
                    onChange={(e) => setCrLastName(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="cr-email" className="sm:text-right text-sm">
                    {t.email}
                  </Label>
                  <Input
                    id="cr-email"
                    type="email"
                    value={crEmail}
                    onChange={(e) => setCrEmail(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="cr-phone" className="sm:text-right text-sm">
                    {t.phone}
                  </Label>
                  <Input
                    id="cr-phone"
                    type="tel"
                    value={crPhone}
                    onChange={(e) => setCrPhone(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="pickup-date" className="sm:text-right text-sm">
                    {t.pickupDate}
                  </Label>
                  <Input
                    id="pickup-date"
                    type="date"
                    value={crPickupDate}
                    onChange={(e) => setCrPickupDate(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="return-date" className="sm:text-right text-sm">
                    {t.returnDate}
                  </Label>
                  <Input
                    id="return-date"
                    type="date"
                    value={crReturnDate}
                    onChange={(e) => setCrReturnDate(e.target.value)}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="pickup-location" className="sm:text-right text-sm">
                    {t.pickupLocation}
                  </Label>
                  <Input
                    id="pickup-location"
                    type="text"
                    value={crPickupLocation}
                    onChange={(e) => setCrPickupLocation(e.target.value)}
                    placeholder={t.cityOrAirport}
                    className="sm:col-span-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                  <Label htmlFor="cr-special-requests" className="sm:text-right text-sm">
                    {t.requests}
                  </Label>
                  <textarea
                    id="cr-special-requests"
                    rows={3}
                    value={crSpecialRequests}
                    onChange={(e) => setCrSpecialRequests(e.target.value)}
                    placeholder={t.anySpecialRequests}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-3"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 font-bold text-base sm:text-lg">
                  <div className="sm:col-span-1 sm:text-right">{t.total}:</div>
                  <div className="sm:col-span-3 sm:text-left">${crTotalPrice.toFixed(2)}</div>
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
  )
}
