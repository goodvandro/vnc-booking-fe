"use client"

import type React from "react"

import { useState, useTransition, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Car, CheckCircle, AlertCircle } from "lucide-react"
import { createCarRentalBooking } from "@/app/actions/booking-actions"
import type { SelectedItem } from "@/lib/types"

interface CarRentalModalProps {
  isOpen: boolean
  onClose: () => void
  selectedItem: SelectedItem | null
  t: any
  user: any
}

export default function CarRentalModal({ isOpen, onClose, selectedItem, t, user }: CarRentalModalProps) {
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
  const [driverLicense, setDriverLicense] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

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
    if (selectedItem && startDate && endDate) {
      const startDateTime = new Date(startDate)
      const endDateTime = new Date(endDate)
      if (endDateTime <= startDateTime) return 0
      const timeDiff = endDateTime.getTime() - startDateTime.getTime()
      const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
      return numDays * selectedItem.data.price
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
    formData.append("carId", selectedItem.data.id.toString())

    startTransition(async () => {
      const result = await createCarRentalBooking(formData)
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
          setDriverLicense("")
          setStartDate("")
          setEndDate("")
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
            <h3 className="mb-2 text-lg font-semibold text-green-900">Rental Confirmed!</h3>
            <p className="mb-4 text-sm text-gray-600">Your car rental has been successfully booked.</p>
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
            <Car className="h-5 w-5" />
            Rent {selectedItem.data.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Car Info */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">{selectedItem.data.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedItem.data.type}</p>
            <p className="text-lg font-bold text-primary">${selectedItem.data.price}/day</p>
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
            <div>
              <Label htmlFor="driverLicense">Driver License</Label>
              <Input
                id="driverLicense"
                value={driverLicense}
                onChange={(e) => setDriverLicense(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Rental Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Rental Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Pickup Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Return Date *</Label>
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

          {/* Rental Summary */}
          {totalPrice > 0 && (
            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Rental Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pickup:</span>
                  <span>{startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Return:</span>
                  <span>{endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days:</span>
                  <span>
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))}
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
              {isPending ? "Creating Booking..." : `Confirm Rental - $${totalPrice}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
