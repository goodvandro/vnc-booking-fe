"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, Calendar, Loader2 } from "lucide-react"
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
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)

  // Calculate total price when dates or guests change
  useEffect(() => {
    if (checkInDate && checkOutDate && guestHouse) {
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

      if (nights > 0) {
        setTotalPrice(nights * guestHouse.pricePerNight * guests)
      } else {
        setTotalPrice(0)
      }
    }
  }, [checkInDate, checkOutDate, guests, guestHouse])

  // Handle successful booking
  useEffect(() => {
    if (state?.success) {
      // Show success message for 3 seconds then close modal
      const timer = setTimeout(() => {
        onClose()
        // Reset form
        setCheckInDate("")
        setCheckOutDate("")
        setGuests(1)
        setTotalPrice(0)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [state?.success, onClose])

  if (!guestHouse) return null

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t?.bookGuestHouse || "Book Guest House"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest House Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={guestHouse.images?.[0] || "/placeholder.svg?height=80&width=80"}
                  alt={guestHouse.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{guestHouse.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {guestHouse.location}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{guestHouse.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {t?.maxGuests || "Max"} {guestHouse.maxGuests}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      ${guestHouse.pricePerNight}/{t?.night || "night"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success/Error Messages */}
          {state?.success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{state.message}</p>
            </div>
          )}

          {state?.success === false && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{state.message}</p>
            </div>
          )}

          {/* Booking Form */}
          <form action={formAction} className="space-y-4">
            {/* Hidden fields */}
            <input type="hidden" name="guestHouseId" value={guestHouse.id} />
            <input type="hidden" name="userId" value={user?.id || ""} />
            <input type="hidden" name="totalPrice" value={totalPrice} />

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  {t?.firstName || "First Name"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  required
                  defaultValue={user?.firstName || ""}
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  {t?.lastName || "Last Name"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  required
                  defaultValue={user?.lastName || ""}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">
                  {t?.email || "Email"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={user?.emailAddresses?.[0]?.emailAddress || ""}
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  {t?.phone || "Phone"} <span className="text-red-500">*</span>
                </Label>
                <Input id="phone" name="phone" type="tel" required disabled={isPending} />
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="checkInDate">
                  {t?.checkIn || "Check-in"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkInDate"
                  name="checkInDate"
                  type="date"
                  required
                  min={today}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="checkOutDate">
                  {t?.checkOut || "Check-out"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkOutDate"
                  name="checkOutDate"
                  type="date"
                  required
                  min={checkInDate || today}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="guests">
                  {t?.guests || "Guests"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max={guestHouse.maxGuests}
                  required
                  value={guests}
                  onChange={(e) => setGuests(Number.parseInt(e.target.value) || 1)}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests">{t?.specialRequests || "Special Requests"}</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                placeholder={t?.specialRequestsPlaceholder || "Any special requests or requirements..."}
                disabled={isPending}
              />
            </div>

            {/* Price Summary */}
            {totalPrice > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">{t?.totalPrice || "Total Price"}</span>
                    </div>
                    <div className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 bg-transparent"
              >
                {t?.cancel || "Cancel"}
              </Button>
              <Button type="submit" disabled={isPending || totalPrice <= 0} className="flex-1">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t?.processing || "Processing..."}
                  </>
                ) : (
                  t?.confirmBooking || "Confirm Booking"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
