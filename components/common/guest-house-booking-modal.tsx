"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Users, Clock, CheckCircle } from "lucide-react"
import { createGuestHouseBooking } from "@/app/actions/booking-actions"
import { useLanguage } from "@/hooks/use-language"

interface SelectedGuestHouse {
  id: number
  name: string
  location: string
  pricePerNight: number
  images: string[]
  maxGuests: number
}

interface GuestHouseBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedGuestHouse: SelectedGuestHouse | null
}

export function GuestHouseBookingModal({ isOpen, onClose, selectedGuestHouse }: GuestHouseBookingModalProps) {
  const { user } = useUser()
  const { t } = useLanguage()

  // Form state
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState(1)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)

  // Success state management
  const [showSuccess, setShowSuccess] = useState(false)
  const [canShowSuccess, setCanShowSuccess] = useState(false)
  const lastBookingIdRef = useRef<string | null>(null)

  const [state, action, isPending] = useActionState(createGuestHouseBooking, null)

  // Reset modal when opening
  useEffect(() => {
    if (isOpen && selectedGuestHouse) {
      setShowSuccess(false)
      setCanShowSuccess(true)
      setCheckInDate("")
      setCheckOutDate("")
      setGuests(1)
      setSpecialRequests("")
      setTotalPrice(0)

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

  // Calculate total price
  useEffect(() => {
    if (checkInDate && checkOutDate && selectedGuestHouse) {
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      if (nights > 0) {
        setTotalPrice(nights * selectedGuestHouse.pricePerNight)
      }
    }
  }, [checkInDate, checkOutDate, selectedGuestHouse])

  const handleCloseModal = () => {
    setShowSuccess(false)
    setCanShowSuccess(false)
    setCheckInDate("")
    setCheckOutDate("")
    setGuests(1)
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setSpecialRequests("")
    setTotalPrice(0)
    onClose()
  }

  if (!selectedGuestHouse) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t?.bookGuestHouse || "Book Guest House"}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t?.bookingConfirmed || "Booking Confirmed!"}</h3>
            <p className="text-gray-600 mb-4">
              {t?.bookingConfirmationMessage || "Your guest house booking has been successfully submitted."}
            </p>
            {state?.bookingId && (
              <p className="text-sm text-gray-500 mb-6">
                {t?.bookingId || "Booking ID"}: {state.bookingId}
              </p>
            )}
            <Button onClick={handleCloseModal} className="px-8">
              {t?.done || "Done"}
            </Button>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <input type="hidden" name="guestHouseId" value={selectedGuestHouse.id} />
            <input type="hidden" name="totalPrice" value={totalPrice} />

            {/* Guest House Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold">{selectedGuestHouse.name}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {selectedGuestHouse.location}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                {t?.maxGuests || "Max guests"}: {selectedGuestHouse.maxGuests}
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkInDate">{t?.checkIn || "Check-in"}</Label>
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
                <Label htmlFor="checkOutDate">{t?.checkOut || "Check-out"}</Label>
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

            {/* Guests */}
            <div>
              <Label htmlFor="guests">{t?.numberOfGuests || "Number of Guests"}</Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max={selectedGuestHouse.maxGuests}
                value={guests}
                onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                required
              />
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests">{t?.specialRequests || "Special Requests"}</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder={t?.specialRequestsPlaceholder || "Any special requests or requirements..."}
              />
            </div>

            {/* Total Price */}
            {totalPrice > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t?.totalPrice || "Total Price"}:</span>
                  <span className="text-xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isPending || totalPrice === 0} className="w-full">
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  {t?.processing || "Processing..."}
                </div>
              ) : (
                `${t?.confirmBooking || "Confirm Booking"} - $${totalPrice.toFixed(2)}`
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
