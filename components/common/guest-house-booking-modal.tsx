"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Users, Star, Clock } from "lucide-react"
import { createGuestHouseBooking } from "@/app/actions/booking-actions"
import type { SelectedGuestHouse } from "@/lib/types"

interface GuestHouseBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedGuestHouse: SelectedGuestHouse | null
  t: any
}

export default function GuestHouseBookingModal({
  isOpen,
  onClose,
  selectedGuestHouse,
  t,
}: GuestHouseBookingModalProps) {
  const { user } = useUser()
  const [state, formAction, isPending] = useActionState(createGuestHouseBooking, null)

  // Form state
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Success state management
  const [showSuccess, setShowSuccess] = useState(false)
  const [canShowSuccess, setCanShowSuccess] = useState(false)
  const lastBookingIdRef = useRef<string | null>(null)

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedGuestHouse || !checkInDate || !checkOutDate) return 0

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    return nights > 0 ? nights * selectedGuestHouse.pricePerNight : 0
  }

  const totalPrice = calculateTotalPrice()

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && selectedGuestHouse) {
      setCanShowSuccess(true)
      setShowSuccess(false)
      setCheckInDate("")
      setCheckOutDate("")
      setGuests(1)
      setSpecialRequests("")

      // Pre-fill user data if available
      if (user) {
        setFirstName(user.firstName || "")
        setLastName(user.lastName || "")
        setEmail(user.emailAddresses[0]?.emailAddress || "")
        setPhone(user.phoneNumbers[0]?.phoneNumber || "")
      } else {
        setFirstName("")
        setLastName("")
        setEmail("")
        setPhone("")
      }
    }
  }, [isOpen, selectedGuestHouse, user])

  // Handle success state
  useEffect(() => {
    if (state?.success && canShowSuccess && !showSuccess) {
      // Check if this is a new booking (different booking ID)
      if (state.bookingId && state.bookingId !== lastBookingIdRef.current) {
        setShowSuccess(true)
        lastBookingIdRef.current = state.bookingId
        setCanShowSuccess(false) // Prevent showing success again until modal reopens
      }
    }
  }, [state?.success, state?.bookingId, canShowSuccess, showSuccess])

  const handleCloseModal = () => {
    setShowSuccess(false)
    setCanShowSuccess(false)
    setCheckInDate("")
    setCheckOutDate("")
    setGuests(1)
    setSpecialRequests("")
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    onClose()
  }

  if (!selectedGuestHouse) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {showSuccess ? t?.bookingConfirmed || "Booking Confirmed!" : t?.bookGuestHouse || "Book Guest House"}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                {t?.bookingSuccessful || "Booking Successful!"}
              </h3>
              <p className="text-gray-600 mb-4">
                {t?.bookingConfirmationMessage || "Your guest house booking has been confirmed."}
              </p>
              {state?.bookingId && (
                <p className="text-sm text-gray-500 mb-6">
                  {t?.bookingId || "Booking ID"}: <span className="font-mono font-semibold">{state.bookingId}</span>
                </p>
              )}
            </div>
            <Button onClick={handleCloseModal} className="px-8">
              {t?.done || "Done"}
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            {/* Guest House Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <img
                  src={selectedGuestHouse.image || "/placeholder.svg"}
                  alt={selectedGuestHouse.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedGuestHouse.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedGuestHouse.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{selectedGuestHouse.rating}</span>
                  </div>
                  <div className="text-lg font-semibold text-primary mt-2">
                    ${selectedGuestHouse.pricePerNight}/{t?.night || "night"}
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden fields */}
            <input type="hidden" name="guestHouseId" value={selectedGuestHouse.id} />
            <input type="hidden" name="itemName" value={selectedGuestHouse.name} />
            <input type="hidden" name="totalPrice" value={totalPrice} />

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkInDate">{t?.checkInDate || "Check-in Date"}</Label>
                <Input
                  id="checkInDate"
                  name="checkInDate"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="checkOutDate">{t?.checkOutDate || "Check-out Date"}</Label>
                <Input
                  id="checkOutDate"
                  name="checkOutDate"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guests">{t?.numberOfGuests || "Number of Guests"}</Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">{t?.personalInformation || "Personal Information"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t?.firstName || "First Name"}</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t?.lastName || "Last Name"}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="email">{t?.email || "Email"}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t?.phone || "Phone"}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests">{t?.specialRequests || "Special Requests"}</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder={t?.specialRequestsPlaceholder || "Any special requests or requirements..."}
                rows={3}
              />
            </div>

            {/* Price Summary */}
            {totalPrice > 0 && (
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t?.totalPrice || "Total Price"}:</span>
                  <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                {checkInDate && checkOutDate && (
                  <div className="text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {Math.ceil(
                      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24),
                    )}{" "}
                    {t?.nights || "nights"}
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1 bg-transparent">
                {t?.cancel || "Cancel"}
              </Button>
              <Button type="submit" disabled={isPending || totalPrice <= 0} className="flex-1">
                {isPending
                  ? t?.booking || "Booking..."
                  : `${t?.confirmBooking || "Confirm Booking"} - $${totalPrice.toFixed(2)}`}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
