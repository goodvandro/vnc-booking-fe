"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle } from "lucide-react"
import { createCarRentalBooking } from "@/app/actions/booking-actions"
import { useUser } from "@clerk/nextjs"

interface CarRentalModalProps {
  isOpen: boolean
  onClose: () => void
  car: {
    id: number
    title: string
    price: number
    seats: number
    transmission: string
    images: string[]
  }
}

export default function CarRentalModal({ isOpen, onClose, car }: CarRentalModalProps) {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    driverLicense: "",
    startDate: "",
    endDate: "",
  })
  const [totalPrice, setTotalPrice] = useState(0)
  const [days, setDays] = useState(0)
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

  // Calculate total price and days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const startDateTime = new Date(formData.startDate)
      const endDateTime = new Date(formData.endDate)
      const timeDiff = endDateTime.getTime() - startDateTime.getTime()
      const calculatedDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

      if (calculatedDays > 0) {
        setDays(calculatedDays)
        setTotalPrice(calculatedDays * car.price)
      } else {
        setDays(0)
        setTotalPrice(0)
      }
    }
  }, [formData.startDate, formData.endDate, car.price])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      formDataToSubmit.append("driverLicense", formData.driverLicense)
      formDataToSubmit.append("startDate", formData.startDate)
      formDataToSubmit.append("endDate", formData.endDate)
      formDataToSubmit.append("totalPrice", totalPrice.toString())
      formDataToSubmit.append("carId", car.id.toString())

      const result = await createCarRentalBooking(formDataToSubmit)

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
            driverLicense: "",
            startDate: "",
            endDate: "",
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

  const getMinEndDate = () => {
    if (!formData.startDate) return getTodayDate()
    const startDate = new Date(formData.startDate)
    startDate.setDate(startDate.getDate() + 1)
    return startDate.toISOString().split("T")[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Rent Car</DialogTitle>
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
            {/* Car Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-4">
                {car.images[0] && (
                  <img
                    src={car.images[0] || "/placeholder.svg"}
                    alt={car.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{car.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {car.seats} seats • {car.transmission}
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    €{car.price} <span className="text-sm font-normal text-gray-500">per day</span>
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
                <div>
                  <Label htmlFor="driverLicense">Driver License</Label>
                  <Input
                    id="driverLicense"
                    name="driverLicense"
                    value={formData.driverLicense}
                    onChange={handleInputChange}
                    placeholder="Driver license number (optional)"
                  />
                </div>
              </div>

              {/* Rental Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Rental Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Pickup Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      min={getTodayDate()}
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Return Date *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      min={getMinEndDate()}
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Rental Summary */}
              {days > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Rental Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Days:</span>
                      <span>{days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per day:</span>
                      <span>€{car.price}</span>
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
                <Button type="submit" className="flex-1" disabled={isSubmitting || days <= 0}>
                  {isSubmitting ? "Creating Booking..." : `Confirm Rental - €${totalPrice}`}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
