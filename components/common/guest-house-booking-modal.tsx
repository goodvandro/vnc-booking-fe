"use client"

import type React from "react"

import { MapPin, Star, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import ImageSlider from "@/components/common/image-slider"
import type { SelectedItem } from "@/lib/types"
import { useEffect, useState } from "react"
import { createGuestHouseBooking, type GuestHouseBookingData } from "@/app/actions/booking-actions"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error"
    message: string
    bookingId?: string
  } | null>(null)

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

  // Clear message when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSubmitMessage(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedItem || selectedItem.type !== "guestHouse") {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    const bookingData: GuestHouseBookingData = {
      firstName,
      lastName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      numGuests,
      specialRequests,
      guestHouseId: selectedItem.data.id,
      totalPrice,
    }

    try {
      const result = await createGuestHouseBooking(bookingData)

      if (result.success) {
        setSubmitMessage({
          type: "success",
          message: result.message || "Booking created successfully!",
          bookingId: result.bookingId,
        })
        // Reset form after successful submission
        setTimeout(() => {
          onOpenChange(false)
          // Reset all form fields
          setFirstName("")
          setLastName("")
          setPhone("")
          setEmail("")
          setSpecialRequests("")
          setCheckInDate("")
          setCheckOutDate("")
          setNumGuests(1)
        }, 3000)
      } else {
        setSubmitMessage({ type: "error", message: result.error || "Failed to create booking" })
      }
    } catch (error) {
      setSubmitMessage({ type: "error", message: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedItem || selectedItem.type !== "guestHouse") {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[900px] p-0 max-h-[95vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-4 sm:p-6 bg-muted/40 flex flex-col justify-between">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-700">
                  {t.bookGuestHouseTitle?.replace("{title}", selectedItem.data.title) ||
                    `Book ${selectedItem.data.title}`}
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
                      <span className="text-sm sm:text-base font-normal text-muted-foreground">
                        {t.perNight || "/night"}
                      </span>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="first-name" className="sm:text-right text-sm">
                    {t.firstName || "First Name"} *
                  </Label>
                  <Input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="last-name" className="sm:text-right text-sm">
                    {t.lastName || "Last Name"} *
                  </Label>
                  <Input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="email" className="sm:text-right text-sm">
                    {t.email || "Email"} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="phone" className="sm:text-right text-sm">
                    {t.phone || "Phone"} *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="check-in" className="sm:text-right text-sm">
                    {t.checkIn || "Check In"} *
                  </Label>
                  <Input
                    id="check-in"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="check-out" className="sm:text-right text-sm">
                    {t.checkOut || "Check Out"} *
                  </Label>
                  <Input
                    id="check-out"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="guests" className="sm:text-right text-sm">
                    {t.guests || "Guests"} *
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    value={numGuests}
                    onChange={(e) => setNumGuests(Number.parseInt(e.target.value))}
                    min={1}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                  <Label htmlFor="special-requests" className="sm:text-right text-sm">
                    {t.requests || "Special Requests"}
                  </Label>
                  <textarea
                    id="special-requests"
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder={t.anySpecialRequests || "Any special requests..."}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-3"
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 font-bold text-base sm:text-lg">
                  <div className="sm:col-span-1 sm:text-right">{t.total || "Total"}:</div>
                  <div className="sm:col-span-3 sm:text-left">€{totalPrice.toFixed(2)}</div>
                </div>

                {submitMessage && (
                  <div className={`grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4`}>
                    <div className="sm:col-span-1"></div>
                    <div
                      className={`sm:col-span-3 text-sm p-3 rounded-md ${
                        submitMessage.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <div>{submitMessage.message}</div>
                      {submitMessage.bookingId && (
                        <div className="mt-1 font-mono text-xs">Booking ID: {submitMessage.bookingId}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || totalPrice === 0}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.processing || "Processing..."}
                  </>
                ) : (
                  t.confirmBooking || "Confirm Booking"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
