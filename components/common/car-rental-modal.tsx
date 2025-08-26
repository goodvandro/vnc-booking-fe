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
import { Users, Settings, Loader2 } from "lucide-react"
import { createCarRentalBooking } from "@/app/actions/booking-actions"
import type { SelectedItem } from "@/lib/types"

interface CarRentalModalProps {
  t: any
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
  const { user } = useUser()
  const [state, formAction, isPending] = useActionState(createCarRentalBooking, null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [driverLicense, setDriverLicense] = useState("")

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
        setEmail("")
        setPhone("")
        setSpecialRequests("")
        setPickupDate("")
        setReturnDate("")
        setPickupLocation("")
        setDriverLicense("")
      }, 3000)
    }
  })

  if (!selectedItem || selectedItem.type !== "car") return null

  const car = selectedItem.data

  // Calculate number of days
  const days =
    pickupDate && returnDate
      ? Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t.rentCarTitle?.replace("{title}", car.title) || `Rent ${car.title}`}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">{t.rentalConfirmed || "Rental Confirmed!"}</h3>
            <p className="text-muted-foreground">{state?.message || "Your car rental has been confirmed."}</p>
          </div>
        ) : (
          <>
            {/* Car Info */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-4">
                <img
                  src={car.image || "/placeholder.svg?height=80&width=80"}
                  alt={car.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{car.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {car.seats} {t.seats || "seats"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span>{car.transmission || t.automatic || "Automatic"}</span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-primary mt-2">
                    ${car.price}
                    {t.perDay || "/day"}
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Form */}
            <form action={formAction} className="space-y-4">
              {/* Hidden fields */}
              <input type="hidden" name="carId" value={car.id} />
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

              <div>
                <Label htmlFor="driverLicense">{t.driverLicense || "Driver License"}</Label>
                <Input
                  id="driverLicense"
                  name="driverLicense"
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  placeholder={t.driverLicenseNumber || "Driver license number"}
                  disabled={isPending}
                />
              </div>

              {/* Rental Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupDate">
                    {t.pickupDate || "Pickup Date"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pickupDate"
                    name="pickupDate"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="returnDate">
                    {t.returnDate || "Return Date"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="returnDate"
                    name="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split("T")[0]}
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pickupLocation">
                  {t.pickupLocation || "Pickup Location"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pickupLocation"
                  name="pickupLocation"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder={t.cityOrAirport || "City or Airport"}
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

              {/* Rental Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">{t.rentalSummary || "Rental Summary"}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t.pricePerDay || "Price per day"}:</span>
                    <span>${car.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.numberOfDays || "Number of days"}:</span>
                    <span>{days > 0 ? days : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.pickupLocation || "Pickup location"}:</span>
                    <span>{pickupLocation || "Not specified"}</span>
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
                  t.confirmRental || "Confirm Rental"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
