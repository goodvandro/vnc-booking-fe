"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { createGuestHouseBooking } from "@/app/actions/booking-actions"
import { useUser } from "@clerk/nextjs"

interface GuestHouseBookingModalProps {
  isOpen: boolean
  onClose: () => void
  guestHouse: {
    id: number
    title: string
    price: number
    location?: string
    images: string[]
  }
}

export default function GuestHouseBookingModal({ isOpen, onClose, guestHouse }: GuestHouseBookingModalProps) {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    guests: 1,
    specialRequests: "",
    checkIn: "",
    checkOut: "",
  })
  const [totalPrice, setTotalPrice] = useState(0)
  const [nights, setNights] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
    bookingId?: string
  }>({ type: null, message: "" })

  // Pre-fill user data from Clerk
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      }))
    }
  }, [user])

  // Calculate total price and nights
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
      const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24))

      if (calculatedNights > 0) {
        setNights(calculatedNights)
        setTotalPrice(calculatedNights * guestHouse.price)
      } else {
        setNights(0)
        setTotalPrice(0)
      }
    }
  }, [formData.checkIn, formData.checkOut, guestHouse.price])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number.parseInt(value) || 1 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const formDataToSubmit = new FormData()
      formDataToSubmit.append("firstName", formData.firstName)
      formDataToSubmit.append("lastName", formData.lastName)
      formDataToSubmit.append("email", formData.email)
      formDataToSubmit.append("phone", formData.phone)
      formDataToSubmit.append("guests", formData.guests.toString())
      formDataToSubmit.append("specialRequests", formData.specialRequests)
      formDataToSubmit.append("checkIn", formData.checkIn)
      formDataToSubmit.append("checkOut", formData.checkOut)
      formDataToSubmit.append("totalPrice", totalPrice.toString())
      formDataToSubmit.append("guestHouseId", guestHouse.id.toString())

      const result = await createGuestHouseBooking(formDataToSubmit)

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Booking created successfully!",
          bookingId: result.bookingId,
        })

        // Auto-close modal after 4 seconds
        setTimeout(() => {
          onClose()
          setSubmitStatus({ type: null, message: "" })
          setFormData({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.emailAddresses[0]?.emailAddress || "",
            phone: "",
            guests: 1,
            specialRequests: "",
            checkIn: "",
            checkOut: "",
          })
        }, 4000)
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to create booking",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const getMinCheckOutDate = () => {
    if (!formData.checkIn) return getTodayDate()
    const checkInDate = new Date(formData.checkIn)
    checkInDate.setDate(checkInDate.getDate() + 1)
    return checkInDate.toISOString().split("T")[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Guest House</DialogTitle>
        </DialogHeader>

        {submitStatus.type === "success" ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-2">{submitStatus.message}</p>
            {submitStatus.bookingId && (
              <p className="text-sm text-gray-500">
                Booking ID: <span className="font-mono font-semibold">{submitStatus.bookingId}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mt-4">This window will close automatically...</p>
          </div>
        ) : (
          <>
            {/* Guest House Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-4">
                {guestHouse.images[0] && (
                  <img
                    src={guestHouse.images[0] || "/placeholder.svg"}
                    alt={guestHouse.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{guestHouse.title}</h3>
                  {guestHouse.location && (
                    <p className="text-gray-600 flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {guestHouse.location}
                    </p>
                  )}
                  <p className="text-xl font-bold text-blue-600">
                    €{guestHouse.price} <span className="text-sm font-normal text-gray-500">per night</span>
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Booking Details</h4>
                <div>
                  <Label htmlFor="guests">Number of Guests *</Label>
                  <Input
                    id="guests"
                    name="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkIn">Check-in Date *</Label>
                    <Input
                      id="checkIn"
                      name="checkIn"
                      type="date"
                      min={getTodayDate()}
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Check-out Date *</Label>
                    <Input
                      id="checkOut"
                      name="checkOut"
                      type="date"
                      min={getMinCheckOutDate()}
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any special requests or requirements..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Booking Summary */}
              {nights > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Nights:</span>
                      <span>{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per night:</span>
                      <span>€{guestHouse.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span>{formData.guests}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>€{totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus.type === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{submitStatus.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-transparent"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting || nights <= 0}>
                  {isSubmitting ? "Creating Booking..." : `Confirm Booking - €${totalPrice}`}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
