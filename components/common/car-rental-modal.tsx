"use client"

import type React from "react"

import { useState, useMemo, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Car, MapPin, Users, CheckCircle, AlertCircle } from "lucide-react"
import { createCarRentalBooking } from "@/app/actions/booking-actions"
import type { SelectedItem } from "@/lib/types"
import type { User } from "@clerk/nextjs/server"

interface CarRentalModalProps {
  isOpen: boolean
  onClose: () => void
  selectedItem: SelectedItem | null
  t: any
  user: User | null | undefined
}

export default function CarRentalModal({ isOpen, onClose, selectedItem, t, user }: CarRentalModalProps) {
  const [isPending, startTransition] = useTransition()
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle")
  const [bookingId, setBookingId] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress || "")
  const [phone, setPhone] = useState(user?.phoneNumbers?.[0]?.phoneNumber || "")
  const [driverLicense, setDriverLicense] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (selectedItem?.type === "car" && startDate && endDate) {
      const startDateTime = new Date(startDate)
      const endDateTime = new Date(endDate)
      if (endDateTime <= startDateTime) return 0
      const timeDiff = endDateTime.getTime() - startDateTime.getTime()
      const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
      const pricePerDay = selectedItem.data.price
      return numDays * pricePerDay
    }
    return 0
  }, [selectedItem, startDate, endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedItem) return

    const formData = new FormData()
    formData.append("firstName", firstName)
    formData.append("lastName", lastName)
    formData.append("email", email)
    formData.append("phone", phone)
    formData.append("driverLicense", driverLicense)
    formData.append("startDate", startDate)
    formData.append("endDate", endDate)
    formData.append("totalPrice", totalPrice.toString())
    formData.append("carId", "1") // You'll need to pass the actual car ID

    startTransition(async () => {
      const result = await createCarRentalBooking(formData)

      if (result.success) {
        setBookingStatus("success")
        setBookingId(result.bookingId)
        // Auto close after 4 seconds
        setTimeout(() => {
          onClose()
          resetForm()
        }, 4000)
      } else {
        setBookingStatus("error")
        setErrorMessage(result.error || "Failed to create booking")
      }
    })
  }

  const resetForm = () => {
    setBookingStatus("idle")
    setBookingId("")
    setErrorMessage("")
    setFirstName(user?.firstName || "")
    setLastName(user?.lastName || "")
    setEmail(user?.emailAddresses?.[0]?.emailAddress || "")
    setPhone(user?.phoneNumbers?.[0]?.phoneNumber || "")
    setDriverLicense("")
    setStartDate("")
    setEndDate("")
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!selectedItem || selectedItem.type !== "car") return null

  // Success state
  if (bookingStatus === "success") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Booking Confirmed!</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your car rental has been successfully booked.</p>
            <div className="mb-4 rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">Booking ID: {bookingId}</p>
            </div>
            <p className="text-xs text-muted-foreground">You will receive a confirmation email shortly.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Rent {selectedItem.data.title}
          </DialogTitle>
        </DialogHeader>

        {/* Car Summary */}
        <div className="rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <img
              src={selectedItem.data.images?.[0] || "/placeholder.svg?height=80&width=80"}
              alt={selectedItem.data.title}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{selectedItem.data.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {(selectedItem.data as any).seats} seats
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {(selectedItem.data as any).transmission}
                </div>
              </div>
              <p className="text-lg font-bold">
                €{selectedItem.data.price}
                <span className="text-sm font-normal text-muted-foreground"> / day</span>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverLicense">Driver License Number</Label>
              <Input
                id="driverLicense"
                value={driverLicense}
                onChange={(e) => setDriverLicense(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <Separator />

          {/* Rental Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rental Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Pickup Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Return Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rental Summary</h3>
            <div className="rounded-lg bg-muted p-4 space-y-2">
              {startDate && endDate && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>
                      €{selectedItem.data.price} ×{" "}
                      {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))}{" "}
                      days
                    </span>
                    <span>€{totalPrice}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>€{totalPrice}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {bookingStatus === "error" && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isPending || !startDate || !endDate || totalPrice === 0}>
            {isPending ? "Creating Booking..." : `Confirm Rental - €${totalPrice}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
