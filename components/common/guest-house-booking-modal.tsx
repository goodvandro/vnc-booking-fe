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
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Users, Calendar, Loader2, CheckCircle } from "lucide-react"
import { createGuestHouseBooking } from "@/app/actions/booking-actions"
import type { SelectedGuestHouse } from "@/lib/types"
import type { User } from "@clerk/nextjs/server"
import ImageSlider from "./image-slider"

interface GuestHouseBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedGuestHouse: SelectedGuestHouse | null
  t: any
  user: User | null | undefined
}

export default function GuestHouseBookingModal({
  isOpen,
  onClose,
  selectedGuestHouse,
  t,
  user,
}: GuestHouseBookingModalProps) {
  const [state, formAction, isPending] = useActionState(createGuestHouseBooking, null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user?.firstName || "")
      setLastName(user?.lastName || "")
      setEmail(user.emailAddresses?.[0]?.emailAddress || "")
      setPhone(user.phoneNumbers?.[0]?.phoneNumber || "")
    }
  }, [user])

  // Calculate total price when dates or guests change
  useEffect(() => {
    if (checkInDate && checkOutDate && selectedGuestHouse) {
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

      if (nights > 0) {
        setTotalPrice(nights * selectedGuestHouse.data.price)
      } else {
        setTotalPrice(0)
      }
    }
  }, [checkInDate, checkOutDate, guests, selectedGuestHouse])

  // Handle successful booking
  useEffect(() => {
    if (state?.success && !showSuccess) {
      setShowSuccess(true)
    }
  }, [state?.success, showSuccess])

  const handleCloseModal = () => {
    setShowSuccess(false)
    onClose()
    // Reset form
    setCheckInDate("")
    setCheckOutDate("")
    setGuests(1)
    setTotalPrice(0)
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setSpecialRequests("")
  }

  if (!selectedGuestHouse) return null

  const guestHouse = selectedGuestHouse.data
  const today = new Date().toISOString().split("T")[0]
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t?.bookGuestHouse || "Book Guest House"}</DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">{t?.bookingConfirmed || "Booking Confirmed!"}</h3>
            <p className="text-muted-foreground mb-4">{state?.message}</p>
            {state?.bookingId && (
              <p className="text-sm text-muted-foreground mb-6">
                Booking ID: <span className="font-mono font-semibold">{state.bookingId}</span>
              </p>
            )}
            <Button onClick={handleCloseModal} className="px-8">
              {t?.done || "Done"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Images and Guest House Info */}
            <div className="space-y-4">
              {/* Image Slider */}
              {guestHouse.images && guestHouse.images.length > 0 && (
                <ImageSlider
                  images={guestHouse.images}
                  alt={guestHouse.title}
                  className="w-full"
                  enableFullscreen={true}
                />
              )}

              {/* Guest House Details */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-xl mb-2">{guestHouse.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    {guestHouse.location}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{guestHouse.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{t?.maxGuests || "Max guests"}: 8</span>
                    </div>
                    <Badge variant="secondary">
                      €{guestHouse.price}/{t?.night || "night"}
                    </Badge>
                  </div>
                  {guestHouse.description && <p className="text-sm text-muted-foreground">{guestHouse.description}</p>}
                </CardContent>
              </Card>

              {/* Price Summary */}
              {totalPrice > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t?.bookingSummary || "Booking Summary"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t?.pricePerNight || "Price per night"}:</span>
                        <span>€{guestHouse.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t?.numberOfNights || "Number of nights"}:</span>
                        <span>{nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t?.numberOfGuests || "Number of guests"}:</span>
                        <span>{guests}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>{t?.total || "Total"}:</span>
                        <span className="text-primary">€{totalPrice}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Booking Form */}
            <div className="space-y-4">
              {/* Error Message */}
              {state?.success === false && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{state.message}</p>
                </div>
              )}

              {/* Booking Form */}
              <form action={formAction} className="space-y-4">
                {/* Hidden fields */}
                <input type="hidden" name="guestHouseId" value={guestHouse.id || ""} />
                <input type="hidden" name="totalPrice" value={totalPrice} />

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">{t?.personalInformation || "Personal Information"}</h4>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="firstName">
                          {t?.firstName || "First Name"} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
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
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">
                          {t?.phone || "Phone"} <span className="text-red-500">*</span>
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
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">{t?.bookingDetails || "Booking Details"}</h4>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor="checkIn">
                          {t?.checkIn || "Check-in"} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="checkIn"
                          name="checkIn"
                          type="date"
                          required
                          min={today}
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkOut">
                          {t?.checkOut || "Check-out"} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="checkOut"
                          name="checkOut"
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
                          max="8"
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
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        disabled={isPending}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
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
                      `${t?.confirmBooking || "Confirm Booking"} - €${totalPrice}`
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
