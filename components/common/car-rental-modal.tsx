"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Car, Clock, CheckCircle } from "lucide-react"
import { createCarRentalBooking } from "@/app/actions/booking-actions"
import { useLanguage } from "@/hooks/use-language"

interface SelectedCar {
  id: number
  carId: number
  name: string
  type: string
  pricePerDay: number
  images: string[]
}

interface CarRentalModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCar: SelectedCar | null
}

export function CarRentalModal({ isOpen, onClose, selectedCar }: CarRentalModalProps) {
  const { user } = useUser()
  const { t } = useLanguage()

  // Form state
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [driverLicense, setDriverLicense] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)

  // Success state management
  const [showSuccess, setShowSuccess] = useState(false)
  const [canShowSuccess, setCanShowSuccess] = useState(false)
  const lastBookingIdRef = useRef<string | null>(null)

  const [state, action, isPending] = useActionState(createCarRentalBooking, null)

  // Reset modal when opening
  useEffect(() => {
    if (isOpen && selectedCar) {
      setShowSuccess(false)
      setCanShowSuccess(true)
      setPickupDate("")
      setReturnDate("")
      setPickupLocation("")
      setDriverLicense("")
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
  }, [isOpen, selectedCar, user])

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
    if (pickupDate && returnDate && selectedCar) {
      const pickup = new Date(pickupDate)
      const returnD = new Date(returnDate)
      const days = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))
      if (days > 0) {
        setTotalPrice(days * selectedCar.pricePerDay)
      }
    }
  }, [pickupDate, returnDate, selectedCar])

  const handleCloseModal = () => {
    setShowSuccess(false)
    setCanShowSuccess(false)
    setPickupDate("")
    setReturnDate("")
    setPickupLocation("")
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setDriverLicense("")
    setSpecialRequests("")
    setTotalPrice(0)
    onClose()
  }

  if (!selectedCar) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {t?.rentCar || "Rent Car"}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t?.bookingConfirmed || "Booking Confirmed!"}</h3>
            <p className="text-gray-600 mb-4">
              {t?.carRentalConfirmationMessage || "Your car rental booking has been successfully submitted."}
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
            <input type="hidden" name="carId" value={selectedCar.carId} />
            <input type="hidden" name="totalPrice" value={totalPrice} />

            {/* Car Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold">{selectedCar.name}</h3>
              <p className="text-sm text-gray-600">{selectedCar.type}</p>
              <p className="text-sm font-medium text-blue-600">${selectedCar.pricePerDay}/day</p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupDate">{t?.pickupDate || "Pickup Date"}</Label>
                <Input
                  id="pickupDate"
                  name="pickupDate"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="returnDate">{t?.returnDate || "Return Date"}</Label>
                <Input
                  id="returnDate"
                  name="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <Label htmlFor="pickupLocation">{t?.pickupLocation || "Pickup Location"}</Label>
              <Input
                id="pickupLocation"
                name="pickupLocation"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder={t?.pickupLocationPlaceholder || "Enter pickup location"}
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

            <div>
              <Label htmlFor="driverLicense">{t?.driverLicense || "Driver License"}</Label>
              <Input
                id="driverLicense"
                name="driverLicense"
                value={driverLicense}
                onChange={(e) => setDriverLicense(e.target.value)}
                placeholder={t?.driverLicensePlaceholder || "Enter driver license number"}
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
