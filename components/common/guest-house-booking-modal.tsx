"use client"

import type React from "react"

import { useState, useTransition, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { createGuestHouseBooking } from "@/app/actions/booking-actions"
import type { SelectedItem } from "@/lib/types"

interface GuestHouseBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedItem: SelectedItem | null
  t: any
  user: any
}

export default function GuestHouseBookingModal({
  isOpen,
  onClose,
  selectedItem,
  t,
  user,
}: GuestHouseBookingModalProps) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    success: boolean
    error?: string
    bookingId?: string
    message?: string
  } | null>(null)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [guests, setGuests] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  // Pre-fill user data when modal opens
  useState(() => {
    if (user && isOpen) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setEmail(user.emailAddresses?.[0]?.emailAddress || "")
      setPhone(user.phoneNumbers?.[0]?.phoneNumber || "")
    }
  }, [user, isOpen])

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (selectedItem && checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      if (checkOutDate <= checkInDate) return 0
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
      const numNights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      return numNights * selectedItem.data.price
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
    formData.append("guestHouseId", selectedItem.data.id.toString())

    startTransition(async () => {
      const result = await createGuestHouseBooking(formData)
      setResult(result)

      if (result.success) {
        // Auto-close after 4 seconds
        setTimeout(() => {
          onClose()
          setResult(null)
          // Reset form
          setFirstName("")
          setLastName("")
          setEmail("")
          setPhone("")
          setGuests(1)
          setSpecialRequests("")
          setCheckIn("")
          setCheckOut("")
        }, 4000)
      }
    })
  }

  const handleClose = () => {
    onClose()
    setResult(null)
  }

  if (!selectedItem) return null

  // Success state
  if (result?.success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-green-900">Booking Confirmed!</h3>
            <p className="mb-4 text-sm text-gray-600">Your booking has been successfully created.</p>
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                Booking ID: <span className="font-mono">{result.bookingId}</span>
              </p>
            </div>
            <p className="text-xs text-gray-500">This window will close automatically in a few seconds.</p>
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
            <MapPin className="h-5 w-5" />
            Book {selectedItem.data.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest House Info */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">{selectedItem.data.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedItem.data.location}</p>
            <p className="text-lg font-bold text-primary">${selectedItem.data.price}/night</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Check-in Date *</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out Date *</Label>
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
            <div>
              <Label htmlFor="guests">Number of Guests *</Label>
              <Select value={guests.toString()} onValueChange={(value) => setGuests(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
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

          {/* Booking Summary */}
          {totalPrice > 0 && (
            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>
                    {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {result?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{result.error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || totalPrice <= 0} className="flex-1">
              {isPending ? "Creating Booking..." : `Confirm Booking - $${totalPrice}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
