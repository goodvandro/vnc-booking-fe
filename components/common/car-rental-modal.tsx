"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Car, Users, Fuel, Loader2 } from "lucide-react"
import { createCarRentalBooking } from "@/app/actions/booking-actions"
import type { Car as CarType } from "@/lib/types"
import type { User } from "@clerk/nextjs/server"

interface CarRentalModalProps {
  isOpen: boolean
  onClose: () => void
  car: CarType | null
  t: any
  user: User | null | undefined
}

export default function CarRentalModal({ isOpen, onClose, car, t, user }: CarRentalModalProps) {
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress || "")
  const [phone, setPhone] = useState("")
  const [driverLicense, setDriverLicense] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [state, formAction, isPending] = useActionState(createCarRentalBooking, null)

  // Calculate total price
  const totalPrice = (() => {
    if (car && pickupDate && returnDate) {
      const pickup = new Date(pickupDate)
      const returnD = new Date(returnDate)
      const days = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))
      return days > 0 ? days * car.pricePerDay : 0
    }
    return 0
  })()

  const handleSubmit = async (formData: FormData) => {
    // Add additional data to form
    formData.append("totalPrice", totalPrice.toString())
    formData.append("carId", car?.id?.toString() || "")

    const result = await formAction(formData)

    if (result?.success) {
      setSuccessMessage(result.message)
      setShowSuccess(true)

      // Reset form
      setFirstName(user?.firstName || "")
      setLastName(user?.lastName || "")
      setEmail(user?.emailAddresses?.[0]?.emailAddress || "")
      setPhone("")
      setDriverLicense("")
      setPickupDate("")
      setReturnDate("")
      setSpecialRequests("")

      // Close modal after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 3000)
    }
  }

  if (!car) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t.rentCarTitle?.replace("{title}", car.name) || `Rent ${car.name}`}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-lg font-semibold mb-2">✅ {successMessage}</div>
            <p className="text-muted-foreground">This window will close automatically...</p>
          </div>
        ) : (
          <>
            {/* Car Info */}
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-4">
                <img
                  src={car.images?.[0] || "/placeholder.svg?height=80&width=80"}
                  alt={car.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{car.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {car.seats} {t?.seats || "seats"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" />
                      <span>{car.fuelType}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">${car.pricePerDay}</span>
                    <span className="text-muted-foreground">{t.perDay || "/day"}</span>
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

              <div>
                <Label htmlFor="driverLicense">Driver License</Label>
                <Input
                  id="driverLicense"
                  name="driverLicense"
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  placeholder="Driver license number (optional)"
                  disabled={isPending}
                />
              </div>

              {/* Rental Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">{t.pickupDate || "Pickup Date"} *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">{t.returnDate || "Return Date"} *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
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
                  {pickupDate && returnDate && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {Math.ceil(
                        (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24),
                      )}{" "}
                      days × ${car.pricePerDay}
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
