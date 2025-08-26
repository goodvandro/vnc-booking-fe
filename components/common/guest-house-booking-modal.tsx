"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Star, Users, Loader2 } from "lucide-react"
import { createGuestHouseBooking } from "@/app/actions/booking-actions"
import type { GuestHouse } from "@/lib/types"
import type { User } from "@clerk/nextjs/server"

interface GuestHouseBookingModalProps {
  isOpen: boolean
  onClose: () => void
  guestHouse: GuestHouse | null
  t: any
  user: User | null | undefined
}

export default function GuestHouseBookingModal({ isOpen, onClose, guestHouse, t, user }: GuestHouseBookingModalProps) {
  const [state, formAction, isPending] = useActionState(createGuestHouseBooking, null)
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress || "")
  const [phone, setPhone] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [numGuests, setNumGuests] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Calculate total price
  const totalPrice = (() => {
    if (guestHouse && checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      return nights > 0 ? nights * guestHouse.price : 0
    }
    return 0
  })()

  const handleSubmit = async (formData: FormData) => {
    // Add additional data to form
    formData.append("totalPrice", totalPrice.toString())
    formData.append("guestHouseId", guestHouse?.id?.toString() || "")
    formData.append("userId", user?.id || "")
    formData.append("guests", numGuests.toString())

    const result = await formAction(formData)

    if (result?.success) {
      setSuccessMessage(result.message)
      setShowSuccess(true)

      // Reset form
      setFirstName(user?.firstName || "")
      setLastName(user?.lastName || "")
      setEmail(user?.emailAddresses?.[0]?.emailAddress || "")
      setPhone("")
      setCheckInDate("")
      setCheckOutDate("")
      setNumGuests(1)
      setSpecialRequests("")

      // Close modal after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 3000)
    }
  }

  if (!guestHouse) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t.bookGuestHouseTitle?.replace("{title}", guestHouse.title) || `Book ${guestHouse.title}`}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-lg font-semibold mb-2">✅ {successMessage}</div>
            <p className="text-muted-foreground">This window will close automatically...</p>
          </div>
        ) : (
          <>
            {/* Guest House Info */}
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-4">
                <img
                  src={guestHouse.images?.[0] || "/placeholder.svg?height=80&width=80"}
                  alt={guestHouse.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{guestHouse.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{guestHouse.location}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{guestHouse.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Up to {guestHouse.maxGuests} guests</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">${guestHouse.price}</span>
                    <span className="text-muted-foreground">{t.perNight || "/night"}</span>
                  </div>
                </div>
              </div>
            </div>

            <form action={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t.firstName || "First Name"} *</Label>
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
                  <Label htmlFor="lastName">{t.lastName || "Last Name"} *</Label>
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
                  <Label htmlFor="email">{t.email || "Email"} *</Label>
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
                  <Label htmlFor="phone">{t.phone || "Phone"} *</Label>
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
                  <Label htmlFor="checkIn">{t.checkIn || "Check-in"} *</Label>
                  <Input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">{t.checkOut || "Check-out"} *</Label>
                  <Input
                    id="checkOut"
                    name="checkOut"
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
                <Label htmlFor="guests">{t.guests || "Number of Guests"} *</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max={guestHouse.maxGuests}
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number.parseInt(e.target.value))}
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
                  rows={3}
                  disabled={isPending}
                />
              </div>

              {/* Price Summary */}
              {totalPrice > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{t.total || "Total"}:</span>
                    <span className="text-2xl font-bold">${totalPrice}</span>
                  </div>
                  {checkInDate && checkOutDate && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {Math.ceil(
                        (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24),
                      )}{" "}
                      nights × ${guestHouse.price}
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {state?.error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{state.error}</div>}

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isPending || totalPrice <= 0}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
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
