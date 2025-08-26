"use client"

import { MapPin, Star } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import ImageSlider from "@/components/common/image-slider"
import type { SelectedItem } from "@/lib/types"
import { useEffect } from "react"

interface GuestHouseBookingModalProps {
  t: any // Translation object
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItem: SelectedItem | null
  firstName: string
  setFirstName: (value: string) => void
  lastName: string
  setLastName: (value: string) => void
  phone: string
  setPhone: (value: string) => void
  email: string
  setEmail: (value: string) => void
  specialRequests: string
  setSpecialRequests: (value: string) => void
  checkInDate: string
  setCheckInDate: (value: string) => void
  checkOutDate: string
  setCheckOutDate: (value: string) => void
  numGuests: number
  setNumGuests: (value: number) => void
  totalPrice: number
}

export default function GuestHouseBookingModal({
  t,
  open,
  onOpenChange,
  selectedItem,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  email,
  setEmail,
  specialRequests,
  setSpecialRequests,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  numGuests,
  setNumGuests,
  totalPrice,
}: GuestHouseBookingModalProps) {
  const { user, isLoaded } = useUser()

  // Auto-fill user information when modal opens and user is signed in
  useEffect(() => {
    if (isLoaded && user && open) {
      const userFirstName = user.firstName || ""
      const userLastName = user.lastName || ""
      const userEmail = user.emailAddresses[0]?.emailAddress || ""
      const userPhone = user.phoneNumbers[0]?.phoneNumber || ""

      if (!firstName) setFirstName(userFirstName)
      if (!lastName) setLastName(userLastName)
      if (!email) setEmail(userEmail)
      if (!phone) setPhone(userPhone)
    }
  }, [isLoaded, user, open, firstName, lastName, email, phone, setFirstName, setLastName, setEmail, setPhone])

  if (!selectedItem || selectedItem.type !== "guestHouse") {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[900px] p-0 max-h-[95vh] overflow-y-auto">
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
                    €{selectedItem.data.price}
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
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
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
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
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number.parseInt(e.target.value))}
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
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={t.anySpecialRequests}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-3"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 font-bold text-base sm:text-lg">
                <div className="sm:col-span-1 sm:text-right">{t.total}:</div>
                <div className="sm:col-span-3 sm:text-left">€{totalPrice.toFixed(2)}</div>
              </div>
            </div>
            <Button type="submit" className="w-full">
              {t.confirmBooking}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
