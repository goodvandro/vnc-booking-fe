"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Loader2 } from "lucide-react"
import { createGuestHouseBooking } from "@/app/actions/booking-actions"
import type { SelectedItem } from "@/lib/types"

interface GuestHouseBookingModalProps {
  t: any
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
  const { user } = useUser()
  const [state, formAction, isPending] = useActionState(createGuestHouseBooking, null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Pre-fill user data from Clerk
  useState(() => {
    if (user && open) {
      if (!firstName && user.firstName) setFirstName(user.firstName)
      if (!lastName && user.lastName) setLastName(user.lastName)
      if (!email && user.primaryEmailAddress?.emailAddress) {
        setEmail(user.primaryEmailAddress.emailAddress)
      }
    }
  })

  // Handle successful booking
  useState(() => {
    if (state?.success && !showSuccess) {
      setShowSuccess(true)
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onOpenChange(false)
        // Reset form
        setFirstName("")
        setLastName("")
        setPhone("")
        setEmail("")
        setSpecialRequests("")
        setCheckInDate("")
        setCheckOutDate("")
        setNumGuests(1)
      }, 3000)
    }
  })

  if (!selectedItem || selectedItem.type !== "guestHouse") return null

  const guestHouse = selectedItem.data

  // Calculate number of nights
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t.bookGuestHouseTitle?.replace("{title}", guestHouse.title) || `Book ${guestHouse.title}`}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">{t.bookingConfirmed || "Booking Confirmed!"}</h3>
            <p className="text-muted-foreground">{state?.message || "Your booking has been confirmed."}</p>
          </div>
        ) : (
          <>
            {/* Guest House Info */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-4">
                <img
                  src={guestHouse.image || "/placeholder.svg?height=80&width=80"}
                  alt={guestHouse.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{guestHouse.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{guestHouse.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{guestHouse.rating}</span>
                  </div>
                  <div className="text-lg font-semibold text-primary mt-2">
                    ${guestHouse.price}
                    {t.perNight || "/night"}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form action={formAction} className="space-y-4">
              {/* Hidden fields */}
              <input type="hidden" name="guestHouseId" value={guestHouse.id} />
              <input type="hidden" name="totalPrice" value={totalPrice} />

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    {t.firstName || "First Name"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">
                    {t.lastName || "Last Name"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">
                    {t.email || "Email"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">
                    {t.phone || "Phone"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkInDate">
                    {t.checkIn || "Check-in"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="checkInDate"
                    name="checkInDate"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOutDate">
                    {t.checkOut || "Check-out"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="checkOutDate"
                    name="checkOutDate"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split("T")[0]}
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="numGuests">
                  {t.guests || "Number of Guests"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numGuests"
                  name="numGuests"
                  type="number"
                  min="1"
                  max="10"
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number.parseInt(e.target.value) || 1)}
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="specialRequests">{t.requests || "Special Requests"}</Label>
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={t.anySpecialRequests || "Any special requests?"}
                  disabled={isPending}
                />
              </div>

              {/* Error Message */}
              {state?.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{state.error}</p>
                </div>
              )}

              <Separator />

              {/* Booking Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">{t.bookingSummary || "Booking Summary"}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t.pricePerNight || "Price per night"}:</span>
                    <span>${guestHouse.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.numberOfNights || "Number of nights"}:</span>
                    <span>{nights > 0 ? nights : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.numberOfGuests || "Number of guests"}:</span>
                    <span>{numGuests}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t.total || "Total"}:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isPending || totalPrice <= 0}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.processing || "Processing..."}
                  </>
                ) : (
                  t.confirmBooking || "Confirm Booking"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
