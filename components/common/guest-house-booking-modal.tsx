"use client"

import type React from "react"

import { useState, useMemo, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Star, Users, CheckCircle, AlertCircle } from "lucide-react"
import { createGuestHouseBooking } from "@/app/actions/booking-actions"
import type { SelectedItem } from "@/lib/types"
import type { User } from "@clerk/nextjs/server"

interface GuestHouseBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedItem: SelectedItem | null
  t: any
  user: User | null | undefined
}

export default function GuestHouseBookingModal({
  isOpen,
  onClose,
  selectedItem,
  t,
  user,
}: GuestHouseBookingModalProps) {
  const [isPending, startTransition] = useTransition()
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle")
  const [bookingId, setBookingId] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress || "")
  const [phone, setPhone] = useState(user?.phoneNumbers?.[0]?.phoneNumber || "")
  const [guests, setGuests] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (selectedItem?.type === "guestHouse" && checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      if (checkOutDate <= checkInDate) return 0
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
      const numNights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      const pricePerNight = selectedItem.data.price
      return numNights * pricePerNight
    }
    return 0
  }, [selectedItem, checkIn, checkOut])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedItem) return

    const formData = new FormData()
    formData.append("firstName", firstName)
    formData.append("lastName", lastName)
    formData.append("email", email)
    formData.append("phone", phone)
    formData.append("guests", guests.toString())
    formData.append("specialRequests", specialRequests)
    formData.append("checkIn", checkIn)
    formData.append("checkOut", checkOut)
    formData.append("totalPrice", totalPrice.toString())
    formData.append("guestHouseId", "1") // You'll need to pass the actual guest house ID

    startTransition(async () => {
      const result = await createGuestHouseBooking(formData)

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
    setGuests(1)
    setSpecialRequests("")
    setCheckIn("")
    setCheckOut("")
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!selectedItem || selectedItem.type !== "guestHouse") return null

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
            <p className="mb-4 text-sm text-muted-foreground">Your booking has been successfully created.</p>
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
            <Calendar className="h-5 w-5" />
            Book {selectedItem.data.title}
          </DialogTitle>
        </DialogHeader>

        {/* Property Summary */}
        <div className="rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <img
              src={selectedItem.data.images?.[0] || "/placeholder.svg?height=80&width=80"}
              alt={selectedItem.data.title}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{selectedItem.data.title}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {selectedItem.data.location}
              </div>
              <div className="flex items-center gap-1 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(selectedItem.data.rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="ml-1 text-muted-foreground">({selectedItem.data.rating})</span>
              </div>
              <p className="text-lg font-bold">
                €{selectedItem.data.price}
                <span className="text-sm font-normal text-muted-foreground"> / night</span>
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
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">
                  Check-in Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">
                  Check-out Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">
                Number of Guests <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(Number.parseInt(e.target.value) || 1)}
                  className="w-24"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requests or requirements..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Booking Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Booking Summary</h3>
            <div className="rounded-lg bg-muted p-4 space-y-2">
              {checkIn && checkOut && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>
                      €{selectedItem.data.price} ×{" "}
                      {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))}{" "}
                      nights
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
          <Button type="submit" className="w-full" disabled={isPending || !checkIn || !checkOut || totalPrice === 0}>
            {isPending ? "Creating Booking..." : `Confirm Booking - €${totalPrice}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
