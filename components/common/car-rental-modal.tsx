"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CarIcon, MapPin, Users, Settings, Loader2 } from "lucide-react"
import { createCarRentalBooking } from "@/app/actions/booking-actions"
import type { Car } from "@/lib/types"
import type { User } from "@clerk/nextjs/server"

interface CarRentalModalProps {
  isOpen: boolean
  onClose: () => void
  car: Car | null
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

  // Handle successful submission
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

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  if (!car) return null

  const handleSubmit = (formData: FormData) => {
    // Add calculated values to form data
    formData.append("totalPrice", totalPrice.toString())
    formData.append("carId", car.id.toString())
    if (user?.id) {
      formData.append("userId", user.id)
    }

    formAction(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t?.rentCar || "Rent Car"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Car Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">
                {car.make} {car.model}
              </h3>
              <Badge variant="secondary">
                ${car.pricePerDay}/{t?.day || "day"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {car.seats} {t?.seats || "seats"}
              </div>
              <div className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                {car.transmission}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {car.location}
              </div>
            </div>

            {car.description && <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>}
          </div>

          <Separator />

          {/* Success/Error Messages */}
          {state?.message && (
            <div
              className={`p-4 rounded-lg ${
                state.success
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <p className="font-medium">{state.message}</p>
            </div>
          )}

          {/* Booking Form */}
          <form action={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  {t?.firstName || "First Name"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
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
                  type="text"
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
                type="text"
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
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t?.totalPrice || "Total Price"}:</span>
                  <span className="text-xl font-bold">${totalPrice}</span>
                </div>
                {startDate && endDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                    {t?.days || "days"} × ${car.pricePerDay}
                  </p>
                )}
              </div>
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
                  <>
                    <CarIcon className="mr-2 h-4 w-4" />
                    {t?.confirmRental || "Confirm Rental"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
