"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Users, Fuel, Calendar, Loader2 } from "lucide-react"
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
  const [state, formAction, isPending] = useActionState(createCarRentalBooking, null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)

  // Calculate total price when dates change
  useEffect(() => {
    if (startDate && endDate && car) {
      const pickup = new Date(startDate)
      const returnDate = new Date(endDate)
      const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))

      if (days > 0) {
        setTotalPrice(days * car.pricePerDay)
      } else {
        setTotalPrice(0)
      }
    }
  }, [startDate, endDate, car])

  // Handle successful booking
  useEffect(() => {
    if (state?.success) {
      // Show success message for 3 seconds then close modal
      const timer = setTimeout(() => {
        onClose()
        // Reset form
        setStartDate("")
        setEndDate("")
        setTotalPrice(0)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [state?.success, onClose])

  if (!car) return null

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t?.rentCar || "Rent Car"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Car Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={car.images?.[0] || "/placeholder.svg?height=80&width=80"}
                  alt={car.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{car.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{car.description}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {car.seats} {t?.seats || "seats"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span className="text-sm">{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" />
                      <span className="text-sm">{car.fuelType}</span>
                    </div>
                    <Badge variant="secondary">
                      ${car.pricePerDay}/{t?.day || "day"}
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
            <input type="hidden" name="carId" value={car.id} />
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

            {/* Driver License */}
            <div>
              <Label htmlFor="driverLicense">{t?.driverLicense || "Driver License"}</Label>
              <Input
                id="driverLicense"
                name="driverLicense"
                placeholder={t?.driverLicensePlaceholder || "Enter your driver license number"}
                disabled={isPending}
              />
            </div>

            {/* Rental Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">
                  {t?.pickupDate || "Pickup Date"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="endDate">
                  {t?.returnDate || "Return Date"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isPending}
                />
              </div>
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
                  t?.confirmRental || "Confirm Rental"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
