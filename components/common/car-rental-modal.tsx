"use client"

import type React from "react"

import { Users, CalendarDays, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import ImageSlider from "@/components/common/image-slider"
import type { SelectedItem } from "@/lib/types"
import { useEffect, useState } from "react"
import { createCarRentalBooking, type CarRentalBookingData } from "@/app/actions/booking-actions"

interface CarRentalModalProps {
  t: any // Translation object
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItem: SelectedItem | null
  firstName: string
  setFirstName: (value: string) => void
  lastName: string
  setLastName: (value: string) => void
  email: string
  setEmail: (value: string) => void
  phone: string
  setPhone: (value: string) => void
  specialRequests: string
  setSpecialRequests: (value: string) => void
  pickupDate: string
  setPickupDate: (value: string) => void
  returnDate: string
  setReturnDate: (value: string) => void
  pickupLocation: string
  setPickupLocation: (value: string) => void
  totalPrice: number
}

export default function CarRentalModal({
  t,
  open,
  onOpenChange,
  selectedItem,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  specialRequests,
  setSpecialRequests,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
  pickupLocation,
  setPickupLocation,
  totalPrice,
}: CarRentalModalProps) {
  const { user, isLoaded } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

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

    if (!selectedItem || selectedItem.type !== "car") {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    const bookingData: CarRentalBookingData = {
      firstName,
      lastName,
      email,
      phone,
      pickupDate,
      returnDate,
      pickupLocation,
      specialRequests,
      carId: selectedItem.data.id,
      totalPrice,
    }

    try {
      const result = await createCarRentalBooking(bookingData)

      if (result.success) {
        setSubmitMessage({ type: "success", message: result.message || "Booking created successfully!" })
        // Reset form after successful submission
        setTimeout(() => {
          onOpenChange(false)
          // Reset all form fields
          setFirstName("")
          setLastName("")
          setEmail("")
          setPhone("")
          setSpecialRequests("")
          setPickupDate("")
          setReturnDate("")
          setPickupLocation("")
        }, 2000)
      } else {
        setSubmitMessage({ type: "error", message: result.error || "Failed to create booking" })
      }
    } catch (error) {
      setSubmitMessage({ type: "error", message: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedItem || selectedItem.type !== "car") {
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
                      €{selectedItem.data.price}
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
                    {t.firstName} *
                  </Label>
                  <Input
                    id="cr-first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="cr-last-name" className="sm:text-right text-sm">
                    {t.lastName} *
                  </Label>
                  <Input
                    id="cr-last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="cr-email" className="sm:text-right text-sm">
                    {t.email} *
                  </Label>
                  <Input
                    id="cr-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="cr-phone" className="sm:text-right text-sm">
                    {t.phone}
                  </Label>
                  <Input
                    id="cr-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="pickup-date" className="sm:text-right text-sm">
                    {t.pickupDate} *
                  </Label>
                  <Input
                    id="pickup-date"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="return-date" className="sm:text-right text-sm">
                    {t.returnDate} *
                  </Label>
                  <Input
                    id="return-date"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="pickup-location" className="sm:text-right text-sm">
                    {t.pickupLocation} *
                  </Label>
                  <Input
                    id="pickup-location"
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder={t.cityOrAirport}
                    className="sm:col-span-3 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                  <Label htmlFor="cr-special-requests" className="sm:text-right text-sm">
                    {t.requests}
                  </Label>
                  <textarea
                    id="cr-special-requests"
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder={t.anySpecialRequests}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-3"
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 font-bold text-base sm:text-lg">
                  <div className="sm:col-span-1 sm:text-right">{t.total}:</div>
                  <div className="sm:col-span-3 sm:text-left">€{totalPrice.toFixed(2)}</div>
                </div>

                {submitMessage && (
                  <div className={`grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4`}>
                    <div className="sm:col-span-1"></div>
                    <div
                      className={`sm:col-span-3 text-sm p-3 rounded-md ${
                        submitMessage.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {submitMessage.message}
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
                  t.confirmRental
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
